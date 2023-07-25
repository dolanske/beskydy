import { getAttr } from './attr'
import { execute } from './evaluate'
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
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_ALL)
    const scopeStack = stack({})
    // const effects = []

    let node: Node | null = walker.root

    while (node !== null) {
      switch (node.nodeType) {
        // NOTE HTMLElement
        case 1: {
          const el = node as HTMLElement
          let attrValue: string | null

          // SECTION x-data
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

          // SECTION x-text
          if ((attrValue = getAttr(el, 'x-text'))) {
            watchStack(() => {
              const text = execute(scopeStack, `return ${attrValue}`)
              el.innerText = text
            })
          }

          // SECTION event listeners `@`
          if (el.attributes.length > 0) {
            for (const attr of Array.from(el.attributes)) {
              const name = attr.name
              if (name.startsWith('@')) {
                const eventKey = name.substring(1)
                const eventFn = attr.value
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
