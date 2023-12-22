import { isArr, isNil, parseValue } from '../helpers'
import type { Directive, Primitive } from './directives'

export type ModelModifierFn = (value: string, oldValue: string, param?: any) => unknown

export const modelModifiers: Record<string, ModelModifierFn> = {
  trim: (value: string) => value.trim(),
  number: (value: string, prevValue: string) => {
    if (Number.isNaN(Number(value)))
      return Number(prevValue)

    return Number(value)
  },
} as const

export type ModelElement = HTMLInputElement | HTMLSelectElement | HTMLDetailsElement | HTMLTextAreaElement
type Modifier = keyof typeof modelModifiers

export const processModel: Directive = function (ctx, el, { name, value }) {
  let node = el as ModelElement
  const [_, modifier] = name.split('.') as [unknown, Modifier]
  const defaultValue = node.attributes.getNamedItem('value')?.value

  // Call back to execute model modifiers and return the modified value
  const modify = (newValue: string, oldValue: string) => {
    if (!modifier)
      return newValue

    // Model param
    const [key, rawParams] = modifier.split('[')
    let param: Primitive

    if (rawParams) {
      const parsedModifier = rawParams.replace(']', '')
      // The parameter can be a reactive variable.
      // So we should evaluate it against the current context, but only if its available
      param = parseValue(parsedModifier, ctx)
    }

    return ctx.app.modelModifiers[key](newValue, oldValue, param)
  }

  const assignSimpleDefaultValue = () => {
    let finalValue
    const modelValue = ctx.eval(value)

    if (!modelValue) {
      if (defaultValue)
        finalValue = defaultValue
    }
    else {
      finalValue = modelValue
    }

    Object.assign(ctx.data, { [name]: finalValue })
    node = node as HTMLInputElement
    node.value = finalValue
  }

  switch (node.tagName) {
    case 'INPUT':
    case 'TEXTAREA': {
      node = node as HTMLInputElement

      switch (node.type) {
        // Listen for 'change' event
        case 'checkbox': {
          const modelValue = Reflect.get(ctx.data, value) as Array<any> | string | undefined | null

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
              Reflect.set(ctx.data, value, isNil(value) ? !checked : value)
            }
          }

          // If no model value is provided and element contains checked, assign default value
          if ((!modelValue || modelValue.length === 0) && node.hasAttribute('checked')) {
            setCheckboxValue(node.value, true)
            node.removeAttribute('checked')
          }

          node.addEventListener('change', (evt) => {
            const { checked, value } = (evt?.target as HTMLInputElement)
            setCheckboxValue(value, checked)
          })

          ctx.effect(() => {
            node = node as HTMLInputElement
            // Update in case some properties are removed or set elsewhere
            const results = ctx.eval(value)

            if (results.includes(node.value) || node.value === results)
              node.checked = true
            else
              node.checked = false
          })
          break
        }

        // Listen for 'change' event
        case 'radio': {
          // Default value
          if (node.hasAttribute('checked')) {
            node.removeAttribute('checked')
            Object.assign(ctx.data, { [value]: node.value })
          }

          node.addEventListener('change', (evt) => {
            const { checked, value } = (evt.target as HTMLInputElement)
            if (checked)
              Object.assign(ctx.data, { [value]: value })
          })

          // If evaluated value changes, make sure to update the HTML as well
          ctx.effect(() => {
            node = node as HTMLInputElement
            const newValue = ctx.eval(value)
            node.checked = node.value === newValue
          })
          break
        }

        // All other inputs
        default: {
          assignSimpleDefaultValue()
          node.removeAttribute('x-model')
          node.addEventListener('input', (evt) => {
            const target = evt.target as HTMLInputElement
            const rawValue = target.value
            const modifiedValue = modify(rawValue, Reflect.get(ctx.data, value))

            // If modified value is different than raw value, we need to
            // re-assign this modification back to the original target.
            if (rawValue !== modifiedValue)
              target.value = String(modifiedValue)

            Object.assign(ctx.data, { [value]: modifiedValue })
          })

          ctx.effect(() => (node as HTMLInputElement).value = ctx.eval(value))
        }
      }
      break
    }

    case 'SELECT': {
      node = node as HTMLSelectElement
      assignSimpleDefaultValue()

      node.addEventListener('change', (evt) => {
        const val = parseValue((evt.target as HTMLSelectElement).value, ctx)
        Object.assign(ctx.data, { [value]: val })
      })

      ctx.effect(() => (node as HTMLSelectElement).value = ctx.eval(value))
      break
    }

    case 'DETAILS': {
      node = node as HTMLDetailsElement
      const defaultOpen = node.attributes.getNamedItem('open')
      const currentValue = ctx.eval(value)

      node.open = !isNil(currentValue) ? currentValue : (defaultOpen ?? false)

      node.addEventListener('toggle', (evt) => {
        const isOpen = (evt.target as HTMLDetailsElement).open
        Object.assign(ctx.data, { [value]: isOpen })
      })

      ctx.effect(() => (node as HTMLDetailsElement).open = ctx.eval(value))
      break
    }
  }
}
