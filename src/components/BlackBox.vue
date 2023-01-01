<script setup lang="ts">
import { GamePlay } from '~/composables'

const play = new GamePlay('Medium')
</script>

<template>
  <div class="menu" flex="~" justify-center gap-2 pt-2>
    <button btn @click="play.reset('Easy')">
      Easy
    </button>
    <button btn @click="play.reset('Medium')">
      Medium
    </button>
    <button btn @click="play.reset('Hard')">
      Hard
    </button>
    <button
      w-4em pl-2 pr-2 rd-1 text-black dark:text-white
      bg="purple-500/80" hover:bg-fuchsia-500
      @click="play.checkSolution()"
    >
      Check
    </button>
  </div>
  <div id="grid-container" m-6>
    <div id="top-container" flex="~" m-2>
      <LighterBtn
        v-for="lighter, idx in play.state.value.lighters.top" :key="idx"
        :lighter="lighter"
      />
    </div>
    <div id="bottom-container" flex="~" m-2>
      <LighterBtn
        v-for="lighter, idx in play.state.value.lighters.bottom" :key="idx"
        :lighter="lighter"
      />
    </div>
    <div id="left-container" flex="~ col" items-end>
      <LighterBtn
        v-for="lighter, idx in play.state.value.lighters.left" :key="idx"
        :lighter="lighter"
      />
    </div>
    <div id="right-container" flex="~ col" items-start>
      <LighterBtn
        v-for="lighter, idx in play.state.value.lighters.right" :key="idx"
        :lighter="lighter"
      />
    </div>
    <div id="box-container" flex="~ col" items-center>
      <div v-for="(row, y) in play.state.value.board" :key="y" flex="~">
        <BlackBall
          v-for="(block, x) in row" :key="x" :block="block"
          @contextmenu.prevent="play.handeleRightClick(block)"
        />
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
