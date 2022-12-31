<script setup lang="ts">
import { GamePlay } from '~/composables/logic'

const play = new GamePlay('Medium')
</script>

<template>
  <div id="grid-container">
    <div id="top-container" flex="~">
      <button
        v-for="lighter, idx in play.state.value.lighters.top" :key="idx"
        block mb-2 @click="play.switchOn(lighter)"
      >
        {{ lighter.type }}
      </button>
    </div>
    <div id="bottom-container" flex="~">
      <button
        v-for="lighter, idx in play.state.value.lighters.bottom" :key="idx"
        block mt-2 @click="play.switchOn(lighter)"
      >
        {{ lighter.type }}
      </button>
    </div>
    <div id="left-container" flex="~ col" items-end>
      <button
        v-for="lighter, idx in play.state.value.lighters.left" :key="idx"
        block mr-2 @click="play.switchOn(lighter)"
      >
        {{ lighter.type }}
      </button>
    </div>
    <div id="right-container" flex="~ col" items-start>
      <button
        v-for="lighter, idx in play.state.value.lighters.right" :key="idx"
        block ml-2 @click="play.switchOn(lighter)"
      >
        {{ lighter.type }}
      </button>
    </div>
    <div id="box-container" flex="~ col" items-center>
      <div v-for="(row, y) in play.state.value.board" :key="y" flex="~">
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
