import type { Scope } from '../app'
import { evaluate } from '../evaluate'
import { watchStack } from '../reactivity/stack'
import { isArr, isNil } from '../util'

const ModelModifiers = {
  trim: (value: string) => value.trim(),
  number: (value: string) => Number(value),
  // debounced: (value, ms) =>
} as const

export type ModelElement = HTMLInputElement | HTMLSelectElement | HTMLDetailsElement | HTMLTextAreaElement
type Modifier = keyof typeof ModelModifiers

/**
 * Sets up a two way binding with an input/select element. This can be
 * used on
 * - <input />, <textarea>, <select />, <details />
 *
 * This directive first checks wether the supplied model has a value and
 * only then checks if a value attribute is available instead.
 *
 */

export function processModel(
  scope: Scope,
  el: ModelElement,
  attrKey: string,
  attrExpr: string,
) {
  const [_, modifier] = attrKey.split('.') as [unknown, Modifier]
  const defaultValue = el.attributes.getNamedItem('value')?.value

  const modify = (value: string) => {
    if (!modifier)
      return value
    return ModelModifiers[modifier](value)
  }

  const assignSimpleDefaultValue = () => {
    let finalValue
    const modelValue = evaluate(scope, attrExpr)

    if (!modelValue) {
      if (defaultValue)
        finalValue = defaultValue
    }
    else {
      finalValue = modelValue
    }

    Object.assign(scope, { [attrExpr]: finalValue })
    // @ts-expect-error Dont know how to inline cast ModelElement type
    el.value = finalValue
  }

  switch (el.tagName) {
    case 'INPUT':
    case 'TEXTAREA': {
      el = el as HTMLInputElement

      switch (el.attributes.getNamedItem('type')?.value) {
        // Listen for 'change' event
        case 'checkbox': {
          const modelValue = scope[attrExpr] as Array<any> | string | undefined | null

          /**
           * With checkbox, there are multiple cases
           *  - no value:       we toggle checked state as a boolean
           *  - value:          we toggle checked state as its value
           *  - array no value: nothing, array of random booleans makes no sense
           *  - array values:   push / splice out if checked or not
           */

          const setCheckboxValue = (value: string, checked: boolean) => {
            // Selected but something else: ARRAY
            if (isArr(modelValue)) {
              if (modelValue.includes(value))
                modelValue.splice(modelValue.indexOf(value), 1)
              else
                modelValue.push(value)
            }
            // Primitive
            else {
              scope[attrExpr] = isNil(value) ? !checked : value
            }
          }

          // If no model value is provided and element contains checked, assign default value
          if ((!modelValue || modelValue.length === 0) && el.hasAttribute('checked')) {
            setCheckboxValue(el.value, true)
            el.removeAttribute('checked')
          }

          el.addEventListener('change', (evt) => {
            const { checked, value } = (evt?.target as HTMLInputElement)
            setCheckboxValue(value, checked)
          })

          watchStack(() => {
            el = el as HTMLInputElement
            // Update in case some properties are removed or set elsewhere
            const results = evaluate(scope, attrExpr)

            if (results.includes(el.value) || el.value === results)
              el.checked = true
            else
              el.checked = false
          })
          break
        }

        // Listen for 'change' event
        case 'radio': {
          // Default value
          if (el.hasAttribute('checked')) {
            el.removeAttribute('checked')
            Object.assign(scope, { [attrExpr]: el.value })
          }

          el.addEventListener('change', (evt) => {
            const { checked, value } = (evt.target as HTMLInputElement)
            if (checked)
              Object.assign(scope, { [attrExpr]: value })
          })

          // If evaluated value changes, make sure to update the HTML as well
          watchStack(() => {
            el = el as HTMLInputElement
            const newValue = evaluate(scope, attrExpr)
            el.checked = el.value === newValue
          })
          break
        }

        // All other inputs
        default: {
          assignSimpleDefaultValue()

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
      el = el as HTMLSelectElement
      assignSimpleDefaultValue()

      el.addEventListener('change', (evt) => {
        const value = (evt.target as HTMLSelectElement).value
        Object.assign(scope, { [attrExpr]: value })
      })

      watchStack(() => (el as HTMLSelectElement).value = evaluate(scope, attrExpr))
      break
    }

    case 'DETAILS': {
      el = el as HTMLDetailsElement
      const defaultOpen = el.attributes.getNamedItem('open')
      const currentValue = evaluate(scope, attrExpr)

      el.open = !isNil(currentValue) ? currentValue : (defaultOpen ?? false)

      el.addEventListener('toggle', (evt) => {
        const value = (evt.target as HTMLDetailsElement).open
        Object.assign(scope, { [attrExpr]: value })
      })

      watchStack(() => (el as HTMLDetailsElement).open = evaluate(scope, attrExpr))
      break
    }

    // Let all other elements fallthrough
    default: break
  }
}
