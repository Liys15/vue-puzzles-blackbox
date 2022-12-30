<script setup lang="ts">
import type { BlockState, directionAllType, directionType } from '~/types'

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

const lighters = {
  top: new Array(WIDTH).fill('-'),
  bottom: new Array(WIDTH).fill('-'),
  left: new Array(HEIGHT).fill('-'),
  right: new Array(HEIGHT).fill('-'),
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

function handleclick(lighterLoc: directionType, idx: number) {
  let initBlock: BlockState
  switch (lighterLoc) {
    case 'top':
      initBlock = board.value[0][idx]
      if (initBlock.isBall)
        return
      if (initBlock.getSibling('left')?.isBall || initBlock.getSibling('right')?.isBall)
        return
      emitLight(initBlock, 'bottom')
      break
    case 'bottom':
      initBlock = board.value[HEIGHT - 1][idx]
      if (initBlock.isBall)
        return
      if (initBlock.getSibling('left')?.isBall || initBlock.getSibling('right')?.isBall)
        return
      emitLight(initBlock, 'top')
      break
    case 'left':
      initBlock = board.value[idx][0]
      if (initBlock.isBall)
        return
      if (initBlock.getSibling('top')?.isBall || initBlock.getSibling('bottom')?.isBall)
        return
      emitLight(initBlock, 'right')
      break
    case 'right':
      initBlock = board.value[idx][WIDTH - 1]
      if (initBlock.isBall)
        return
      if (initBlock.getSibling('top')?.isBall || initBlock.getSibling('bottom')?.isBall)
        return
      emitLight(initBlock, 'left')
      break
  }
}

function emitLight(block: BlockState, direction: directionType) {
  if (!block)
    return
  block.lightOn = true
  switch (direction) {
    case 'top':
      if (block.getSibling('top')?.isBall)
        return
      if (block.getSibling('leftTop')?.isBall && block.getSibling('rightTop')?.isBall)
        emitLight(block.getSibling('bottom')!, 'bottom')
      else if (block.getSibling('leftTop')?.isBall)
        emitLight(block.getSibling('right')!, 'right')
      else if (block.getSibling('rightTop')?.isBall)
        emitLight(block.getSibling('left')!, 'left')
      else
        emitLight(block.getSibling('top')!, 'top')
      return
    case 'bottom':
      if (block.getSibling('bottom')?.isBall)
        return
      if (block.getSibling('leftBottom')?.isBall && block.getSibling('rightBottom')?.isBall)
        emitLight(block.getSibling('top')!, 'top')
      else if (block.getSibling('leftBottom')?.isBall)
        emitLight(block.getSibling('right')!, 'right')
      else if (block.getSibling('rightBottom')?.isBall)
        emitLight(block.getSibling('left')!, 'left')
      else
        emitLight(block.getSibling('bottom')!, 'bottom')
      return
    case 'left':
      if (block.getSibling('left')?.isBall)
        return
      if (block.getSibling('leftTop')?.isBall && block.getSibling('leftBottom')?.isBall)
        emitLight(block.getSibling('right')!, 'right')
      else if (block.getSibling('leftTop')?.isBall)
        emitLight(block.getSibling('bottom')!, 'bottom')
      else if (block.getSibling('leftBottom')?.isBall)
        emitLight(block.getSibling('top')!, 'top')
      else
        emitLight(block.getSibling('left')!, 'left')
      return
    case 'right':
      if (block.getSibling('right')?.isBall)
        return
      if (block.getSibling('rightTop')?.isBall && block.getSibling('rightBottom')?.isBall)
        emitLight(block.getSibling('left')!, 'left')
      else if (block.getSibling('rightTop')?.isBall)
        emitLight(block.getSibling('bottom')!, 'bottom')
      else if (block.getSibling('rightBottom')?.isBall)
        emitLight(block.getSibling('top')!, 'top')
      else
        emitLight(block.getSibling('right')!, 'right')
  }
}

generateBalls()
</script>

<template>
  <div id="grid-container">
    <div id="top-container" flex="~">
      <button
        v-for="lighter, idx in lighters.top" :key="idx"
        block mb-2 @click="handleclick('top', idx)"
      >
        {{ lighter }}
      </button>
    </div>
    <div id="bottom-container" flex="~">
      <button
        v-for="lighter, idx in lighters.bottom" :key="idx"
        block mt-2 @click="handleclick('bottom', idx)"
      >
        {{ lighter }}
      </button>
    </div>
    <div id="left-container" flex="~ col" items-end>
      <button
        v-for="lighter, idx in lighters.left" :key="idx"
        block mr-2 @click="handleclick('left', idx)"
      >
        {{ lighter }}
      </button>
    </div>
    <div id="right-container" flex="~ col" items-start>
      <button
        v-for="lighter, idx in lighters.right" :key="idx"
        block ml-2 @click="handleclick('right', idx)"
      >
        {{ lighter }}
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
