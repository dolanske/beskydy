import { stack, watchStack } from './reactivity/stack'
import type { Effect } from './reactivity/types'

export interface Context<T extends object> {
  __updates: Effect[]
  $root: Element
  $scope: T
  $expr: WeakMap<Element, { attr: string; expt: string }>
  $refs: Record<string, Element>
}

/**
 * Piece of DOM which holds its own state.
 *
 * To be honest I currently have no idea how to implement or use this. The idea
 * is to be able to hold state within a scope, that is only accessible to an
 * element and its descendants.
 *
 * So a x-scope would have its context.
 *
 * But another element could have its own context WITHIN.
 *
 * Maybe a WeakMap<HTMLElement, Scope> ? And when checking if variable is in
 * scope, we check if parent.contains(el) or something
 */

export class Context<T> {
  constructor(root: Element, defaultScope: T) {
    this.__updates = []
    this.$root = root
    this.$scope = stack(defaultScope)
    this.$refs = {}
    this.$expr = new WeakMap()
  }

  update(fn: Effect) {
    this.__updates.push(fn)
  }

  extend(ctx: Context) {
    if ()
    // Object.assign(this, ctx)
  }
}

export function createContext<T>(defaultScope: object, _root: Element): Context<T> {
  const updates: Effect[] = []
  const $scope = stack(defaultScope)
  // Store the context root element
  const $root: Context['$root'] = _root
  // All the scope refs, which are accessible even if accessor is a child of the ref
  const $refs = stack<Context['$refs']>({})
  // Store all scope expressions for an element
  const $expr: Context['$expr'] = new WeakMap()

  // The main effect
  watchStack(() => {
    updates.forEach(fn => fn($scope))
  })

  return {
    $root,
    $expr,
    $scope,
    $refs,
    update: (fn: Effect) => updates.push(fn),
    release: () => {
      // Close and release
      updates.length = 0
    },
    extend: (_ctx: Context) => {
      // $scope
      // Object.assign(this, _ctx)
    },
  }
}
