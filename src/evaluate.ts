/**
 * Thank you so much Evan You, I love you
 */

const evalCache: Record<string, Function> = Object.create(null)

export function evaluate(scope: any, exp: string, el?: Node) {
  return execute(scope, `return(${exp})`, el)
}

export function execute(scope: any, exp: string, el?: Node, event?: Event) {
  // By calling stringify, the function hits every single property within an
  // object. No matter how deep it is. This way we can ensure deep reactivity
  // Thanks to Alpine.js core for the tip
  JSON.stringify(scope)

  const fn = evalCache[exp] || (evalCache[exp] = toFunction(exp))
  try {
    return fn(scope, el, event)
  }
  catch (e) {
    if (import.meta.env.DEV) {
      // console.log(scope)
      console.warn(`Error when evaluating expression "${exp}":`)
    }
    console.error(e)
  }
}

function toFunction(exp: string): Function {
  try {
    // eslint-disable-next-line no-new-func
    return new Function('data', '$el', '$event', `with(data){${exp}}`)
  }
  catch (e) {
    console.error(`${(e as Error).message} in expression: ${exp}`)
    return () => { }
  }
}
