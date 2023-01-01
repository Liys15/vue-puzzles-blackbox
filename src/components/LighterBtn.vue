<script setup lang="ts">
import { Lighter } from '~/types';

defineProps<{
  lighter: Lighter
}>()
</script>

<template>
  <div>
    <button block-div>
      {{ lighter.text }}
    </button>
  </div>
</template>
