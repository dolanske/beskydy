import { expect, test } from 'vitest'
import { createScope } from '../scope'
import { useRefExample } from './util/dom'

/**
 * @vitest-environment jsdom
 */

test('x-text directive', async () => {
  const [scope, , text] = useRefExample(document)
  createScope(scope)
  expect(text.textContent).toBe('Hello World')
})
