import { stack } from './reactivity/stack'

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
export function createContext(root: Element) {
  return {
    $el: root,
    $data: stack({}),
  }
}
