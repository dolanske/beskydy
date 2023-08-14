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

export function useExampleWithRef(doc: Document) {
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
