<script setup lang="ts">
interface BlockState {
  x: number
  y: number
  revealed: boolean
  isBall: boolean
}

const WIDTH = 8
const HEIGHT = 8
const ballnum = 5

const board = ref(Array.from({ length: HEIGHT }, (_, row) =>
  Array.from({ length: WIDTH }, (_, col): BlockState => ({
    x: col,
    y: row,
    revealed: false,
    isBall: false,
  })),
))

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

function updateLighters() {
  
}

generateBalls()
</script>

function
<template>
  <div id="grid-container">
    <div id="top-container" flex="~">
      <button
        v-for="item, idx in lighters.top" :key="idx"
        block mb-2
      >
        {{ item }}
      </button>
    </div>
    <div id="bottom-container" flex="~">
      <button
        v-for="item, idx in lighters.bottom" :key="idx"
        block mt-2
      >
        {{ item }}
      </button>
    </div>
    <div id="left-container" flex="~ col" items-end>
      <button
        v-for="item, idx in lighters.left" :key="idx"
        block mr-2
      >
        {{ item }}
      </button>
    </div>
    <div id="right-container" flex="~ col" items-start>
      <button
        v-for="item, idx in lighters.right" :key="idx"
        block ml-2
      >
        {{ item }}
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
</style>
