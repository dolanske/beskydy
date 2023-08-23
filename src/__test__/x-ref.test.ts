import { expect, test } from 'vitest'
import { createScope } from '../scope'
import { useRefExample } from './util/dom'

/**
 * @vitest-environment jsdom
 */

test('x-ref directive', async () => {
  const [scope, refEl] = useRefExample(document)
  const { ctx } = createScope(scope)
  expect(ctx.refs.msg).toStrictEqual(refEl)
  expect(ctx.refs.msg.textContent).toBe('Hello World')
})
