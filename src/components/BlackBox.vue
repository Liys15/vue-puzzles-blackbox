<script setup lang="ts">
import type {
  BlockState, LightPath, Lighter, Lighters,
  directionAllType, directionType,
} from '~/types'

const WIDTH = 8
const HEIGHT = 8
const ballnum = 5

const board = ref(Array.from({ length: HEIGHT }, (_, row) =>
  Array.from({ length: WIDTH }, (_, col): BlockState => ({
    x: col,
    y: row,
    revealed: false,
    isBall: false,
    lightOn: false,
    getSibling(direction: directionAllType) {
      switch (direction) {
        case 'top':
          if (this.y - 1 < 0)
            return
          return board.value[this.y - 1][this.x]
        case 'bottom':
          if (this.y + 1 >= HEIGHT)
            return
          return board.value[this.y + 1][this.x]
        case 'left':
          if (this.x - 1 < 0)
            return
          return board.value[this.y][this.x - 1]
        case 'right':
          if (this.x + 1 >= WIDTH)
            return
          return board.value[this.y][this.x + 1]
        case 'leftTop':
          if (this.x - 1 < 0 || this.y - 1 < 0)
            return
          return board.value[this.y - 1][this.x - 1]
        case 'leftBottom':
          if (this.x - 1 < 0 || this.y + 1 >= HEIGHT)
            return
          return board.value[this.y + 1][this.x - 1]
        case 'rightTop':
          if (this.x + 1 >= WIDTH || this.y - 1 < 0)
            return
          return board.value[this.y - 1][this.x + 1]
        case 'rightBottom':
          if (this.x + 1 >= WIDTH || this.y + 1 >= HEIGHT)
            return
          return board.value[this.y + 1][this.x + 1]
      }
    },
  }))))

const lighters: Lighters = {
  top: Array.from({ length: WIDTH }, (_, idx) => ({
    loc: 'top',
    i: idx,
    type: undefined,
    isOn: false,
    lightPath: [],
    connectedLighter: undefined,
  })),
  bottom: Array.from({ length: WIDTH }, (_, idx) => ({
    loc: 'bottom',
    i: idx,
    type: undefined,
    isOn: false,
    lightPath: [],
    connectedLighter: undefined,
  })),
  left: Array.from({ length: WIDTH }, (_, idx) => ({
    loc: 'left',
    i: idx,
    type: undefined,
    isOn: false,
    lightPath: [],
    connectedLighter: undefined,
  })),
  right: Array.from({ length: WIDTH }, (_, idx) => ({
    loc: 'right',
    i: idx,
    type: undefined,
    isOn: false,
    lightPath: [],
    connectedLighter: undefined,
  })),
}

function generateBalls() {
  const rdmArr = randomIntNums(0, WIDTH * HEIGHT, ballnum)
  rdmArr.forEach((pos) => {
    const y = Math.floor(pos / WIDTH)
    const x = pos % WIDTH
    board.value[y][x].isBall = true
  })
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

let lightPath: LightPath = []

function switchOn(lighter: Lighter) {
  lightPath = []
  lighter.lightPath = lightPath
  let initBlock: BlockState
  switch (lighter.loc) {
    case 'top':
      initBlock = board.value[0][lighter.i]
      break
    case 'bottom':
      initBlock = board.value[HEIGHT - 1][lighter.i]
      break
    case 'left':
      initBlock = board.value[lighter.i][0]
      break
    case 'right':
      initBlock = board.value[lighter.i][WIDTH - 1]
      break
  }
  if (initBlock.isBall)
    return
  if (lighter.loc === 'top' || lighter.loc === 'bottom') {
    if (initBlock.getSibling('left')?.isBall || initBlock.getSibling('right')?.isBall)
      return
  }
  else if (lighter.loc === 'left' || lighter.loc === 'right') {
    if (initBlock.getSibling('top')?.isBall || initBlock.getSibling('bottom')?.isBall)
      return
  }
  emitLight(initBlock, lighter.loc)
}

function emitLight(block: BlockState, fromDirection: directionType) {
  if (!block)
    return
  block.lightOn = true
  let toDirection: directionType = reverseDirection(fromDirection)
  switch (toDirection) {
    case 'top':
      if (block.getSibling('leftTop')?.isBall && block.getSibling('rightTop')?.isBall)
        toDirection = 'bottom'
      else if (block.getSibling('leftTop')?.isBall)
        toDirection = 'right'
      else if (block.getSibling('rightTop')?.isBall)
        toDirection = 'left'
      break
    case 'bottom':
      if (block.getSibling('leftBottom')?.isBall && block.getSibling('rightBottom')?.isBall)
        toDirection = 'top'
      else if (block.getSibling('leftBottom')?.isBall)
        toDirection = 'right'
      else if (block.getSibling('rightBottom')?.isBall)
        toDirection = 'left'
      break
    case 'left':
      if (block.getSibling('leftTop')?.isBall && block.getSibling('leftBottom')?.isBall)
        toDirection = 'right'
      else if (block.getSibling('leftTop')?.isBall)
        toDirection = 'bottom'
      else if (block.getSibling('leftBottom')?.isBall)
        toDirection = 'top'
      break
    case 'right':
      if (block.getSibling('rightTop')?.isBall && block.getSibling('rightBottom')?.isBall)
        toDirection = 'left'
      else if (block.getSibling('rightTop')?.isBall)
        toDirection = 'bottom'
      else if (block.getSibling('rightBottom')?.isBall)
        toDirection = 'top'
  }
  lightPath.push({ x: block.x, y: block.y, from: fromDirection, to: toDirection })
  if (block.getSibling(toDirection)?.isBall)
    return
  emitLight(block.getSibling(toDirection)!, reverseDirection(toDirection))
}

function updateLighters() {
  const lightersflat = [...lighters.top, ...lighters.bottom, ...lighters.left, ...lighters.right]
  lightersflat.forEach(lighter => switchOn(lighter))
}

generateBalls()
updateLighters()
</script>

<template>
  <div id="grid-container">
    <div id="top-container" flex="~">
      <button
        v-for="lighter, idx in lighters.top" :key="idx"
        block mb-2 @click="switchOn(lighter)"
      >
        {{ lighter.type }}
      </button>
    </div>
    <div id="bottom-container" flex="~">
      <button
        v-for="lighter, idx in lighters.bottom" :key="idx"
        block mt-2 @click="switchOn(lighter)"
      >
        {{ lighter.type }}
      </button>
    </div>
    <div id="left-container" flex="~ col" items-end>
      <button
        v-for="lighter, idx in lighters.left" :key="idx"
        block mr-2 @click="switchOn(lighter)"
      >
        {{ lighter.type }}
      </button>
    </div>
    <div id="right-container" flex="~ col" items-start>
      <button
        v-for="lighter, idx in lighters.right" :key="idx"
        block ml-2 @click="switchOn(lighter)"
      >
        {{ lighter.type }}
      </button>
    </div>
    <div id="box-container" flex="~ col" items-center>
      <div v-for="(row, y) in board" :key="y" flex="~">
        <div
          v-for="(block, x) in row" :key="x"
          block flex="~" items-center justify-center
        >
          <template v-if="block.isBall">
            🔮
          </template>
          <template v-else-if="block.lightOn">
            <div class="lightpath-h" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#grid-container {
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  grid-template-columns: 1fr auto 1fr;
  grid-template-areas: ". top ."
    "left main right"
    ". bottom .";
}

#top-container {
  grid-area: top;
}

#bottom-container {
  grid-area: bottom;
}

#left-container {
  grid-area: left;
}

#right-container {
  grid-area: right;
}

#box-container {
  grid-area: main;
}

.lightpath-h {
  width: 100%;
  height: 100%;
  background-color: yellow;
}
</style>
