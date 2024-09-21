import { evaluate } from '../evaluate'
import { isObj } from '../helpers'
import type { Directive } from './directives'

function throwDataErr() {
  throw new Error('[x-scope/x-data] Error when processing attribute. \n Most likely an issue with the the data object.')
}

export const processData: Directive<boolean> = function (ctx, node, { name, value }) {
  node.removeAttribute(name)

  if (name === 'x-scope' && ctx.root !== node)
    throw new Error('Can not initialize a new scope within an existing scope')

  try {
    if (!value)
      value = '{ }'

    const data = evaluate({}, value)

    if (!isObj(data))
      throwDataErr()

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
    // console.log(e)
    throwDataErr()
  }

  return false
}
