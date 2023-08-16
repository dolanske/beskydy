import { execute } from '../evaluate'
import type { Directive } from '.'
import { preProcessDirective } from '.'

interface ModifierListenerState {
  calledTimes: number
}

type Modifier = (e: Event, state: ModifierListenerState) => boolean

export const builtInModifiers: Record<string, Modifier> = {
  // TODO
  // Add option to provide parameters to modifiers
  // .only(amountofTimes) =>
  // .debounce(debounceBy) =>
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
}

/**
 * Binds an event listener with optional modifiers to the selected
 * element. The provided expression is evaluated whenever the event is
 * fired.
 */
export const processOn: Directive = function (ctx, node, { name, value }) {
  preProcessDirective(ctx, node, name, value)

  // Get the event name and its modifiers. The two supported syntaxes
  // for binding event listeners are using either `@event` or
  // `x-on:event`. With optional modifiers appended by using
  // `@event.modifier.modifier` etc
  const eventKeyRaw = (name.startsWith('x-on') ? name.split(':')[1] : name.substring(1)).split('.')
  const eventKey = eventKeyRaw[0]

  // Collect optional modifiers from the event name
  // (event.modifier.modifier) and filter out ones which aren't
  // supported (aka user errors)
  const modifiers = eventKeyRaw.slice(1).filter((modifier) => {
    return Object.keys(builtInModifiers).includes(modifier)
  }) as (keyof typeof builtInModifiers)[]

  if (value.startsWith('()'))
    value = `(${value})()`

  // State variables, which some of the modifiers use
  const state: ModifierListenerState = {
    calledTimes: 0,
  }

  node.addEventListener(eventKey, (event) => {
    // In case there are modifiers and some of them did NOT pass, do not
    // allow the callback to execute
    if (!modifiers.every(modifier => builtInModifiers[modifier](event, state)))
      return

    execute(ctx, value, node, event)
    state.calledTimes++
  })
}
