<script setup lang="ts">
import { Lighter } from '~/types';

const props = defineProps<{
  lighter: Lighter
}>()

function mouseenter() {
  props.lighter.isHover=true
  if(props.lighter.coLighter) {
    props.lighter.coLighter.isHover=true
  }
}

function mouseleave() {
  props.lighter.isHover=false
  if(props.lighter.coLighter) {
    props.lighter.coLighter.isHover=false
  }
}

function getClass() {
  const base = 'bg-bluegray-300/90 dark:text-black b-black rd'
  let custom = ''
  if(props.lighter.isHover) {
    custom = 'bg-yellow-500 text-green-500 dark:text-green-500'
  }
  return `${custom} ${base}`
}
</script>

<template>
  <div @mouseenter="mouseenter()" @mouseout="mouseleave()">
    <button class="w-10 h-10 b-1 m-0.25 font-900" :class="getClass()">
      {{ lighter.text }}
    </button>
  </div>
</template>
