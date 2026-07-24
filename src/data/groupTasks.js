export const GROUP_TASKS = [
  { text: 'Everyone dances for 5 seconds, then shouts "Freeze!" — last one to freeze loses', sticky: false },
  { text: 'Everyone do their best reindeer impression', sticky: false },
  { text: 'Everyone strike a Christmas-themed pose — funniest pose wins', sticky: false },
  { text: 'Hum a carol or song — everyone else has to guess what it is', sticky: false },
  { text: 'Pull a silly face and hold it for 10 seconds', sticky: false },
  { text: 'Start a Mexican wave whenever you want during your turn', sticky: false },
  {
    text: 'Until your next turn: keep asking anyone who walks past or looks at you, "Do you know where I parked my sled?"',
    sticky: true,
  },
  {
    text: 'Until your next turn: every time you say "Santa," everyone has to shout "Ho ho ho!"',
    sticky: true,
  },
]

export function drawGroupTask() {
  return GROUP_TASKS[Math.floor(Math.random() * GROUP_TASKS.length)]
}
