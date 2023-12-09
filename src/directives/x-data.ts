import { evaluate } from '../evaluate'
import { isObj } from '../helpers'
import type { Directive } from './directives'

/**
 * 
 * @param ctx 
 * @param node 
 * @param param2 
 * @returns 
 */
export const processData: Directive<boolean> = function (ctx, node, { name, value }) {
  node.removeAttribute(name)

  function end() {
    throw new Error('[x-scope/x-data] Error when processing attribute. \n Most likely an issue with the the data object.')
  }

  if (name === 'x-scope' && ctx.root !== node)
    throw new Error('Can not initialize a new scope within an existing scope')

  try {
    if (!value)
      end()

    const data = evaluate({}, value)

    if (!isObj(data))
      end()

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
    end()
  }

  return false
}
