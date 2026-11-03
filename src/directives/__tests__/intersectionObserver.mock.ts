import { vi } from 'vitest'

// jsdom has no IntersectionObserver; this stand-in records observed elements and lets tests
// decide when an element becomes visible.
export class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = []

  readonly root = null
  readonly rootMargin = '0px'
  readonly scrollMargin = '0px'
  readonly thresholds: number[]
  readonly elements = new Set<Element>()
  disconnected = false

  constructor(
    private readonly callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {},
  ) {
    this.thresholds = Array.isArray(options.threshold)
      ? options.threshold
      : [options.threshold ?? 0]
    MockIntersectionObserver.instances.push(this)
  }

  observe(element: Element) {
    this.elements.add(element)
  }

  unobserve(element: Element) {
    this.elements.delete(element)
  }

  disconnect() {
    this.elements.clear()
    this.disconnected = true
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  trigger(element: Element, isIntersecting: boolean) {
    const entry = {
      target: element,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
    } as IntersectionObserverEntry
    this.callback([entry], this)
  }

  /** Reports every observed element of every observer as visible. */
  static revealAll() {
    for (const observer of MockIntersectionObserver.instances) {
      for (const element of Array.from(observer.elements)) observer.trigger(element, true)
    }
  }
}

export function installIntersectionObserverMock() {
  MockIntersectionObserver.instances = []
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
}
