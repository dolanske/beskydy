// @vitest-environment jsdom

import { expect, it } from 'vitest'
import { prepareBareCtx } from '../test-utils'

const template = `
<div x-scope="{ count: 0 }">
  <span x-if="count < 3">Less than 3</span>
  <span x-else-if="count >= 3 && count <= 6">Between and including 3 and 6</span>
  <span x-else>More than 6</span>
</div>
`

it('[directives] x-if', () => {
  const { ctx, root } = prepareBareCtx(document, template)
  expect(root.children[0].textContent).toBe('Less than 3')

  ctx.data.count = 5
  expect(root.children[0].textContent).toBe('Between and including 3 and 6')

  ctx.data.count = 999
  expect(root.children[0].textContent).toBe('More than 6')

  ctx.data.count = 0
  expect(root.children[0].textContent).toBe('Less than 3')
})
