export const MODES = {
  BUBBLES: 'bubbles',
  FIREWORKS: 'fireworks',
  CONSTELLATION: 'constellation',
  MATRIX: 'matrix'
} as const

export type Mode = typeof MODES[keyof typeof MODES]
