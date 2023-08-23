import { describe, expect, test } from 'vitest'
import { Context } from '../context'

/**
 * @vitest-environment jsdom
 */

describe('Test Development Suite for the ctx implementation', () => {
  test('Context initialization', () => {
    const rootEl = document.createElement('div')
    // cobn
    const ctx = new Context(rootEl, { count: 5 })

    expect(ctx.root).toStrictEqual(rootEl)
    expect(ctx.data.count).toBe(5)
  })
})
