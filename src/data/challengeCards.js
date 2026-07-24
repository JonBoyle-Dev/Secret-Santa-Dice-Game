export const CHALLENGE_CARDS = [
  'Do your best celebrity impression for 10 seconds',
  'Freestyle rap for 10 seconds (any topic)',
  'Do a silly dance',
  '3 push-ups or star jumps',
  'Shout "Everybody freeze!" — last person to freeze loses',
  'Act out a movie scene, everyone else guesses the movie',
  'High-five every player',
  'Do your best dance move, everyone copies it',
  'Impression of a teacher',
  'Tell a joke in an alien language, with sound effects',
  'Talk in an accent until your next turn',
  'Freeze in a superhero pose for 10 seconds',
]

export function drawChallengeCard() {
  return CHALLENGE_CARDS[Math.floor(Math.random() * CHALLENGE_CARDS.length)]
}
