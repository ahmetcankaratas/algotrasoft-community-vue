<template>
  <span ref="target"></span>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import Typewriter from 'typewriter-effect/dist/core'

const props = withDefaults(
  defineProps<{
    strings: string[]
    delay?: number
    pause?: number
  }>(),
  { delay: 75, pause: 1000 },
)

const target = useTemplateRef<HTMLElement>('target')
let typewriter: Typewriter | null = null

onMounted(() => {
  typewriter = new Typewriter(target.value, { loop: true, delay: props.delay })
  for (const text of props.strings) {
    typewriter.typeString(text).pauseFor(props.pause).deleteAll()
  }
  typewriter.start()
})

onUnmounted(() => {
  typewriter?.stop()
})
</script>
