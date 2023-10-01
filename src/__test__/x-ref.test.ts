import { expect, test } from 'vitest'
import { createScope } from '../scope'
import { useRefExample } from './util/dom'

/**
 * @vitest-environment jsdom
 */

test.skip('x-ref directive', async () => {
  const [scope, refEl] = useRefExample(document)
  const { ctx } = createScope(scope)
  expect(ctx.data.$refs.msg).toStrictEqual(refEl)
  expect(ctx.data.$refs.msg.textContent).toBe('Hello World')
})
