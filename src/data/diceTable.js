export const DICE_ACTIONS = {
  1: {
    key: 'unwrap',
    label: 'Unwrap',
    description:
      "Unwrap the gift you're holding. You can't unwrap your own gift until it's been passed on to someone else at least once.",
  },
  2: {
    key: 'steal',
    label: 'Steal',
    description: 'Pick a team and steal their gift — they drink! No limit on how many times a gift can be stolen.',
  },
  3: {
    key: 'swap',
    label: 'Swap',
    description: 'Trade gifts with any team you choose.',
  },
  4: {
    key: 'pass-left',
    label: 'Pass Left',
    description: 'Pass your gift to the team on your left, then take a sip.',
  },
  5: {
    key: 'pass-right',
    label: 'Pass Right',
    description: 'Pass your gift to the team on your right, then pick a team to drink.',
  },
  6: {
    key: 'group-sip',
    label: 'Group Sip',
    description: 'Everyone drinks! Then play passes to the next team.',
  },
}

export const JOKER_CHANCE = 0.07
export const GRINCH_CHANCE = 0.07
export const FINAL_GOES = 3
