import { isNil } from '../helpers'
import { evaluate } from '../evaluate'
import { type Directive } from './directives'

/**
 * Dynamically bind attribute or attributes if the expression passes
 *
 * Allowed syntax
 *
 * This syntax will bind a value-less attribute (boolean attribute) if the expression matches
 * - :attributeName="expression"
 * - x-bind:attributeName="expression"
 * - x-bind="{ attributeValue: expression }"
 */
export const processBind: Directive = function (ctx, node, { name, value }) {
  node.removeAttribute(name)

  const [_, propertyName] = name.split(':')

  const setOrDelAttr = (key: string, value: any) => {
    // If no value is provided or the value is a boolean, remove the
    // attribute instead of simply setting it to the value. 

    // The reason for that is disabled="false" will still disable the
    // attribute, as boolean attributes dont care about the value
    if (isNil(value) || value === false)
      node.removeAttribute(key)
    else
      node.setAttribute(key, value)
  }

  if (propertyName) {
    // x-bind:propertyName="" syntax
    ctx.effect(() => {
      const result = evaluate(ctx.data, value, node)
      setOrDelAttr(propertyName, result)
    })
  }
  else {
    // x-bind="{}" syntax
    ctx.effect(() => {
      const results = evaluate(ctx.data, value, node) ?? {}

      for (const key of Object.keys(results)) {
        const result = results[key]
        setOrDelAttr(key, result)
      }
    })
  }
}
