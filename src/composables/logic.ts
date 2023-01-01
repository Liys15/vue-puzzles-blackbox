import type { BlockState, LightPath, Lighter, Lighters, directionAllType, directionType } from '~/types'

interface GameState {
  gameDifficulty: 'Easy' | 'Medium' | 'Hard'
  gameState: 'play' | 'won' | 'lost'
  board: BlockState[][]
  lighters: Lighters
}

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
  static direction = ['top', 'bottom', 'left', 'right']

  constructor(defaultGame: 'Easy' | 'Medium' | 'Hard') {
    this.state.value = {
      gameDifficulty: defaultGame,
      gameState: 'play',
      board: this.createBoard(),
      lighters: {} as Lighters,
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
    this.state.value.board = this.createBoard()
    this.state.value.lighters = this.createLighters()

    this.generateBalls()

    GamePlay.direction.forEach(key => {
      this.state.value.lighters[key as keyof Lighters].forEach(lighter => {
        const lightpath = this.getLightPath(lighter)
        lighter.lightPath = lightpath
      })
    })

    const lighterTextArr = this.getLightersTextArr(this.state.value.lighters)
    GamePlay.direction.forEach(key => {
      this.state.value.lighters[key as keyof Lighters]
        .forEach(lighter => lighter.text = lighterTextArr[key as keyof Lighters][lighter.i])
    })
  }

  checkSolution() {
    const solutionBoard = this.createBoard()
    this.state.value.board.forEach((row, y) => {
      row.forEach((block, x) => {
        block.revealed = true
        if (block.flagged)
          solutionBoard[y][x].isBall = true
      })
    })
    const solutionLighters = this.createLighters()
    GamePlay.direction.forEach(key => {
      solutionLighters[key as keyof Lighters].forEach(lighter => {
        const lightpath = this.getLightPath(lighter, solutionBoard)
        lighter.lightPath = lightpath
      })
    })

    const solutionLighterTextArr = this.getLightersTextArr(solutionLighters)
    const solutionFlat = this.flatLighters(solutionLighterTextArr)
    const questionFlat = this.flatLighters(this.state.value.lighters).map(lighter => lighter.text)
    if (solutionFlat.every((solution, idx) => solution === questionFlat[idx])) {
      this.state.value.gameState = 'won'
    }
    else {
      this.state.value.gameState = 'lost'
    }
    return
  }

  getCoLighters(lighter: Lighter) {
    if (typeof lighter.text === 'number') {
      const idxNum = lighter.text
      const lightersflat = this.flatLighters(this.state.value.lighters)
      return lightersflat.find(e => e.text === idxNum)?.coLighter
    }
    else
      return undefined
  }


  handleLighterClick(lighter: Lighter) {
    if (this.state.value.gameState === 'play') {
      const idx = lighter.i
      let tmpArr = [] as BlockState[]
      if (lighter.loc === 'top' || lighter.loc === 'bottom')
        for (let y = 0; y < GamePlay.height; y++) {
          tmpArr.push(this.state.value.board[y][idx])
        }
      else
        tmpArr = this.state.value.board[idx]
      if (tmpArr.every(e => e.locked))
        tmpArr.forEach(e => e.locked = false)
      else
        tmpArr.forEach(e => e.locked = true)
    }
  }

  handeleRightClick(block: BlockState) {
    if (this.state.value.gameState === 'play')
      block.flagged = !block.flagged
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

  private flatLighters<T>(lightersLike: { 'top': T[], 'bottom': T[], 'left': T[], 'right': T[] }): T[] {
    return [
      ...lightersLike.top,
      ...lightersLike.bottom,
      ...lightersLike.left,
      ...lightersLike.right,
    ]
  }

  private generateBalls() {
    const rdmArr = randomIntNums(0, GamePlay.width * GamePlay.height, GamePlay.ballnum)
    rdmArr.forEach((pos) => {
      const y = Math.floor(pos / GamePlay.width)
      const x = pos % GamePlay.width
      this.state.value.board[y][x].isBall = true
    })
  }

  private getLightersTextArr(lighters: Lighters) {
    const lighterTextArr = {
      top: new Array<Lighter["text"]>(GamePlay.width),
      bottom: new Array<Lighter["text"]>(GamePlay.width),
      left: new Array<Lighter["text"]>(GamePlay.height),
      right: new Array<Lighter["text"]>(GamePlay.height),
    }
    let initNum = 1
    GamePlay.direction.forEach(key =>
      lighters[key as (keyof Lighters)].forEach((lighter) => {
        const lightpath = lighter.lightPath
        if (!lightpath.length)
          lighterTextArr[lighter.loc][lighter.i] = 'H'
        else if (lightpath.length === 1)
          lighterTextArr[lighter.loc][lighter.i] = 'R'
        else {
          const endBlock = lightpath[lightpath.length - 1].block
          const toDirection = lightpath[lightpath.length - 1].to
          const nextBlock = endBlock.getSibling(toDirection)
          if (nextBlock) {
            lighterTextArr[lighter.loc][lighter.i] = 'H'
          }
          else {
            let coLighter: Lighter = {} as Lighter
            if (toDirection === 'top')
              coLighter = lighters.top[endBlock.x]
            else if (toDirection === 'bottom')
              coLighter = lighters.bottom[endBlock.x]
            else if (toDirection === 'left')
              coLighter = lighters.left[endBlock.y]
            else if (toDirection === 'right')
              coLighter = lighters.right[endBlock.y]
            if (coLighter === lighter) {
              lighterTextArr[lighter.loc][lighter.i] = 'R'
            }
            else {
              lighter.coLighter = coLighter
              coLighter.coLighter = lighter
              lighterTextArr[lighter.loc][lighter.i] = initNum
              lighterTextArr[coLighter.loc][coLighter.i] = initNum
              initNum += 1
            }
          }
        }
      })
    )
    return lighterTextArr
  }

  private getLightPath(lighter: Lighter, gameMap: BlockState[][] = this.state.value.board) {
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
          if (block.getSibling('leftTop')?.isBall && block.getSibling('rightTop')?.isBall) {
            tmplightpath.push({ block, from: fromDirection, to: toDirection })
            pushblock = block.getSibling('top')!
            toDirection = 'bottom'
          }
          else if (block.getSibling('leftTop')?.isBall)
            toDirection = 'right'
          else if (block.getSibling('rightTop')?.isBall)
            toDirection = 'left'
          break
        case 'bottom':
          if (block.getSibling('leftBottom')?.isBall && block.getSibling('rightBottom')?.isBall) {
            tmplightpath.push({ block, from: fromDirection, to: toDirection })
            pushblock = block.getSibling('bottom')!
            toDirection = 'top'
          }
          else if (block.getSibling('leftBottom')?.isBall)
            toDirection = 'right'
          else if (block.getSibling('rightBottom')?.isBall)
            toDirection = 'left'
          break
        case 'left':
          if (block.getSibling('leftTop')?.isBall && block.getSibling('leftBottom')?.isBall) {
            tmplightpath.push({ block, from: fromDirection, to: toDirection })
            pushblock = block.getSibling('left')!
            toDirection = 'right'
          }
          else if (block.getSibling('leftTop')?.isBall)
            toDirection = 'bottom'
          else if (block.getSibling('leftBottom')?.isBall)
            toDirection = 'top'
          break
        case 'right':
          if (block.getSibling('rightTop')?.isBall && block.getSibling('rightBottom')?.isBall) {
            tmplightpath.push({ block, from: fromDirection, to: toDirection })
            pushblock = block.getSibling('right')!
            toDirection = 'left'
          }
          else if (block.getSibling('rightTop')?.isBall)
            toDirection = 'bottom'
          else if (block.getSibling('rightBottom')?.isBall)
            toDirection = 'top'
          break
      }
      tmplightpath.push({ block: pushblock, from: fromDirection, to: toDirection })
      emitLight(pushblock.getSibling(toDirection)!, reverseDirection(toDirection))
    }

    let tmplightpath = [] as LightPath
    let initBlock: BlockState
    switch (lighter.loc) {
      case 'top':
        initBlock = gameMap[0][lighter.i]
        tmplightpath.push({ block: initBlock, from: 'top', to: 'bottom' })
        break
      case 'bottom':
        initBlock = gameMap[GamePlay.width - 1][lighter.i]
        tmplightpath.push({ block: initBlock, from: 'bottom', to: 'top' })
        break
      case 'left':
        initBlock = gameMap[lighter.i][0]
        tmplightpath.push({ block: initBlock, from: 'left', to: 'right' })
        break
      case 'right':
        initBlock = gameMap[lighter.i][GamePlay.width - 1]
        tmplightpath.push({ block: initBlock, from: 'right', to: 'left' })
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

  private createBoard() {
    const newboard = Array.from({ length: GamePlay.height }, (_, row) =>
      Array.from({ length: GamePlay.width }, (_, col): BlockState => ({
        x: col,
        y: row,
        revealed: false,
        flagged: false,
        locked: false,
        isBall: false,
        lightOn: false,
        getSibling(direction: directionAllType) {
          switch (direction) {
            case 'top':
              if (this.y - 1 < 0)
                return
              return newboard[this.y - 1][this.x]
            case 'bottom':
              if (this.y + 1 >= GamePlay.height)
                return
              return newboard[this.y + 1][this.x]
            case 'left':
              if (this.x - 1 < 0)
                return
              return newboard[this.y][this.x - 1]
            case 'right':
              if (this.x + 1 >= GamePlay.width)
                return
              return newboard[this.y][this.x + 1]
            case 'leftTop':
              if (this.x - 1 < 0 || this.y - 1 < 0)
                return
              return newboard[this.y - 1][this.x - 1]
            case 'leftBottom':
              if (this.x - 1 < 0 || this.y + 1 >= GamePlay.height)
                return
              return newboard[this.y + 1][this.x - 1]
            case 'rightTop':
              if (this.x + 1 >= GamePlay.width || this.y - 1 < 0)
                return
              return newboard[this.y - 1][this.x + 1]
            case 'rightBottom':
              if (this.x + 1 >= GamePlay.width || this.y + 1 >= GamePlay.height)
                return
              return newboard[this.y + 1][this.x + 1]
          }
        },
      }),
      ),
    )
    return newboard
  }

  private createLighters(): Lighters {
    const newLighters = {
      top: Array.from({ length: GamePlay.width }, (_, idx) => ({
        loc: 'top',
        i: idx,
        text: undefined,
        isHover: false,
        lightPath: [],
        coLighter: undefined
      })),
      bottom: Array.from({ length: GamePlay.width }, (_, idx) => ({
        loc: 'bottom',
        i: idx,
        text: undefined,
        isHover: false,
        lightPath: [],
        coLighter: undefined
      })),
      left: Array.from({ length: GamePlay.height }, (_, idx) => ({
        loc: 'left',
        i: idx,
        text: undefined,
        isHover: false,
        lightPath: [],
        coLighter: undefined
      })),
      right: Array.from({ length: GamePlay.height }, (_, idx) => ({
        loc: 'right',
        i: idx,
        text: undefined,
        isHover: false,
        lightPath: [],
        coLighter: undefined
      })),
    } as Lighters
    return newLighters
  }

}
