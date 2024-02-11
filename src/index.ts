import { Beskydy } from './beskydy'
import type { Directive, EventModifierFn, Primitive } from './directives/directives'
import type { ModelModifierFn } from './directives/x-model'

export {
  Beskydy,
  Directive,
  Primitive,
  EventModifierFn,
  ModelModifierFn,
}

//////////////////////////////////////////////

const app = new Beskydy({
  selected: 'people',
  loading: true,
  data: [],
  fetchData() {
    this.loading = true
    fetch(`https://swapi.dev/api/${this.selected}`)
      .then(r => r.json())
      .then((r) => {
        this.loading = false
        this.data = r.results
      })
  },
  // makeElement() {
  //   return document.createElement("table")
  // }
})

// app.setDelimiters("[", "]")

// app.defineDirective('x-three', (ctx, el, attr) => {
//   ctx.effect(() => {
//     const value: number = ctx.eval(attr.value)

//     if (value % 3 === 0) {
//       el.textContent = "DIVISIBLE BY THREE!!!"
//     } else {
//       el.textContent = String(value)
//     }
//   })
// })

// Modify the model value
// app.defineModelModifier('maxlength', (value, prevValue, length: number) => {
//   if (value.length > length)
//     return prevValue
//   return value
// })

// // Modify if event is registered
// app.defineEventModifier('every', (_, state, param) => {
//   return state.calledTimes % Number(param) === 0
// })

app.collect()
