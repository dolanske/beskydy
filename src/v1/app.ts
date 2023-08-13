import { getAttr } from './util/domUtils'
import { stack } from './reactivity/stack'
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
import { processText } from './directives/x-text'

export interface Scope {
  [key: PropertyKey]: unknown
  // $refs: Record<string, HTMLElement>
}

export function applyNonRootAttrs(scope: Scope, el: HTMLElement) {
  let attrValue: string | null

  if ((attrValue = getAttr(el, 'x-for')))
    prociessFor(scope, el, attrValue)

  // SECTION x-ref
  // if ((attrValue = getAttr(el, 'x-ref')))
  //   processRef(scope, el, attrValue)

  // SECTION x-text
  // Save expression value because when the stack has changed, the value might be null already
  if ((attrValue = getAttr(el, 'x-text')))
    processText(scope, el, attrValue)

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
        // TODO:
        // Pass in any element and do error handling within processModel
        processModel(scope, el as ModelElement, name, attr.value)
        el.removeAttribute(name)
      }
    }
  }
}

export function walkRoot(root: Element, scope: Scope, isRootScope: boolean) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL)
  let node: Node | null = walker.root

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

        applyNonRootAttrs(scope, el)
        break
      }

      // NOTE Text, transforms {{}}
      // case 3: {}

      // NOTE Document fragment idk llol
      // case 11: {}

      default: break
    }

    node = walker.nextNode()
  }
}

export function createApp() {
  // Global properties

  // Get all scopes in the document and initialize them
  const scopeEls = Array.from(document.querySelectorAll('[x-scope]'))

  for (const scopeEl of scopeEls) {
    // const walker = document.createTreeWalker(scopeEl, NodeFilter.SHOW_ALL)
    // let node: Node | null = walker.root
    const scopeStack = stack<Scope>({})
    const isScopeInit = nit(false)

    // Hide scopes until they're fully initiated
    isScopeInit.watch((isInit) => {
      if (isInit)
        scopeEl.removeAttribute('style')
      else
        scopeEl.setAttribute('style', 'display:none;')
    })

    walkRoot(scopeEl, scopeStack, true)

    isScopeInit.val = true
  }

  // return {
  // some global properties/functions here
  // }
}
