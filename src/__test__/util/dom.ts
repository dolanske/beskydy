export function useClickExample(doc: Document) {
  const scope = doc.createElement('div')
  scope.setAttribute('x-scope', '{ count: 0 }')

  const btn = doc.createElement('button')
  btn.setAttribute('@click', 'count += 5')

  const text = doc.createElement('span')
  // eslint-disable-next-line no-template-curly-in-string
  text.setAttribute('x-text', '`The count is ${count}`')

  scope.append(btn, text)
  return [scope, btn, text] as const
}

export function useRefExample(doc: Document) {
  const scope = doc.createElement('div')
  scope.setAttribute('x-scope', '{}')

  const refEl = doc.createElement('span')
  refEl.setAttribute('x-ref', 'msg')
  refEl.textContent = 'Hello World'

  const text = doc.createElement('span')

  text.setAttribute('x-text', '$refs.msg.textContent')

  scope.append(refEl, text)
  return [scope, refEl, text] as const
}

export function useForExample(doc: Document) {
  const scope = doc.createElement('ul')
  scope.setAttribute('x-scope', '{ count: 5 }')

  const item = doc.createElement('li')
  item.setAttribute('x-for', 'item in count')
  item.setAttribute('x-text', 'item')

  scope.append(item)

  return [scope, item] as const
}
