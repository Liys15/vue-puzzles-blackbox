<script setup lang="ts">
import type { BlockState } from '~/types'

const props = defineProps<{
  block: BlockState
  state: 'play' | 'won' | 'lost'
}>()

function getBlockState() {
  const b = props.block
  const baseclass = 'w-10 h-10 b-1 b-gray-700 dark:b-black'
  let varclass = ''
  if (b.revealed) {
    if (b.isBall)
      varclass = b.flagged ? 'bg-green-500/60 flip' : 'bg-rose-400 flip'
    else if (b.flagged)
      varclass = b.isBall ? 'bg-green-500/60 flip' : 'bg-rose-400 flip'
    else
      varclass = 'bg-gray-300 dark:bg-gray-600'
    if (b.lightOn)
      varclass = `lightpath ${b.lightFrom}-${b.lightTo} bg-gray-300 dark:bg-gray-600`
    return `${baseclass} ${varclass}`
  }
  else {
    if (b.locked) return 'block-div locked-block'
    else return 'block-div'
  }
}
</script>

<template>
  <div
    flex="~" items-center justify-center
    :class="getBlockState()"
  >
    <template v-if="block.revealed && block.isBall">
      🔮
    </template>
    <div v-else-if="block.lightOn"  />
    <template v-else-if="block.flagged">
      🚩
    </template>
  </div>
</template>

<style>
.flip {
  transition: transform 1s;
  transform-style: preserve-3d;
  transform: rotateX(360deg);
}
</style>
