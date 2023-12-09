import { expect, test } from "vitest";
import {prepareBareCtx} from "../test-utils"

// @vitest-environment jsdom

  const template = `
  <div x-scope="{ open: true }">
    <div x-skip x-data="{ nope: true }"> 
      <div x-data="{ nope2: true }">
        <div x-data="{ nope3: true }">
        </div>
        <div x-data="{ nope4: true }"></div>
      </div>
    </div>
  </div>`;

test("[directives] x-skip", () => {
  const { ctx } = prepareBareCtx(document, template)
  // Open was defined in root scope
  expect(ctx.data.open).toBeTruthy()
  // Skipped nodes will not have appended their datasets to the scope
  expect(ctx.data.nope).toBeUndefined()
  expect(ctx.data.nope2).toBeUndefined()
  expect(ctx.data.nope3).toBeUndefined()
  expect(ctx.data.nope4).toBeUndefined()
})