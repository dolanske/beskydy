import { execute } from '../evaluate'
import { parseValue } from '../helpers'
import type { Directive, EventModifierFn, Modifier, ModifierListenerState, Primitive } from './directives'

// Default event modifiers which are bound to an app instance
export const eventModifiers: Record<string, EventModifierFn> = {
  throttle: (_, { lastCall }, amount = 300) => {
    if (typeof amount !== 'number')
      return false
    if (Date.now() - lastCall >= amount)
      return true
    return false
  },
  if: (_, __, rawEval) => !!rawEval,
  only: (_, { calledTimes }, callLimit = 1) => {
    if (typeof callLimit !== 'number')
      return false
    return calledTimes < callLimit
  },
  once: (_, { calledTimes }) => calledTimes < 1,
  self: e => e.target === e.currentTarget,
  left: e => 'button' in e && (e as MouseEvent).button === 0,
  middle: e => 'button' in e && (e as MouseEvent).button === 1,
  right: e => 'button' in e && (e as MouseEvent).button === 2,
  prevent: (e) => {
    e.preventDefault()
    return true
  },
  stop: (e) => {
    e.stopPropagation()
    return true
  },
  stopImmediate: (e) => {
    e.stopImmediatePropagation()
    return true
  },
}

/**
 * Binds an event listener with optional modifiers to the selected
 * element. The provided expression is evaluated whenever the event is
 * fired.
 */
export const processOn: Directive = function (ctx, node, { name, value }) {
  node.removeAttribute(name)

  // Get the event name and its modifiers. The two supported syntaxes
  // for binding event listeners are using either `@event` or
  // `x-on:event`. With optional modifiers appended by using
  // `@event.modifier.modifier` etc
  const eventKeyRaw = (name.startsWith('x-on') ? name.split(':')[1] : name.substring(1)).split('.')
  const eventKey = eventKeyRaw[0]

  // Collect optional modifiers from the event name
  // (event.modifier.modifier) and filter out ones which aren't
  // supported (aka user errors)
  const modifiers: Modifier[] = eventKeyRaw
    .slice(1)
    .map((modifier) => {
      // Split modifier into a key and possible parameter
      // eventKey[param]=""
      const [key, rawParams] = modifier.split('[')
      let param: Primitive

      if (rawParams) {
        const parsedModifier = rawParams.replace(']', '')
        // The parameter can be a reactive variable.
        // So we should evaluate it against the current context, but only if its available
        param = parseValue(parsedModifier, ctx)
      }

      return { key, param }
    })
    .filter((modifier) => {
      return Object.keys(ctx.app.eventModifiers).includes(modifier.key)
    })

  // FIXME: this won't work if its defined as (event) => 
  // Solution: just check for '('
  if (value.startsWith('()'))
    value = `(${value})()`

  // State variables, which some of the modifiers use
  const state: ModifierListenerState = {
    calledTimes: 0,
    lastCall: 0,
  }

  node.addEventListener(eventKey, (event: Event) => {
    // Only execute callback if every modifier passes
    if (modifiers.every(modifier => ctx.app.eventModifiers[modifier.key](event, state, modifier.param)))
      execute(ctx.data, value, node, event)

    state.calledTimes++
    state.lastCall = Date.now()
  })
}
