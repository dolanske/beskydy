import { describe, expect, test, vi } from 'vitest'
import { nit, watchNit } from '../../reactivity/nit'
import { watchStack } from '../../reactivity/stack'

describe('Nit', () => {
  test('Defaults and initialization', () => {
    const item = nit()
    expect(item.val).toBeUndefined()
    item.val = 'hello'

    expect(item.val).toBe('hello')
    expect(item.val).toBeTypeOf('string')
    expect(item.effects).toBeInstanceOf(Set)
    expect(item.__is_nit).toBeTruthy()
  })

  test('Tracking and methods', () => {
    const item = nit(0)
    const nitTest = {
      watcher: (value: number) => {
        expect(value).toBe(5)
      },
    }

    const spyNitTest = vi.spyOn(nitTest, 'watcher')
    expect(spyNitTest).not.toHaveBeenCalled()

    // @ts-expect-error Watcher fn
    const unsubscribe = item.watch(spyNitTest)
    expect(item.effects).toContain(nitTest.watcher)
    item.val = 5
    expect(spyNitTest).toHaveBeenCalled()

    // Remove watcher now
    unsubscribe()
    expect(item.effects).toHaveLength(0)
  })

  test('watch', () => {
    const item = nit(0)

    const unsubscribe = watchNit(item, (newVal, oldVal) => {
      expect(newVal).toBe(1)
      expect(oldVal).toBe(0)
    })

    item.val++
    unsubscribe()
    item.val++
    expect(item.effects).toHaveLength(0)
  })

  // TODO: figure out how to test watch effect
  test('WatcheFfect', async () => {
    const item = nit(0)
    // const activeEffect = await vi.importActual('../../reactivity/shared.ts')

    watchStack(() => {
      // expect(item.val).not.toBe(5)
    })

    item.val = 5
  })
})
