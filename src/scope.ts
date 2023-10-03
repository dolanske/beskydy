import { reactive } from '@vue/reactivity'
import { Context } from './context'
import type { Directive, EventModifierFn } from './directives'
import { customDirectives } from './directives'
import { walk } from './walker'
import { eventModifiers } from './directives/x-on'
import type { ModelModifierFn } from './directives/x-model'
import { modelModifiers } from './directives/x-model'

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
  defineDirective(name: string, fn: Directive) {
    if (name in customDirectives)
      throw new Error(`Directive ${name} is already defined`)
    customDirectives[name] = fn
    return this
  }

  /**
   * Add a custom `x-on` event modifier
   *
   * @param name Modifier name
   * @param fn Modifier implementation
   */
  defineEventModifier(name: string, fn: EventModifierFn) {
    if (name in eventModifiers)
      throw new Error(`Event modifier ${name} is already defined`)
    eventModifiers[name] = fn
    return this
  }

  /**
   * Add a custom `x-model` modifier
   *
   * @param name Modifier name
   * @param fn Modifier implementation
   */
  defineModelModifier(name: string, fn: ModelModifierFn) {
    if (name in modelModifiers)
      throw new Error(`Model modifier ${name} is already defined`)
    modelModifiers[name] = fn
    return this
  }

  /**
   * Initialize Beskydy. It starts by collecting all the scopes and initializing them
   */
  start() {
    const scopeRoots = Array.from(document.querySelectorAll('[x-scope]'))
    for (const scopeRoot of scopeRoots)
      createScope(scopeRoot)
  }
}

export function Beskydy<T extends object>(init?: T) {
  return new App(init ?? {})
}

export function createScope(scopeRoot: Element) {
  const ctx = new Context(scopeRoot)
  scopeRoot.setAttribute('style', 'display:none;')
  walk(ctx)
  ctx.init = true
  scopeRoot.removeAttribute('style')

  return { ctx }
}
