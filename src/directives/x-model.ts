import type { Scope } from '../app'
import { evaluate } from '../evaluate'
import { watchStack } from '../reactivity/stack'

const ModelModifiers = {
  trim: (value: string) => value.trim(),
  number: (value: string) => Number(value),
  // debounced: (value, ms) =>
} as const

export type ModelElement = HTMLInputElement | HTMLSelectElement | HTMLDetailsElement | HTMLTextAreaElement
type Modifier = keyof typeof ModelModifiers

/**
 * This variable is used whenever there are multiple checkboxes with the
 * same `x-model` expression in them. In that case, the result is saved
 * to a WeakMap where the key is the input element and it holds its
 * checked value.
 */
const cachedCheckboxRefs: Record<string, WeakMap<HTMLInputElement, string>> = Object.create(null)

function setCheckboxRef(id: string, el: HTMLInputElement, value: string) {
  if (cachedCheckboxRefs[id])
    cachedCheckboxRefs[id].set(el, value)
  else
    cachedCheckboxRefs[id] = new Map([[el, value]])
}

/**
 * Sets up a two way binding with an input/select element. This can be used on
 * - <input />, <textarea>, <select />, <details />
 */

export function processModel(
  scope: Scope,
  el: ModelElement,
  attrKey: string,
  attrExpr: string,
) {
  const [_, modifier] = attrKey.split('.') as [unknown, Modifier]
  const defaultValueAttr = el.attributes.getNamedItem('value')
  const defaultValue = defaultValueAttr ? defaultValueAttr.value : attrExpr

  // Assign value to scope

  const modify = (value: string) => {
    if (!modifier)
      return value
    return ModelModifiers[modifier](value)
  }

  switch (el.tagName) {
    case 'INPUT':
    case 'TEXTAREA': {
      el = el as HTMLInputElement

      switch (el.attributes.getNamedItem('type')?.value) {
        // Listen for 'change' event
        case 'checkbox': {
          const isChecked = el.checked
          setCheckboxRef(attrExpr, el, isChecked)

          el.addEventListener('change', (evt) => {
            const { checked } = (evt?.target as HTMLInputElement)

            const currentValue = scope[attrExpr] as boolean | boolean[]

            if (ty)

            // const cached = 
            
          })

          watchStack(() => {
            setCheckboxRef(attrExpr, el, evaluate(scope,))
            // Update in case some properties are removed etc
          })

          break
        }

        // Listen for 'change' event
        case 'radio': {
          break
        }

        // All other inputs
        default: {
          // If item contains a default value, assign it
          if (defaultValue) {
            const currentValue = evaluate(scope, attrExpr)
            if (currentValue === defaultValue)
              return

            Object.assign(scope, { [attrExpr]: defaultValue })
            el.value = defaultValue
          }

          el.addEventListener('input', (evt) => {
            const rawValue = (evt.target as HTMLInputElement).value
            const modifiedValue = modify(rawValue)
            Object.assign(scope, { [attrExpr]: modifiedValue })
          })

          watchStack(() => (el as HTMLInputElement).value = evaluate(scope, attrExpr))
        }
      }
      break
    }

    case 'SELECT': {
      // List for 'change' event
      break
    }

    case 'DETAILS': {
      // List for 'toggle' event
    }

    // Let all other elements fallthrough
    default: break
  }
}
