/**
 * @vitest-environment jsdom
 */

import { expect, test } from 'vitest'
import { createScope } from '../scope'
import { useForExample } from './util/dom'

test('x-for', () => {
  const [scope] = useForExample(document)
  const { ctx } = createScope(scope)

  expect(ctx.$root.children.length).toBe(5)
})
