import { getAttr } from './util/domUtils'
import { evaluate } from './evaluate'
import { stack, watchStack } from './reactivity/stack'
import { processIf } from './directives/x-if'
import { processOn } from './directives/x-on'
import { nit } from './reactivity/nit'
import { processHTML } from './directives/x-html'
import { processClass } from './directives/x-class'
import { processShow } from './directives/x-show'
import { processBind } from './directives/x-bind'
import { processStyle } from './directives/x-style'

export interface Scope {
  [key: PropertyKey]: unknown
  // $refs: Record<string, HTMLElement>
}

export function createApp(appOptions: Record<string, any>) {
  // Global properties
  // const $data = stack({})

  // Get all scopes in the document and initialize them
  const scopes = Array.from(document.querySelectorAll('[x-scope]'))

  for (const scope of scopes) {
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_ALL)
    let node: Node | null = walker.root
    const scopeStack = stack<Scope>({})
    const isScopeInit = nit(false)

    // Hide scopes until they're fully initiated
    isScopeInit.watch((isInit) => {
      if (isInit)
        scope.removeAttribute('style')
      else
        scope.setAttribute('style', 'display:none;')
    })

    while (node !== null) {
      switch (node.nodeType) {
        // NOTE HTMLElement
        case 1: {
          const el = node as HTMLElement
          let attrValue: string | null

          // SECTION x-skip
          // Elements with x-skip will be skipped during evaluation. The
          // skip includes all elements children. Selects the next sibling.
          if (getAttr(el, 'x-skip') !== null) {
            node = walker.nextSibling()
            continue
          }

          // SECTION x-data / x-scope
          if (
            (attrValue = getAttr(el, 'x-data'))
            || (attrValue = getAttr(el, 'x-scope'))
          ) {
            try {
              const data = evaluate({}, attrValue)
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

          // SECTION x-ref
          // if ((attrValue = getAttr(el, 'x-ref')))
          //   processRef(scopeStack, el, attrValue)

          // SECTION x-text
          if ((attrValue = getAttr(el, 'x-text'))) {
            // Save expression value because when the stack has changed, the value might be null already
            const expr = attrValue
            watchStack(() => {
              const text = evaluate(scopeStack, expr)
              el.innerText = text
            })
          }

          // SECTION x-if, x-else and x-else-if
          //
          if ((attrValue = getAttr(el, 'x-if')))
            processIf(scopeStack, el, attrValue)

          // SECTION x-show
          if ((attrValue = getAttr(el, 'x-show')))
            processShow(scopeStack, el, attrValue)

          // SECTION x-html
          if ((attrValue = getAttr(el, 'x-html')))
            processHTML(scopeStack, el, attrValue)

          // SECTION x-class
          if ((attrValue = getAttr(el, 'x-class')))
            processClass(scopeStack, el, attrValue)

          // SECTION x-style
          if ((attrValue = getAttr(el, 'x-style')))
            processStyle(scopeStack, el, attrValue)

          // SECTION All other directives
          if (el.attributes.length > 0) {
            for (const attr of Array.from(el.attributes)) {
              const name = attr.name

              // SECTION x-on
              if (name.startsWith('@') || name.startsWith('x-on'))
                processOn(scopeStack, el, name, attr.value)

              // SECTION x-bind
              if (name.startsWith('x-bind'))
                processBind(scopeStack, el, name, attr.value)
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

        // case 11: {
        //   Document fragment
        // }

        default: {
          // idk
          // console.log('Unknown Node', node)
        }
      }

      node = walker.nextNode()
    }

    isScopeInit.val = true

    console.log(scopeStack)
  }

  return {
    // Watch for when a property is updated
    // on: (key, (newVal, prevVal))  => {
    // }
  }
}
