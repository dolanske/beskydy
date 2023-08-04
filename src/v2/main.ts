import { Context } from './context'

const ctx = new Context(document.createElement('div'), {
  count: 0,
})

ctx.effect(() => {
  console.log(ctx.$scope.count)
})

ctx.$scope.count++
ctx.$scope.count++
ctx.$scope.count++
ctx.$scope.count++
