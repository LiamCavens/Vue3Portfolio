export const MODES = {
  BUBBLES: 'bubbles',
  FIREWORKS: 'fireworks',
  CONSTELLATION: 'constellation',
  MATRIX: 'matrix',
  OFF: 'off'
} as const

export type Mode = typeof MODES[keyof typeof MODES]
