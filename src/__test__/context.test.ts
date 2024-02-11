import { describe, expect, it } from 'vitest'
import { Context } from '../context'
import { Beskydy } from '..'
import { walk } from '../walker'

// @vitest-environment jsdom

function prepareCtx() {
  const setup = `<div x-scope="{ count: 10 }"></div>`
  const wrapper = document.createElement('div')
  wrapper.innerHTML = setup
  const root = wrapper.children[0]
  const app = new Beskydy({ title: 'hello' })
  const ctx = new Context(root, app, { other: 20 })
  walk(ctx)
  ctx.init = true
  return { root, app, ctx }
}

describe('beskydy scope context initialization', () => {
  const { ctx, app, root } = prepareCtx()

  it('root matching', () => {
    expect(ctx.root).toStrictEqual(root)
    expect(ctx.init).toBeTruthy()
    expect(ctx.app).toStrictEqual(app)
    expect(ctx.effects).toStrictEqual([])
  })

  it('data object, setup', () => {
    expect(ctx.data).toStrictEqual({
      $refs: {},
      // Comes from the template
      count: 10,
      // Comes from instance inital global state
      title: 'hello',
      // Comes from context default dataset
      other: 20,
    })
  })
})
