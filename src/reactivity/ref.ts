import type { WatcherEffect } from './types'
import { activeEffect } from './shared'

export class Ref<T = unknown> {
  #value: T | undefined
  effects = new Set<WatcherEffect<T>>()

  constructor(value?: T) {
    this.#value = value ?? undefined
  }

  get val() {
    this.track()
    return this.#value as T
  }

  set val(newVal) {
    const oldVal = this.#value
    this.#value = newVal
    this.notify(newVal, oldVal as T)
  }

  track() {
    if (activeEffect)
      this.effects.add(activeEffect)
  }

  watch(fn: WatcherEffect<T>) {
    this.effects.add(fn)
  }

  notify(newVal: T, oldVal: T) {
    for (const effect of this.effects)
      effect(newVal, oldVal)
  }
}

export function ref<T = never>(initialValue?: T) {
  return new Ref<T>(initialValue)
}

export function watchRef<T>(source: Ref<T>, fn: WatcherEffect<T>) {
  source.watch(fn)
}
