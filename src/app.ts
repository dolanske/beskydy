import { getAttr } from './util/domUtils'
import { evaluate, execute } from './evaluate'
import { stack, watchStack } from './reactivity/stack'
import { processIf } from './directives/x-if'
import { processOn } from './directives/x-on'

export function createApp(appOptions: Record<string, any>) {
  // Global scope
  const $ctx = stack({})
  Object.assign($ctx, appOptions)

  const scopes = Array.from(document.querySelectorAll('[x-scope]'))

  for (const scope of scopes) {
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_ALL)
    const scopeStack = stack(Object.assign({}, $ctx))
    let node: Node | null = walker.root

    while (node !== null) {
      switch (node.nodeType) {
        // NOTE HTMLElement
        case 1: {
          const el = node as HTMLElement
          let attrValue: string | null

          // SECTION ----
          // x-data
          if (
            (attrValue = getAttr(el, 'x-data'))
            || (attrValue = getAttr(el, 'x-scope'))
          ) {
            try {
              const data = execute({}, `return ${attrValue}`)
              for (const key of Object.keys(data)) {
                Object.defineProperty(scopeStack, key, {
                  value: data[key],
                  writable: true,
                  enumerable: true,
                  configurable: true,
                })
              }
            }
            catch (e) {
              continue
            }
          }

          // SECTION ----
          // x-text
          if ((attrValue = getAttr(el, 'x-text'))) {
            // Save expression value because when the stack has changed, the value might be null already
            const expr = attrValue
            watchStack(() => {
              const text = evaluate(scopeStack, expr)
              el.innerText = text
            })
          }

          // SECTION ----
          // x-if, x-else and x-else-if
          if ((attrValue = getAttr(el, 'x-if')))
            processIf(scopeStack, el, attrValue)

          // SECTION ----
          // All other directives
          if (el.attributes.length > 0) {
            for (const attr of Array.from(el.attributes)) {
              const name = attr.name

              if (name.startsWith('@') || name.startsWith('x-on'))
                processOn(scopeStack, el, name, attr.value)
            }
          }

          break
        }

        // NOTE Text
        // Should transform whatever content is within {{ }}
        // case 3: {
        //   // Idk
        //   break
        // }

        default: {
          // idk
          // console.log('Unknown Node', node)
        }
      }

      node = walker.nextNode()
    }
  }
}
