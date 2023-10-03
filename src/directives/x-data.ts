import { evaluate } from '../evaluate'
import { isObj } from '../helpers'
import type { Directive } from '.'

export const processData: Directive<boolean> = function (ctx, node, { name, value }) {
  node.removeAttribute(name)

  if (name === 'x-scope' && ctx.root !== node)
    throw new Error('Can not initialize a new scope within an existing scope')

  try {
    if (!value)
      return true

    const data = evaluate({}, value)

    if (!isObj(data))
      return true

    for (const key of Object.keys(data)) {
      Object.defineProperty(ctx.data, key, {
        value: data[key],
        writable: true,
        enumerable: true,
        configurable: true,
      })
    }
  }
  catch (e) {
    console.warn('[x-scope/x-data] Error when processing attribute')
    console.log(e)
    return true
  }

  return false
}
