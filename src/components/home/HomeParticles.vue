<template>
  <VueParticles
    id="tsparticles"
    class="pointer-events-none absolute inset-0 min-h-screen bg-transparent"
    :options="options"
  />
</template>

<script setup lang="ts">
import type { ISourceOptions } from '@tsparticles/engine'

const options: ISourceOptions = {
  fullScreen: {
    enable: false,
    zIndex: 1,
  },
  particles: {
    number: {
      value: 10,
      density: {
        enable: false,
      },
    },
    paint: {
      color: {
        value: '#fff',
      },
    },
    shape: {
      type: 'circle',
    },
    opacity: {
      value: 0.8,
      animation: {
        enable: false,
        speed: 1,
        sync: false,
      },
    },
    size: {
      value: 4,
      animation: {
        enable: false,
        speed: 40,
        sync: false,
      },
    },
    rotate: {
      value: 0,
      direction: 'clockwise',
      animation: {
        enable: true,
        speed: 5,
        sync: false,
      },
    },
    links: {
      enable: true,
      distance: 600,
      color: 'hsl(161, 100%, 44%)',
      opacity: 0.4,
      width: 2,
    },
    move: {
      enable: true,
      speed: 1,
      direction: 'none',
      random: false,
      straight: false,
      outModes: 'out',
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: 'grab',
      },
      onClick: {
        enable: false,
        mode: 'bubble',
      },
    },
    modes: {
      grab: {
        distance: 400,
        links: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3,
      },
      repulse: {
        distance: 200,
      },
      push: {
        quantity: 4,
      },
      remove: {
        quantity: 2,
      },
    },
  },
  detectRetina: true,
  background: {
    image: '',
    position: '50% 50%',
    repeat: 'no-repeat',
    size: 'cover',
  },
}
</script>
