<script setup lang="ts">
import type { BlockState } from '~/types'

defineProps<{
  block: BlockState
}>()
</script>

<template>
  <div block-div flex="~" items-center justify-center>
    <template v-if="block.revealed">
      <template v-if="block.isBall">
        🔮
      </template>
      <div v-else-if="block.lightOn" :class="`lightpath ${block.lightFrom}-${block.lightTo}`" />
    </template>
    <template v-else>
      <template v-if="block.flagged">
        🚩
      </template>
    </template>
  </div>
</template>
