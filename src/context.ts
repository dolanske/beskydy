import type { ReactiveEffectRunner, UnwrapNestedRefs } from '@vue/reactivity'
import { effect as rawEffect, reactive } from '@vue/reactivity'
import type { Beskydy } from './beskydy'
import { evaluate } from './evaluate'

export type ContextAny = Context<Element, Beskydy<object>, object>

// Piece of DOM which holds its own state. This class can be used on its
// own, but requires an instance of Beskydy to provide modifiers to a
// few directives.

// In case you want to create custom context, you can just do:
// const ctx = new Context(root, new Beskydy())

export class Context<R extends Element, A extends Beskydy<object>, T extends object> {
  // TODO: implement x-scope:scopeName="" attribute 
  // Naming a scope is purely for debugging reasons, as it will show up
  // on error messages and warnings

  __name: string | undefined
  // Store the context's root element
  root: Element
  // Reactive dataset available to the entire scope
  data: UnwrapNestedRefs<T & { $refs: Record<string, Element> }>
  init: boolean
  // Hold all context runners for disposal
  effects: ReactiveEffectRunner[] = []

  // Stores a referene to the root app instance
  app: Beskydy<object>

  constructor(root: R, app: A, initialDataset?: T) {
    this.root = root
    this.data = reactive(Object.assign({ $refs: {} }, app.rootState, initialDataset))
    this.init = false
    this.app = app
  }

  /**
   * Executes the provided callback fn whenever the context's reactive
   * dataset updates
   *
   * @param fn Callback
   */
  effect(fn: () => any) {
    const handler = rawEffect(fn)
    this.effects.push(handler)
  }

  /**
   * Stores a reference to a DOM element by the provided key. This
   * allows us to use $refs object within expressions
   *
   * @param key Ref key
   * @param ref Element
   */
  addRef(key: string, ref: Element) {
    Object.assign(this.data.$refs, { [key]: ref })
  }

  /**
   * When creating sub contexts, this allows for a parent context to
   * share its reactive properties with the child context
   *
   * @param ctx Context
   */
  extend(ctx: ContextAny) {
    Object.assign(this.data, ctx.data)
  }

  /**
   * Evaluates the provided expression against the context dataset
   * 
   * @param expr Expression 
   * @param el Optionally, make the current element available as $el
   * @returns 
   */
  eval(expr: string, el?: Node | undefined) {
    return evaluate(this.data, expr, el)
  }

  /**
   * Turns the scope's elements to the original static HTML. Removes
   * event listeners and stops reactive watchers.
   */
  teardown() {
    // Iterate over all children of a ctx and remove any beskydy functionality
    this.effects.forEach(e => e.effect.stop())
    this.effects.length = 0

    // Clone whole subtree and re-attach it to the parent. This removes any event listeners
    const clone = this.root.cloneNode(true)
    this.root.parentElement?.replaceChild(clone, this.root)

    // Overwrite context dataset with an empty object
    Reflect.set(this, 'data', Object.create(null))

    this.init = false
  }
}
