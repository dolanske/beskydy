import { reactive } from '@vue/reactivity'
import { Context } from './context'
import { walk } from './walker'

export const globalState = reactive({})

export function createApp<T extends object>(initialDataset: T) {
  Object.assign(globalState, initialDataset)
  const scopeRoots = Array.from(document.querySelectorAll('[x-scope]'))

  for (const scopeRoot of scopeRoots)
    createScope(scopeRoot)
}

export function createScope(scopeRoot: Element) {
  const ctx = new Context(scopeRoot)
  scopeRoot.setAttribute('style', 'display:none;')
  walk(ctx)
  ctx.$init = true
  scopeRoot.removeAttribute('style')

  return { ctx }
}
