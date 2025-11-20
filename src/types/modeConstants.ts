export const MODES = {
  BUBBLES: 'bubbles',
  FIREWORKS: 'fireworks',
  CONSTELLATION: 'constellation',
  MATRIX: 'matrix',
  NET: 'net',
  OFF: 'off'
} as const

export type Mode = typeof MODES[keyof typeof MODES]
