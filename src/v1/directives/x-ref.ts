import type { Scope } from '../app'

/**
 * TODO
 *
 * Saves element into a $refs object which is globally available
 * anywhere and in any scope.
 */
export function processRef(
  scope: Scope,
  el: HTMLElement,
  expr: string,
) {
  // Object.assign(scope.$refs, {
  //   [expr]: el,
  // })

  //
}
