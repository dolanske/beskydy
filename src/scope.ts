import { reactive } from '@vue/reactivity'
import { Context } from './context'
import type { Directive, ModifierFn } from './directives'
import { customDirectives } from './directives'
import { walk } from './walker'
import { eventModifiers } from './directives/x-on'

export const globalState = reactive({})

class App<T extends object> {
  constructor(initialDataset: T) {
    Object.assign(globalState, initialDataset)
  }

  /**
   * Add a custom directive (element attribute)
   *
   * @param name Directive name, preferably should start with `x-`
   * @param fn Directive implementation
   */
  directive(name: string, fn: Directive) {
    customDirectives[name] = fn
    return this
  }

  /**
   * Add a custom x-on event modifier
   *
   * @param name Modifier name
   * @param fn Modifier implementation
   */
  modifier(name: string, fn: ModifierFn) {
    if (name in eventModifiers)
      throw new Error(`Modifier named ${name} is already defined`)

    eventModifiers[name] = fn
    return this
  }

  /**
   * Initialize Beskydy. It starts by collecting all the scopes and initializing them
   */
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
