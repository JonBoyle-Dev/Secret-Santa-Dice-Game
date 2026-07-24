export const KIDS_DICE_ACTIONS = {
  1: {
    key: 'unwrap',
    label: 'Unwrap',
    description:
      "Unwrap the gift you're holding. You can't unwrap your own gift until it's been passed on to someone else at least once — draw a Challenge Card instead. Already unwrapped? Draw a Challenge Card too.",
  },
  2: {
    key: 'steal',
    label: 'Steal',
    description: 'Pick a player and steal their gift — they draw a Challenge Card! No limit on how many times a gift can be stolen.',
  },
  3: {
    key: 'swap',
    label: 'Swap',
    description: 'Trade gifts with any player you choose.',
  },
  4: {
    key: 'pass-left',
    label: 'Pass Left',
    description: 'Pass your gift to the player on your left, then draw a Challenge Card.',
  },
  5: {
    key: 'pass-right',
    label: 'Pass Right',
    description: 'Pass your gift to the player on your right, then pick a player to draw a Challenge Card.',
  },
  6: {
    key: 'group-challenge',
    label: 'Group Challenge',
    description: 'Everyone does a Group Task together, then play passes to the next player.',
  },
}
