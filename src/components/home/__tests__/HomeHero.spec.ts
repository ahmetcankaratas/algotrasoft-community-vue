import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeHero from '../HomeHero.vue'

describe('HomeHero', () => {
  it('should create', () => {
    const wrapper = mount(HomeHero, { global: { stubs: { TypewriterText: true } } })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('THE NEXT GENERATION')
  })

  it('animates the market names', () => {
    const wrapper = mount(HomeHero, { global: { stubs: { TypewriterText: true } } })
    const typewriter = wrapper.findComponent({ name: 'TypewriterText' })
    expect(typewriter.props('strings')).toEqual(['Stocks', 'Crypto', 'Forex', 'NFTs'])
  })
})
