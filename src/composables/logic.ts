import type { BlockState, LightPath, Lighter, Lighters, directionAllType, directionType } from '~/types'

interface GameState {
  gameDifficulty: 'Easy' | 'Medium' | 'Hard'
  gameState: 'play' | 'won' | 'lost'
  board: BlockState[][]
  lighters: Lighters
  solutionBoard: BlockState[][]
}

const direction = ['top', 'bottom', 'left', 'right']

function randomIntNums(min: number, max: number, num: number) {
  const arr: number[] = []
  while (arr.length < num) {
    const rdmInt = Math.floor(min + Math.random() * (max - min))
    if (arr.includes(rdmInt))
      continue
    arr.push(rdmInt)
  }
  return arr
}

function reverseDirection(from: directionType): directionType {
  switch (from) {
    case 'top':
      return 'bottom'
    case 'bottom':
      return 'top'
    case 'left':
      return 'right'
    case 'right':
      return 'left'
  }
}

export class GamePlay {
  state = ref<GameState>({} as GameState)
  static width = 0
  static height = 0
  static ballnum = 0

  constructor(defaultGame: 'Easy' | 'Medium' | 'Hard') {
    this.state.value = {
      gameDifficulty: defaultGame,
      gameState: 'play',
      board: [] as BlockState[][],
      lighters: {} as Lighters,
      solutionBoard: [] as BlockState[][]
    }
    this.reset(defaultGame)
  }

  reset(state: 'Easy' | 'Medium' | 'Hard') {
    this.state.value.gameDifficulty = state
    switch (this.state.value.gameDifficulty) {
      case 'Easy':
        GamePlay.width = 5
        GamePlay.height = 5
        GamePlay.ballnum = 3
        break
      case 'Medium':
        GamePlay.width = 8
        GamePlay.height = 8
        GamePlay.ballnum = 5
        break
      case 'Hard':
        GamePlay.width = 10
        GamePlay.height = 10
        GamePlay.ballnum = 5
        break
    }
    this.state.value.gameState = 'play'
    const board = Array.from({ length: GamePlay.height }, (_, row) =>
      Array.from({ length: GamePlay.width }, (_, col): BlockState => ({
        x: col,
        y: row,
        revealed: true,
        isBall: false,
        lightOn: false,
        getSibling(direction: directionAllType) {
          switch (direction) {
            case 'top':
              if (this.y - 1 < 0)
                return
              return board[this.y - 1][this.x]
            case 'bottom':
              if (this.y + 1 >= GamePlay.height)
                return
              return board[this.y + 1][this.x]
            case 'left':
              if (this.x - 1 < 0)
                return
              return board[this.y][this.x - 1]
            case 'right':
              if (this.x + 1 >= GamePlay.width)
                return
              return board[this.y][this.x + 1]
            case 'leftTop':
              if (this.x - 1 < 0 || this.y - 1 < 0)
                return
              return board[this.y - 1][this.x - 1]
            case 'leftBottom':
              if (this.x - 1 < 0 || this.y + 1 >= GamePlay.height)
                return
              return board[this.y + 1][this.x - 1]
            case 'rightTop':
              if (this.x + 1 >= GamePlay.width || this.y - 1 < 0)
                return
              return board[this.y - 1][this.x + 1]
            case 'rightBottom':
              if (this.x + 1 >= GamePlay.width || this.y + 1 >= GamePlay.height)
                return
              return board[this.y + 1][this.x + 1]
          }
        },
      }),
      ),
    )
    this.state.value.board = board
    this.state.value.solutionBoard = []

    this.state.value.lighters = {
      top: Array.from({ length: GamePlay.width }, (_, idx) => ({
        loc: 'top',
        i: idx,
        text: undefined,
        isOn: false,
        lightPath: [],
      })),
      bottom: Array.from({ length: GamePlay.width }, (_, idx) => ({
        loc: 'bottom',
        i: idx,
        text: undefined,
        isOn: false,
        lightPath: [],
      })),
      left: Array.from({ length: GamePlay.height }, (_, idx) => ({
        loc: 'left',
        i: idx,
        text: undefined,
        isOn: false,
        lightPath: [],
      })),
      right: Array.from({ length: GamePlay.height }, (_, idx) => ({
        loc: 'right',
        i: idx,
        text: undefined,
        isOn: false,
        lightPath: [],
      })),
    }

    this.generateBalls()

    direction.forEach(key => {
      this.state.value.lighters[key as keyof Lighters].forEach(lighter => {
        const lightpath = this.getLightPath(lighter)
        lighter.lightPath = lightpath
      })
    })

    const lighterTextArr = this.getLightersTextArr()
    direction.forEach(key => {
      this.state.value.lighters[key as keyof Lighters]
        .forEach(lighter => lighter.text=lighterTextArr[key as keyof Lighters][lighter.i])
    })
  }

  checkSolution() {
    const solutionLighterTextArr = this.getLightersTextArr(this.state.value.solutionBoard)
    const solutionFlat = [
      ...solutionLighterTextArr['top'],
      ...solutionLighterTextArr['bottom'],
      ...solutionLighterTextArr['left'],
      ...solutionLighterTextArr['right'],
    ]
    const questionFlat = [
      ...this.state.value.lighters['top'],
      ...this.state.value.lighters['bottom'],
      ...this.state.value.lighters['left'],
      ...this.state.value.lighters['right'],
    ].map(lighter => lighter.text)

    return solutionFlat.every((solution, idx) => solution === questionFlat[idx])
  }

  private generateBalls() {
    const rdmArr = randomIntNums(0, GamePlay.width * GamePlay.height, GamePlay.ballnum)
    rdmArr.forEach((pos) => {
      const y = Math.floor(pos / GamePlay.width)
      const x = pos % GamePlay.width
      this.state.value.board[y][x].isBall = true
    })
  }

  private getLightersTextArr(soultion?: BlockState[][]) {
    if(!this.state.value.solutionBoard) {
      console.log('@');
    }
    const lighterTextArr = {
      top: new Array<Lighter["text"]>(GamePlay.width),
      bottom: new Array<Lighter["text"]>(GamePlay.width),
      left: new Array<Lighter["text"]>(GamePlay.height),
      right: new Array<Lighter["text"]>(GamePlay.height),
    }
    let initNum = 1
    direction.forEach(key =>
      this.state.value.lighters[key as (keyof Lighters)].forEach((lighter) => {
        const lightpath = lighter.lightPath
        if(!lightpath.length)
          lighterTextArr[lighter.loc][lighter.i] = 'H'
        else if(lightpath.length === 1)
          lighterTextArr[lighter.loc][lighter.i] = 'R'
        else {
          const endBlock = lightpath[lightpath.length - 1].block
          const toDirection = lightpath[lightpath.length - 1].to
          const nextBlock = endBlock.getSibling(toDirection)
          if (nextBlock) {
            lighterTextArr[lighter.loc][lighter.i] = 'H'
          }
          else {
            let connectedLighter: Lighter = {} as Lighter
            if (toDirection === 'top')
              connectedLighter = this.state.value.lighters.top[endBlock.x]
            else if (toDirection === 'bottom')
              connectedLighter = this.state.value.lighters.bottom[endBlock.x]
            else if (toDirection === 'left')
              connectedLighter = this.state.value.lighters.left[endBlock.y]
            else if (toDirection === 'right')
              connectedLighter = this.state.value.lighters.right[endBlock.y]
            if (connectedLighter === lighter) {
              lighterTextArr[lighter.loc][lighter.i] = 'R'
            }
            else {
              lighterTextArr[lighter.loc][lighter.i] = initNum
              lighterTextArr[connectedLighter.loc][connectedLighter.i] = initNum
              initNum += 1
            }
          }
        }
      })
    )
    return lighterTextArr
  }

  private getLightPath(lighter: Lighter) {
    const emitLight = (block: BlockState, fromDirection: directionType) => {
      if (!block)
        return
      let pushblock = block
      let toDirection: directionType = reverseDirection(fromDirection)
      if (block.getSibling(toDirection)?.isBall) {
        tmplightpath.push({ block, from: fromDirection, to: toDirection })
        return
      }
      switch (toDirection) {
        case 'top':
          if (block.getSibling('leftTop')?.isBall && block.getSibling('rightTop')?.isBall){
            tmplightpath.push({block, from:fromDirection, to: toDirection})
            pushblock = block.getSibling('top')!
            toDirection = 'bottom'
          }
          else if (block.getSibling('leftTop')?.isBall)
            toDirection = 'right'
          else if (block.getSibling('rightTop')?.isBall)
            toDirection = 'left'
          break
        case 'bottom':
          if (block.getSibling('leftBottom')?.isBall && block.getSibling('rightBottom')?.isBall){
            tmplightpath.push({block, from:fromDirection, to: toDirection})
            pushblock = block.getSibling('bottom')!
            toDirection = 'top'
          }
          else if (block.getSibling('leftBottom')?.isBall)
            toDirection = 'right'
          else if (block.getSibling('rightBottom')?.isBall)
            toDirection = 'left'
          break
        case 'left':
          if (block.getSibling('leftTop')?.isBall && block.getSibling('leftBottom')?.isBall){
            tmplightpath.push({block, from:fromDirection, to: toDirection})
            pushblock = block.getSibling('left')!
            toDirection = 'right'
          }
          else if (block.getSibling('leftTop')?.isBall)
            toDirection = 'bottom'
          else if (block.getSibling('leftBottom')?.isBall)
            toDirection = 'top'
          break
        case 'right':
          if (block.getSibling('rightTop')?.isBall && block.getSibling('rightBottom')?.isBall){
            tmplightpath.push({block, from:fromDirection, to: toDirection})
            pushblock = block.getSibling('right')!
            toDirection = 'left'
          }
          else if (block.getSibling('rightTop')?.isBall)
            toDirection = 'bottom'
          else if (block.getSibling('rightBottom')?.isBall)
            toDirection = 'top'
          break
      }
      tmplightpath.push({ block:pushblock, from: fromDirection, to: toDirection })
      emitLight(pushblock.getSibling(toDirection)!, reverseDirection(toDirection))
    }

    let tmplightpath = [] as LightPath
    let initBlock: BlockState
    switch (lighter.loc) {
      case 'top':
        initBlock = this.state.value.board[0][lighter.i]
        tmplightpath.push({block:initBlock, from: 'top', to: 'bottom'})
        break
      case 'bottom':
        initBlock = this.state.value.board[GamePlay.width - 1][lighter.i]
        tmplightpath.push({block:initBlock, from: 'bottom', to: 'top'})
        break
      case 'left':
        initBlock = this.state.value.board[lighter.i][0]
        tmplightpath.push({block:initBlock, from: 'left', to: 'right'})
        break
      case 'right':
        initBlock = this.state.value.board[lighter.i][GamePlay.width - 1]
        tmplightpath.push({block:initBlock, from: 'right', to: 'left'})
        break
    }
    if (initBlock.isBall) {
      return []
    }
    if (lighter.loc === 'top' || lighter.loc === 'bottom') {
      if (initBlock.getSibling('left')?.isBall || initBlock.getSibling('right')?.isBall) {
        tmplightpath[0].to = tmplightpath[0].from
        return tmplightpath
      }
    }
    else if (lighter.loc === 'left' || lighter.loc === 'right') {
      if (initBlock.getSibling('top')?.isBall || initBlock.getSibling('bottom')?.isBall) {
        tmplightpath[0].to = tmplightpath[0].from
        return tmplightpath
      }
    }
    emitLight(initBlock, lighter.loc)

    return tmplightpath

  }



  switchOn(lighter: Lighter) {
    this.state.value.board.flat().forEach(block => block.lightOn = false)
    lighter.lightPath.forEach(({ block, from, to }, idx) => {
      setTimeout(() => {
        block.lightFrom = from
        block.lightTo = to
        block.lightOn = true
      }, 35 * idx)
    })
  }
}
