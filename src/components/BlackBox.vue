<script setup lang="ts">
import { GamePlay } from '~/composables'
import '~/styles/animation.css'
import { directionType } from '~/types';

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
    <div v-for="loc, idx in GamePlay.direction" :key="idx" :id="`${loc}-container`" class="flex-container">
      <LighterBtn
        v-for="lighter, idx in play.state.value.lighters[loc as directionType]" :key="idx"
        :lighter="lighter" @click="play.handleLighterClick(lighter)"
      />
    </div>

    <div
      id="box-container" flex="~ col" items-center justify-evenly m-1
      :class="play.state.value.gameState === 'lost' ? 'hvr-buzz-out' : ''"
    >
      <div v-for="(row, y) in play.state.value.board" :key="y" w-full flex="~" justify-evenly>
        <BlackBall
          v-for="(block, x) in row" :key="x" :block="block"
          @click="block.locked = !block.locked"
          @contextmenu.prevent="play.handeleRightClick(block)"
        />
      </div>
    </div>
  </div>

  <Confetti :passed="play.state.value.gameState === 'won'" />
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

.flex-container{
  display: flex;
  justify-content: space-evenly;
  margin: 2px;
}

#top-container {
  grid-area: top;
}

#bottom-container {
  grid-area: bottom;
}

#left-container {
  flex-direction: column;
  grid-area: left;
}

#right-container {
  flex-direction: column;
  grid-area: right;
}

#box-container {
  grid-area: main;
}
</style>
