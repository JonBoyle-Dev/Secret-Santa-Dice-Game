import { useCallback, useEffect, useState } from 'react'
import { loadState, saveState, clearState } from '../utils/storage'
import { DEFAULT_TEAM_NAMES } from '../data/defaultTeams'
import { JOKER_CHANCE, GRINCH_CHANCE } from '../data/diceTable'

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

  useEffect(() => saveState('teams', teams), [teams])
  useEffect(() => saveState('gifts', gifts), [gifts])
  useEffect(() => saveState('currentTeamIndex', currentTeamIndex), [currentTeamIndex])
  useEffect(() => saveState('turnLog', turnLog), [turnLog])
  useEffect(() => saveState('screen', screen), [screen])

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
    setGifts([])
    setCurrentTeamIndex(0)
    setTurnLog([])
    setPending(null)
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

  const resolveRoll = useCallback((value, team) => {
    if (!team) return

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
          setGifts((prev) => prev.map((g) => (g.id === gift.id ? { ...g, unwrapped: true } : g)))
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
      case 4:
        setPending({ rollValue: 4, prompt: 'Take a sip!' })
        logEvent({ type: 'drink', teamId: team.id })
        break
      case 5:
        setPending({
          rollValue: 5,
          prompt: 'Pick a team to drink!',
          needsSelection: 'give',
        })
        break
      case 6:
        setPending({
          rollValue: 6,
          prompt: 'Take a sip, then roll again!',
          chainRoll: true,
        })
        logEvent({ type: 'wild', teamId: team.id })
        break
      default:
        break
    }
  }, [giftForTeam, logEvent])

  const rollDice = useCallback(() => {
    if (!currentTeam) return

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
  }, [currentTeam, gifts, logEvent, resolveRoll])

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
        const myGift = giftForTeam(team.id)
        const targetGift = giftForTeam(targetTeamId)
        if (!myGift || !targetGift) return
        setGifts((prev) =>
          prev.map((g) => {
            if (g.id === myGift.id) return { ...g, ownerId: targetTeamId, hasMoved: true }
            if (g.id === targetGift.id) return { ...g, ownerId: team.id, hasMoved: true }
            return g
          })
        )
        logEvent({ type: 'swap', teamId: team.id, targetTeamId })
        setPending((prev) => ({ ...prev, resolved: true }))
      }

      if (pending.needsSelection === 'give') {
        logEvent({ type: 'give', teamId: team.id, targetTeamId })
        setPending((prev) => ({ ...prev, resolved: true }))
      }
    },
    [currentTeam, pending, giftForTeam, logEvent]
  )

  const dismissEvent = useCallback(() => {
    advanceTurn()
  }, [advanceTurn])

  const nextTurn = useCallback(() => {
    if (pending?.chainRoll) {
      setPending(null)
      // same team rolls again — index unchanged
      return
    }
    advanceTurn()
  }, [pending, advanceTurn])

  return {
    teams,
    gifts,
    currentTeam,
    currentTeamIndex,
    turnLog,
    screen,
    pending,
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
