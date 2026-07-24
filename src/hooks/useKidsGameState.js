import { useCallback, useEffect, useState } from 'react'
import { loadState, saveState, clearState } from '../utils/storage'
import { JOKER_CHANCE, GRINCH_CHANCE, FINAL_GOES } from '../data/diceTable'
import { drawChallengeCard } from '../data/challengeCards'
import { drawGroupTask } from '../data/groupTasks'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export function useKidsGameState() {
  const [teams, setTeams] = useState(() => loadState('kidsPlayers', []))
  const [gifts, setGifts] = useState(() => loadState('kidsGifts', []))
  const [currentTeamIndex, setCurrentTeamIndex] = useState(() => loadState('kidsCurrentTeamIndex', 0))
  const [turnLog, setTurnLog] = useState(() => loadState('kidsTurnLog', []))
  const [screen, setScreen] = useState(() => loadState('kidsScreen', 'setup'))
  const [pending, setPending] = useState(null) // { rollValue, prompt, needsSelection, event, cardText, resolved }
  const [goesRemaining, setGoesRemaining] = useState(() => loadState('kidsGoesRemaining', null))
  const [gameOver, setGameOver] = useState(() => loadState('kidsGameOver', false))

  useEffect(() => saveState('kidsPlayers', teams), [teams])
  useEffect(() => saveState('kidsGifts', gifts), [gifts])
  useEffect(() => saveState('kidsCurrentTeamIndex', currentTeamIndex), [currentTeamIndex])
  useEffect(() => saveState('kidsTurnLog', turnLog), [turnLog])
  useEffect(() => saveState('kidsScreen', screen), [screen])
  useEffect(() => saveState('kidsGoesRemaining', goesRemaining), [goesRemaining])
  useEffect(() => saveState('kidsGameOver', gameOver), [gameOver])

  const addTeam = useCallback((name) => {
    setTeams((prev) => [...prev, { id: uid(), name, giftId: null, activeTaskText: null }])
  }, [])

  const removeTeam = useCallback((id) => {
    setTeams((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const renameTeam = useCallback((id, name) => {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)))
  }, [])

  const resetToSetup = useCallback(() => {
    clearState('kidsGifts')
    clearState('kidsCurrentTeamIndex')
    clearState('kidsTurnLog')
    clearState('kidsScreen')
    clearState('kidsGoesRemaining')
    clearState('kidsGameOver')
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
    setTeams((prev) => prev.map((t) => ({ ...t, activeTaskText: null })))
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
    setCurrentTeamIndex((prev) => {
      const next = (prev + 1) % teams.length
      const nextTeam = teams[next]
      if (nextTeam?.activeTaskText) {
        setTeams((prevTeams) =>
          prevTeams.map((t) => (t.id === nextTeam.id ? { ...t, activeTaskText: null } : t))
        )
      }
      return next
    })
    setPending(null)
  }, [teams])

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
              prompt: "Can't unwrap your own gift until it's been passed on — draw a Challenge Card instead!",
              cardText: drawChallengeCard(),
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
            setPending({
              rollValue: 1,
              prompt: 'Already unwrapped — draw a Challenge Card!',
              cardText: drawChallengeCard(),
            })
            logEvent({ type: 'bonus-card', teamId: team.id })
          }
          break
        }
        case 2:
          setPending({
            rollValue: 2,
            prompt: 'Pick a player to steal from — they draw a Challenge Card!',
            needsSelection: 'steal',
          })
          break
        case 3:
          setPending({
            rollValue: 3,
            prompt: 'Trade your gift with any player.',
            needsSelection: 'swap',
          })
          break
        case 4: {
          const leftTeam = teams[(teamIndex - 1 + teams.length) % teams.length]
          swapGifts(team.id, leftTeam.id)
          logEvent({ type: 'pass-left', teamId: team.id, targetTeamId: leftTeam.id })
          logEvent({ type: 'challenge', teamId: team.id })
          setPending({
            rollValue: 4,
            prompt: `Pass your gift to ${leftTeam.name}, then draw a Challenge Card!`,
            cardText: drawChallengeCard(),
          })
          break
        }
        case 5: {
          const rightTeam = teams[(teamIndex + 1) % teams.length]
          swapGifts(team.id, rightTeam.id)
          logEvent({ type: 'pass-right', teamId: team.id, targetTeamId: rightTeam.id })
          setPending({
            rollValue: 5,
            prompt: `Pass your gift to ${rightTeam.name}, then pick a player to draw a Challenge Card!`,
            needsSelection: 'give',
          })
          break
        }
        case 6: {
          const task = drawGroupTask()
          setPending({ rollValue: 6, prompt: 'Group Challenge! Everyone joins in:', cardText: task.text })
          logEvent({ type: 'group-challenge', teamId: team.id })
          if (task.sticky) {
            setTeams((prev) =>
              prev.map((t) => (t.id === team.id ? { ...t, activeTaskText: task.text } : t))
            )
          }
          break
        }
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
      const task = drawGroupTask()
      logEvent({ type: 'joker', teamId: currentTeam.id })
      setPending({ event: 'joker', cardText: task.text })
      if (task.sticky) {
        setTeams((prev) =>
          prev.map((t) => (t.id === currentTeam.id ? { ...t, activeTaskText: task.text } : t))
        )
      }
      return
    }

    const grinchRoll = Math.random()
    if (grinchRoll < GRINCH_CHANCE) {
      const holdingOwn = gifts.filter((g) => g.ownerId === g.originalOwnerId)
      const target = holdingOwn.length
        ? holdingOwn[Math.floor(Math.random() * holdingOwn.length)]
        : null
      logEvent({ type: 'grinch', teamId: target?.originalOwnerId ?? null })
      setPending({
        event: 'grinch',
        targetTeamId: target?.originalOwnerId ?? null,
        cardText: target ? drawChallengeCard() : null,
      })
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
              return { ...g, ownerId: team.id, stealCount: g.stealCount + 1, hasMoved: true }
            }
            if (myGift && g.id === myGift.id) {
              return { ...g, ownerId: targetTeamId, hasMoved: true }
            }
            return g
          })
        )
        logEvent({ type: 'steal', teamId: team.id, targetTeamId })
        setPending((prev) => ({ ...prev, resolved: true, cardText: drawChallengeCard(), resultTeamId: targetTeamId }))
      }

      if (pending.needsSelection === 'swap') {
        swapGifts(team.id, targetTeamId)
        logEvent({ type: 'swap', teamId: team.id, targetTeamId })
        setPending((prev) => ({ ...prev, resolved: true }))
      }

      if (pending.needsSelection === 'give') {
        logEvent({ type: 'give', teamId: team.id, targetTeamId })
        setPending((prev) => ({ ...prev, resolved: true, cardText: drawChallengeCard(), resultTeamId: targetTeamId }))
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
