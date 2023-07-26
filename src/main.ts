import { getAttr } from './util/domUtils'
import { evaluate, execute } from './evaluate'
import { stack, watchStack } from './reactivity/stack'

function main() {
  // const $el = document.createElement('div')
  // const $scope = { message: 'first' }
  // const exp = `
  //   $data.message = 'second'
  //   $el.textContent = $data.message
  //   return {
  //     $template: '<span>B</span>'
  //   }
  // `

  // const res = execute($scope, exp, $el)
  // console.log($el.textContent)
  // console.log(res)

  const scopes = Array.from(document.querySelectorAll('[x-scope]'))

  for (const scope of scopes) {
    // TODO
    // Move into a specific function createScope()

    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_ALL)
    const scopeStack = stack({})
    let node: Node | null = walker.root

    while (node !== null) {
      switch (node.nodeType) {
        // NOTE HTMLElement
        case 1: {
          const el = node as HTMLElement
          let attrValue: string | null

          // SECTION ----
          // x-data
          if ((attrValue = getAttr(el, 'x-data'))) {
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

          // SECTON ----
          // x-if, x-else and x-else-if
          if ((attrValue = getAttr(el, 'x-if'))) {
            // Can be used anytime
          }

          if ((attrValue = getAttr(el, 'x-else-if'))) {
            // Only allowed if the previous sibling is x-if or x-else-if
          }

          if ((attrValue = getAttr(el, 'x-else'))) {
            // Only allowed if the previous sibling contains and x-if or x-else-if
          }

          // SECTION ----
          // event listeners starting with `@`
          if (el.attributes.length > 0) {
            for (const attr of Array.from(el.attributes)) {
              const name = attr.name
              if (name.startsWith('@')) {
                const eventKey = name.substring(1)
                let eventFn = attr.value

                if (eventFn.startsWith('()'))
                  eventFn = `(${eventFn})()`

                el.addEventListener(eventKey, event => execute(scopeStack, eventFn, el, event))
              }
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
          console.log('Unknown Node', node)
        }
      }

      node = walker.nextNode()
    }

    // watchStack(() => {
    //   console.log(scopeStack)
    // })
  }
}

main()
