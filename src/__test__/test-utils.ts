import { Beskydy } from ".."
import { Context } from "../context"
import { walk } from "../walker"

export function prepareBareCtx(document: Document, template: string) {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = template
  const root = wrapper.children[0]
  const app = new Beskydy()
  const ctx = new Context(root, app)
  walk(ctx)
  ctx.init = true
  return { ctx, root, app }
}