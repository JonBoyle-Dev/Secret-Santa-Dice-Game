import { useCallback, useEffect, useState } from 'react'
import { loadState, saveState, clearState } from '../utils/storage'
import { DEFAULT_TEAM_NAMES } from '../data/defaultTeams'
import { JOKER_CHANCE, GRINCH_CHANCE, FINAL_GOES } from '../data/diceTable'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function makeTeams(names) {
  return names.map((name) => ({ id: uid(), name, giftId: null }))
}

const initialTeams = () => loadState('teams', makeTeams(DEFAULT_TEAM_NAMES))

export function useGameState() {
  const [teams, setTeams] = useState(initialTeams)
  const [gifts, setGifts] = useState(() => loadState('gifts', []))
  const [currentTeamIndex, setCurrentTeamIndex] = useState(() => loadState('currentTeamIndex', 0))
  const [turnLog, setTurnLog] = useState(() => loadState('turnLog', []))
  const [screen, setScreen] = useState(() => loadState('screen', 'setup'))
  const [pending, setPending] = useState(null) // { rollValue, actionKey, prompt, needsSelection, event }
  const [goesRemaining, setGoesRemaining] = useState(() => loadState('goesRemaining', null))
  const [gameOver, setGameOver] = useState(() => loadState('gameOver', false))

  useEffect(() => saveState('teams', teams), [teams])
  useEffect(() => saveState('gifts', gifts), [gifts])
  useEffect(() => saveState('currentTeamIndex', currentTeamIndex), [currentTeamIndex])
  useEffect(() => saveState('turnLog', turnLog), [turnLog])
  useEffect(() => saveState('screen', screen), [screen])
  useEffect(() => saveState('goesRemaining', goesRemaining), [goesRemaining])
  useEffect(() => saveState('gameOver', gameOver), [gameOver])

  const addTeam = useCallback((name) => {
    setTeams((prev) => [...prev, { id: uid(), name, giftId: null }])
  }, [])

  const removeTeam = useCallback((id) => {
    setTeams((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const renameTeam = useCallback((id, name) => {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)))
  }, [])

  const resetToSetup = useCallback(() => {
    clearState('gifts')
    clearState('currentTeamIndex')
    clearState('turnLog')
    clearState('screen')
    clearState('goesRemaining')
    clearState('gameOver')
    setGifts([])
    setCurrentTeamIndex(0)
    setTurnLog([])
    setPending(null)
    setGoesRemaining(null)
    setGameOver(false)
    setScreen('setup')
  }, [])

  const startGame = useCallback(() => {
    const newGifts = teams.map((t) => ({
      id: uid(),
      originalOwnerId: t.id,
      ownerId: t.id,
      stealCount: 0,
      unwrapped: false,
      hasMoved: false,
    }))
    setGifts(newGifts)
    setCurrentTeamIndex(0)
    setTurnLog([])
    setPending(null)
    setGoesRemaining(null)
    setGameOver(false)
    setScreen('board')
  }, [teams])

  const currentTeam = teams[currentTeamIndex] || null

  const giftForTeam = useCallback(
    (teamId) => gifts.find((g) => g.ownerId === teamId) || null,
    [gifts]
  )

  const logEvent = useCallback((entry) => {
    setTurnLog((prev) => [...prev, { ...entry, at: prev.length }])
  }, [])

  const advanceTurn = useCallback(() => {
    setCurrentTeamIndex((prev) => (prev + 1) % teams.length)
    setPending(null)
  }, [teams.length])

  const swapGifts = useCallback(
    (teamAId, teamBId) => {
      const giftA = giftForTeam(teamAId)
      const giftB = giftForTeam(teamBId)
      if (!giftA || !giftB) return
      setGifts((prev) =>
        prev.map((g) => {
          if (g.id === giftA.id) return { ...g, ownerId: teamBId, hasMoved: true }
          if (g.id === giftB.id) return { ...g, ownerId: teamAId, hasMoved: true }
          return g
        })
      )
    },
    [giftForTeam]
  )

  const resolveRoll = useCallback(
    (value, team) => {
      if (!team) return
      const teamIndex = teams.findIndex((t) => t.id === team.id)

      switch (value) {
        case 1: {
          const gift = giftForTeam(team.id)
          const isOwnUntouchedGift = gift && gift.ownerId === gift.originalOwnerId && !gift.hasMoved
          if (isOwnUntouchedGift) {
            setPending({
              rollValue: 1,
              prompt: "Can't unwrap your own gift until it's been passed on — take a sip instead!",
            })
            logEvent({ type: 'unwrap-blocked', teamId: team.id })
          } else if (gift && !gift.unwrapped) {
            const updatedGifts = gifts.map((g) => (g.id === gift.id ? { ...g, unwrapped: true } : g))
            setGifts(updatedGifts)
            if (goesRemaining === null && updatedGifts.every((g) => g.unwrapped)) {
              setGoesRemaining(FINAL_GOES)
            }
            setPending({ rollValue: 1, prompt: "Unwrap the gift you're currently holding!" })
            logEvent({ type: 'unwrap', teamId: team.id })
          } else {
            setPending({ rollValue: 1, prompt: 'Already unwrapped — take a bonus sip!' })
            logEvent({ type: 'bonus-sip', teamId: team.id })
          }
          break
        }
        case 2:
          setPending({
            rollValue: 2,
            prompt: 'Pick a team to steal from — they drink!',
            needsSelection: 'steal',
          })
          break
        case 3:
          setPending({
            rollValue: 3,
            prompt: 'Trade your gift with any team.',
            needsSelection: 'swap',
          })
          break
        case 4: {
          const leftTeam = teams[(teamIndex - 1 + teams.length) % teams.length]
          swapGifts(team.id, leftTeam.id)
          logEvent({ type: 'pass-left', teamId: team.id, targetTeamId: leftTeam.id })
          logEvent({ type: 'drink', teamId: team.id })
          setPending({
            rollValue: 4,
            prompt: `Pass your gift to ${leftTeam.name}, then take a sip!`,
          })
          break
        }
        case 5: {
          const rightTeam = teams[(teamIndex + 1) % teams.length]
          swapGifts(team.id, rightTeam.id)
          logEvent({ type: 'pass-right', teamId: team.id, targetTeamId: rightTeam.id })
          setPending({
            rollValue: 5,
            prompt: `Pass your gift to ${rightTeam.name}, then pick a team to drink!`,
            needsSelection: 'give',
          })
          break
        }
        case 6:
          setPending({ rollValue: 6, prompt: 'Everyone drinks! 🍻' })
          logEvent({ type: 'group-sip', teamId: team.id })
          break
        default:
          break
      }
    },
    [teams, gifts, giftForTeam, logEvent, swapGifts, goesRemaining]
  )

  const rollDice = useCallback(() => {
    if (!currentTeam || gameOver) return

    if (goesRemaining !== null) {
      const next = goesRemaining - 1
      setGoesRemaining(next)
      if (next <= 0) {
        setGameOver(true)
      }
    }

    const jokerRoll = Math.random()
    if (jokerRoll < JOKER_CHANCE) {
      logEvent({ type: 'joker', teamId: currentTeam.id })
      setPending({ event: 'joker' })
      return
    }

    const grinchRoll = Math.random()
    if (grinchRoll < GRINCH_CHANCE) {
      const holdingOwn = gifts.filter((g) => g.ownerId === g.originalOwnerId)
      const target = holdingOwn.length
        ? holdingOwn[Math.floor(Math.random() * holdingOwn.length)]
        : null
      logEvent({ type: 'grinch', teamId: target?.originalOwnerId ?? null })
      setPending({ event: 'grinch', targetTeamId: target?.originalOwnerId ?? null })
      return
    }

    const value = 1 + Math.floor(Math.random() * 6)
    resolveRoll(value, currentTeam)
  }, [currentTeam, gameOver, goesRemaining, gifts, logEvent, resolveRoll])

  const resolveSelection = useCallback(
    (targetTeamId) => {
      const team = currentTeam
      if (!team || !pending) return

      if (pending.needsSelection === 'steal') {
        const targetGift = giftForTeam(targetTeamId)
        const myGift = giftForTeam(team.id)
        if (!targetGift) return
        setGifts((prev) =>
          prev.map((g) => {
            if (g.id === targetGift.id) {
              return {
                ...g,
                ownerId: team.id,
                stealCount: g.stealCount + 1,
                hasMoved: true,
              }
            }
            if (myGift && g.id === myGift.id) {
              return { ...g, ownerId: targetTeamId, hasMoved: true }
            }
            return g
          })
        )
        logEvent({ type: 'steal', teamId: team.id, targetTeamId })
        setPending((prev) => ({ ...prev, resolved: true }))
      }

      if (pending.needsSelection === 'swap') {
        swapGifts(team.id, targetTeamId)
        logEvent({ type: 'swap', teamId: team.id, targetTeamId })
        setPending((prev) => ({ ...prev, resolved: true }))
      }

      if (pending.needsSelection === 'give') {
        logEvent({ type: 'give', teamId: team.id, targetTeamId })
        setPending((prev) => ({ ...prev, resolved: true }))
      }
    },
    [currentTeam, pending, giftForTeam, logEvent, swapGifts]
  )

  const dismissEvent = useCallback(() => {
    advanceTurn()
  }, [advanceTurn])

  const nextTurn = useCallback(() => {
    advanceTurn()
  }, [advanceTurn])

  return {
    teams,
    gifts,
    currentTeam,
    currentTeamIndex,
    turnLog,
    screen,
    pending,
    goesRemaining,
    gameOver,
    setScreen,
    addTeam,
    removeTeam,
    renameTeam,
    startGame,
    resetToSetup,
    rollDice,
    resolveSelection,
    dismissEvent,
    nextTurn,
    giftForTeam,
  }
}
