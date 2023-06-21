import { stack } from './reactivity/stack'

const test = stack(new Map())

// watchStack(() => {
// console.log(test)
// })

test.set('world', 'bello')

console.log(test)
