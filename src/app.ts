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
import type { ModelElement } from './directives/x-model'
import { processModel } from './directives/x-model'
import { prociessFor } from './directives/x-for'

export interface Scope {
  [key: PropertyKey]: unknown
  // $refs: Record<string, HTMLElement>
}

function walk(root: HTMLElement) {

}

export function applyNonRootAttrs(scope: Scope, el: HTMLElement) {
  let attrValue: string | null

  if ((attrValue = getAttr(el, 'x-for')))
    prociessFor(scope, el, attrValue)

  // SECTION x-ref
  // if ((attrValue = getAttr(el, 'x-ref')))
  //   processRef(scope, el, attrValue)

  // SECTION x-text
  if ((attrValue = getAttr(el, 'x-text'))) {
  // Save expression value because when the stack has changed, the value might be null already
    const expr = attrValue
    watchStack(() => {
      const text = evaluate(scope, expr)
      el.innerText = text
    })
  }

  // SECTION x-if, x-else and x-else-if
  //
  if ((attrValue = getAttr(el, 'x-if')))
    processIf(scope, el, attrValue)

  // SECTION x-show
  if ((attrValue = getAttr(el, 'x-show')))
    processShow(scope, el, attrValue)

  // SECTION x-html
  if ((attrValue = getAttr(el, 'x-html')))
    processHTML(scope, el, attrValue)

  // SECTION x-class
  if ((attrValue = getAttr(el, 'x-class')))
    processClass(scope, el, attrValue)

  // SECTION x-style
  if ((attrValue = getAttr(el, 'x-style')))
    processStyle(scope, el, attrValue)

  // SECTION All other directives
  if (el.attributes.length > 0) {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name

      // SECTION x-on
      if (name.startsWith('@') || name.startsWith('x-on')) {
        processOn(scope, el, name, attr.value)
        el.removeAttribute(name)
      }

      // SECTION x-bind
      if (name.startsWith('x-bind')) {
        processBind(scope, el, name, attr.value)
        el.removeAttribute(name)
      }

      if (name.startsWith('x-model')) {
        processModel(scope, el as ModelElement, name, attr.value)
        el.removeAttribute(name)
      }
    }
  }
}

export function createApp() {
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

          applyNonRootAttrs(scopeStack, el)

          break
        }

        // NOTE Text
        // Should transform whatever content is within {{ }}
        // case 3: {
        //   break
        // }

        //   Document fragment
        // case 11: {
        //   break;
        // }

        default: {
          // idk
          // console.log('Unknown Node', node)
        }
      }

      node = walker.nextNode()
    }

    isScopeInit.val = true
  }

  return {
    // Watch for when a property is updated
    // on: (key, (newVal, prevVal))  => {
    // }
  }
}
