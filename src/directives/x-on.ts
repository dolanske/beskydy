import { evaluate, execute } from '../evaluate'
import type { Directive, Modifier, ModifierFn, ModifierListenerState, Primitive } from '.'

export const eventModifiers: Record<string, ModifierFn> = {
  // REVIEW
  // Figure out if leading / trailing options are needed
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
      const [key, rawParams] = modifier.split('[')
      let param: Primitive

      if (rawParams) {
        const parsedModifier = rawParams.replace(']', '')
        // The parameter can be a reactive variable. So we should evaluate it against the current contextr
        param = evaluate(ctx.data, parsedModifier)
      }

      return { key, param }
    })
    .filter((modifier) => {
      return Object.keys(eventModifiers).includes(modifier.key)
    })

  if (value.startsWith('()'))
    value = `(${value})()`

  // State variables, which some of the modifiers use
  const state: ModifierListenerState = {
    calledTimes: 0,
    lastCall: 0,
  }

  node.addEventListener(eventKey, (event) => {
    // In case there are modifiers and some of them did NOT pass, do not
    // allow the callback to execute
    if (!modifiers.every(modifier => eventModifiers[modifier.key](event, state, modifier.param)))
      return

    execute(ctx.data, value, node, event)
    state.calledTimes++
    state.lastCall = Date.now()
  })
}
