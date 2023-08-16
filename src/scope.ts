import { Context } from './context'
import { walkRoot } from './walker'

export function createApp() {
  const scopeRoots = Array.from(document.querySelectorAll('[x-scope]'))

  for (const scopeRoot of scopeRoots)
    createScope(scopeRoot)
}

export function createScope(scopeRoot: Element) {
  const ctx = new Context(scopeRoot)
  scopeRoot.setAttribute('style', 'display:none;')
  walkRoot(ctx, true)
  ctx.$init = true
  scopeRoot.removeAttribute('style')

  return {
    ctx,
    // dispose: () => {
    //   // TODO
    //   // Remove element from DOM etc
    // },
  }
}
