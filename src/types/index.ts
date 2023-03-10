export interface BlockState extends getSiblings {
  x: number
  y: number
  revealed: boolean
  flagged: boolean
  locked: boolean
  isBall: boolean
  lightOn: boolean
  lightFrom?: directionType
  lightTo?: directionType
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
  isHover: boolean
  text: 'H' | 'R' | number | undefined
  lightPath: LightPath
  coLighter: Lighter | undefined
}

export type LightPath = { block: BlockState; from: directionType; to: directionType }[]

export type directionType = 'top' | 'bottom' | 'left' | 'right'

export type directionCornerType = 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'

export type directionAllType = directionType | directionCornerType

interface getSiblings {
  getSibling: (direction: directionAllType) => BlockState | undefined
}

