import type { Scope } from '../app'
import { execute } from '../evaluate'

const ModelModifiers: Record<string, (value: string, option: any) => unknown> = {
  trim: value => value.trim(),
  number: value => Number(value),
  // debounced: (value, ms) =>
}

/**
 * Sets up a two way binding with an input/select element. This can be used on
 * - <input />, <textarea>, <select />, <details />
 */

export function processModel(
  scope: Scope,
  el: HTMLElement,
  attrKey: string,
  attrExpr: string,
) {
  const [_, modifier] = attrKey.split('.')
  console.log(el.attributes.getNamedItem('type'))

  switch (el.tagName) {
    case 'input':
    case 'textarea': {
      // Special bindings for input
      // type=checkbox
      // type=radio
      // everything else
      switch (el.attributes.getNamedItem('type')?.value) {
        case 'checkbox': {
          break
        }

        case 'radio': {
          break
        }

        default: {
          el.oninput = (e) => {
            execute(scope, `attrExpr = ${e.target.value}`)
          }
          // All other inputs
        }
      }

      break
    }

    case 'select': {
      break
    }

    case 'details': {
      // stuff
    }

    // Let all other elements fallthrough
    default: break
  }
}
