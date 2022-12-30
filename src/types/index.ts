export interface BlockState extends getSiblings {
  x: number
  y: number
  revealed: boolean
  isBall: boolean
  lightOn: boolean
}

export type directionType = 'top' | 'bottom' | 'left' | 'right'

export type directionCornerType = 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'

export type directionAllType = directionType | directionCornerType

interface getSiblings {
  getSibling: (direction: directionAllType) => BlockState | undefined
}
