import type { UnwrapNestedRefs } from '@vue/reactivity'
import { reactive } from '@vue/reactivity'
import type { ContextAny } from './context'
import { Context } from './context'
import type { Directive, EventModifierFn } from './directives/directives'
import { walk } from './walker'
import { eventModifiers } from './directives/x-on'
import type { ModelModifierFn } from './directives/x-model'
import { modelModifiers } from './directives/x-model'

// Custom modifiers warning message, which is shared across all three of them
const warnEnd = 'is a reserved name or its already been defined. Please use a different name.'
type Cb = () => void

function escapeRegex(str: string) {
  return str.replace(/[-.*+?^${}()|[\]\/\\]/g, '\\$&')
}

function createDelimiterRegex(start: string, end: string) {
  return new RegExp(
    `${escapeRegex(start)}([^]+?)${escapeRegex(end)}`,
    'g',
  )
}

export class Beskydy<T extends object> {
  modelModifiers: Record<string, ModelModifierFn>
  eventModifiers: Record<string, EventModifierFn>
  customDirectives: Record<string, Directive>
  delimiters: {
    start: string
    end: string
    re: RegExp
  }

  private scopes: ContextAny[]
  rootState: UnwrapNestedRefs<T>
  private onInitCbs: Cb[]
  private onTeardownCbs: Cb[]

  constructor(initialDataset?: T) {
    this.modelModifiers = Object.assign({}, modelModifiers)
    this.eventModifiers = Object.assign({}, eventModifiers)
    this.customDirectives = {}
    this.delimiters = {
      start: '{{',
      end: '}}',
      re: createDelimiterRegex('{{', '}}'),
    }
    this.scopes = []
    this.rootState = reactive(Object.assign({}, initialDataset))
    this.onInitCbs = []
    this.onTeardownCbs = []
  }

  /**
   * Define the way Beskydy will compile the delimiters {{ }} into a reactive part of a string.
   * Delimiters contain text, which usually contains an expression. Think of it was as javascript being executed within a string when it is wrapped in the delimiters {{ }}
   *
   *
   * @param start Starting delimiter
   * @param end Ending delimiter
   */
  setDelimiters(start: string, end: string) {
    if (start === '{' || end === '}')
      console.warn('You are using {} as delimiters, please keep in mind that you will not be able to use template literals  inside of them.')
    this.delimiters = { start, end, re: createDelimiterRegex(start, end) }
  }

  /**
   * Add a custom directive (element attribute)
   *
   * @param name Directive name, preferably should start with `x-`
   * @param fn Directive implementation
   */
  defineDirective(name: string, fn: Directive) {
    if (name in this.customDirectives)
      throw new Error(`The directive "${name}" ${warnEnd}`)
    this.customDirectives[name] = fn
  }

  /**
   * Add a custom `x-on` event modifier
   *
   * @param name Modifier name
   * @param fn Modifier implementation
   */
  defineEventModifier(name: string, fn: EventModifierFn) {
    if (name in this.eventModifiers)
      throw new Error(`The event modifier "${name}" ${warnEnd}`)
    this.eventModifiers[name] = fn
  }

  /**
   * Add a custom `x-model` modifier
   *
   * @param name Modifier name
   * @param fn Modifier implementation
   */
  defineModelModifier(name: string, fn: ModelModifierFn) {
    if (name in this.modelModifiers)
      throw new Error(`The model modifier "${name}" ${warnEnd}`)
    this.modelModifiers[name] = fn
  }

  /**
   *  Initialize Beskydy. It starts by collecting all the scope elements
   *  and creating a context for each.
   *
   * @param selector Custom attribute selector. Defaults to 'x-scope'
   */
  collect(selector: string = '[x-scope]') {
    const scopeRoots = Array.from(document.querySelectorAll(selector))
    if (scopeRoots.length === 0)
      console.warn(`No scopes were found for the selector "${selector}". Make sure to define at least one.`)

    for (const scopeRoot of scopeRoots) {
      const ctx = new Context(scopeRoot, this, {})
      // Hide scope until it's initialized
      scopeRoot.setAttribute('style', 'display:none;')
      walk(ctx)
      ctx.init = true
      scopeRoot.removeAttribute('style')
      this.scopes.push(ctx)
    }

    for (const cb of this.onInitCbs)
      cb()
  }

  /**
   * Registers a function which runs when app is fully initialized
   */
  onInit(fn: Cb) {
    this.onInitCbs.push(fn)
  }

  /**
   * Registers a callback which runs after application has been shut down
   */
  onTeardown(fn: Cb) {
    this.onTeardownCbs.push(fn)
  }

  /**
   *   Stops Beskydy instance, removes reactivity and event listeners
   *   and leaves the DOM in the state it was when the app was torn down.
   */
  teardown() {
    for (const ctx of this.scopes)
      ctx.teardown()

    this.scopes.length = 0

    // REVIEW
    // Should the onTeardown callbacks run before teardown or right after?
    for (const cb of this.onTeardownCbs)
      cb()
  }
}
