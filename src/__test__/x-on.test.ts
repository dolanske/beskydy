/**
 * @vitest-environment jsdom
 */

import { expect, test } from 'vitest'
import { createScope } from '../scope'
import { delay } from '../helpers'
import { useModelExample } from './util/dom'

test('x-on', async () => {
  const [scope, input] = useModelExample(document)
  const { ctx } = createScope(scope)

  input.dispatchEvent(new InputEvent('x-model', { data: 'Hello World' }))

  console.log(ctx.data)
  // expect(ctx.data.val).toBe('e')
  // expect(scope.children[0]).toStrictEqual(input)
})
