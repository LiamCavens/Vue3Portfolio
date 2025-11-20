export const MODES = {
  BUBBLES: 'bubbles',
  FIREWORKS: 'fireworks',
  CONSTELLATION: 'constellation'
} as const

export type Mode = typeof MODES[keyof typeof MODES]
