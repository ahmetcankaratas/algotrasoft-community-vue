import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import PageCover from '../PageCover.vue'

describe('PageCover', () => {
  it('should create', () => {
    const wrapper = mount(PageCover)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the header and description props', () => {
    const wrapper = mount(PageCover, {
      props: { header: 'Contact', description: 'Join Us' },
    })
    expect(wrapper.find('h1').text()).toBe('Contact')
    expect(wrapper.find('p').text()).toBe('Join Us')
  })
})
