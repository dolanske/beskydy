import { expect, test } from 'vitest'
import { createScope } from '../scope'
import { useExampleWithRef } from './_test-dom-setups'

/**
 * @vitest-environment jsdom
 */

test('x-ref directive', async () => {
  const [scope, refEl] = useExampleWithRef(document)
  const { ctx } = createScope(scope)
  expect(ctx.$refs.msg).toStrictEqual(refEl)
  expect(ctx.$refs.msg.textContent).toBe('Hello World')
})
