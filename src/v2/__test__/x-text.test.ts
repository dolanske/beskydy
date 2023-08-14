import { expect, test } from 'vitest'
import { createScope } from '../scope'
import { useExampleWithRef } from './_test-dom-setups'

/**
 * @vitest-environment jsdom
 */

test('x-text directive', async () => {
  const [scope, , text] = useExampleWithRef(document)
  createScope(scope)
  expect(text.textContent).toBe('Hello World')
})
