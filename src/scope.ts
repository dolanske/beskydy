import { reactive } from '@vue/reactivity'
import type { ContextAny } from './context'
import { Context } from './context'
import type { Directive, EventModifierFn } from './directives'
import { customDirectives } from './directives'
import { walk } from './walker'
import { eventModifiers } from './directives/x-on'
import type { ModelModifierFn } from './directives/x-model'
import { modelModifiers } from './directives/x-model'

/**
 * Shared global state between all scopes.
 *
 * Extend ugins `Object.assign(globalState, { ...yourProperties })`
 */
export const globalState = reactive({})

const scopes: ContextAny[] = []

export class Beskydy<T extends object> {
  constructor(initialDataset: T) {
    Object.assign(globalState, initialDataset)
  }

  /**
   * Add a custom directive (element attribute)
   *
   * @param name Directive name, preferably should start with `x-`
   * @param fn Directive implementation
   */
  static defineDirective(name: string, fn: Directive) {
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
  static defineEventModifier(name: string, fn: EventModifierFn) {
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
  static defineModelModifier(name: string, fn: ModelModifierFn) {
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

  /**
   * Stops Beskydy instance, removes reactivity and event listeners and leaves the DOM in the state it was when the app was torn down./
   */
  teardown() {
    for (const ctx of scopes)
      ctx.teardown()

    scopes.length = 0
  }
}

export function createApp<T extends object>(init?: T) {
  return new Beskydy(init ?? {})
}

export function createScope(scopeRoot: Element) {
  const ctx = new Context(scopeRoot)
  scopeRoot.setAttribute('style', 'display:none;')
  walk(ctx)
  ctx.init = true
  scopeRoot.removeAttribute('style')
  scopes.push(ctx)
  return { ctx }
}
