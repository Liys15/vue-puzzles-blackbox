export interface BlockState extends getSiblings {
  x: number
  y: number
  revealed: boolean
  isBall: boolean
  lightOn: boolean
}

export interface Lighters {
  top: Lighter[]
  bottom: Lighter[]
  left: Lighter[]
  right: Lighter[]
}

export interface Lighter {
  loc: directionType
  i: number
  isOn: boolean
  type: 'H' | 'R' | number | undefined
  lightPath: LightPath
  connectedLighter: Lighter | undefined
}

export type LightPath = { x: number; y: number; from: directionType; to: directionType }[]

export type directionType = 'top' | 'bottom' | 'left' | 'right'

export type directionCornerType = 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'

export type directionAllType = directionType | directionCornerType

interface getSiblings {
  getSibling: (direction: directionAllType) => BlockState | undefined
}
