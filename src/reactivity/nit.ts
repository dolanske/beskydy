import type { WatcherEffect } from './types'
import { activeEffect } from './shared'

export class Nit<T = unknown> {
  #value: T | undefined
  effects = new Set<WatcherEffect<T>>()
  __is_nit = true

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
    if (activeEffect.value)
      this.effects.add(activeEffect.value)
  }

  watch(fn: WatcherEffect<T>) {
    this.effects.add(fn)
  }

  notify(newVal: T, oldVal: T) {
    for (const effect of this.effects)
      effect(newVal, oldVal)
  }
}

export function nit<T = never>(initialValue?: T) {
  return new Nit<T>(initialValue)
}

export function watchNit<T>(source: Nit<T>, fn: WatcherEffect<T>) {
  source.watch(fn)
}
