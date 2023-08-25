import { reactive } from '@vue/reactivity'
import { Context } from './context'
import type { Directive } from './directives'
import { customDirectives } from './directives'
import { walk } from './walker'

export const globalState = reactive({})

class App<T extends object> {
  constructor(initialDataset: T) {
    Object.assign(globalState, initialDataset)
  }

  directive(name: string, fn: Directive) {
    customDirectives[name] = fn
    return this
  }

  init() {
    const scopeRoots = Array.from(document.querySelectorAll('[x-scope]'))
    for (const scopeRoot of scopeRoots)
      createScope(scopeRoot)
  }
}

export function createApp<T extends object>(init: T) {
  return new App(init)
}

export function createScope(scopeRoot: Element) {
  const ctx = new Context(scopeRoot)
  scopeRoot.setAttribute('style', 'display:none;')
  walk(ctx)
  ctx.init = true
  scopeRoot.removeAttribute('style')

  return { ctx }
}
