import { Beskydy } from './scope'

import type {
  Directive,
  Primitive,
  EventModifierFn,
} from './directives/directives'

import type {
  ModelModifierFn,
} from './directives/x-model'

export {
  Beskydy,
  Directive,
  Primitive,
  EventModifierFn,
  ModelModifierFn
}

//////////////////////////////////////////////

const app = new Beskydy({
  // loading: false,
  // people: [],
  // fetchData() {
  //   this.loading = true
  //   fetch("https://swapi.dev/api/people").then(r => r.json()).then(r => {
  //     this.people = r.results
  //     this.loading = false
  //   })
  // }
})

app.setDelimiters("{", "}")

app.defineDirective('x-three', (ctx, el, attr) => {
  ctx.effect(() => {
    const value: number = ctx.eval(attr.value)

    if (value % 3 === 0) {
      el.textContent = "DIVISIBLE BY THREE!!!"
    } else {
      el.textContent = String(value)
    }
  })
})

// Modify the model value
app.defineModelModifier('capitalize', (value) => {
  return String(value).toUpperCase()
})

// Modify if event is registered
app.defineEventModifier('every', (_, state, param) => {
  return state.calledTimes % Number(param) === 0
})

app.collect()