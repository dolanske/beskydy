# beskydy

 Like alps, but smaller. Alpine / vue-petite inspired but mostly implemented by me. Define small interactive partitions within your HTML without needing to write javascript.

 ---

## Usage

Create a reactive partition by adding `x-scope` attribute on an element. This will create a reactive scope for said element and all its descendants.

 ```html
<div x-scope="{ count: 0 }">
  <button
    x-data="{ incrBy: 2 }"
    x-on:click="count += incrBy"
    x-text="`Add ${incrBy}`"
  ></button>
  <span>Count is: {{ count }}</span>
</div>
 ```

Include a script in the footer in which we can initialize all the scopes.
 ```ts
import { createApp } from 'beskydy'

createApp({ /* globalProperties */ })
 ```

---

## Attributes

### `x-scope`

Initializes a reactive scope.

```html
<div x-scope="{ initialData: 0, count: 10 }">
  ...
</div>

```

---

### `x-data`

Append data into scope's dataset. Any data within this attribute will be available to its parent elements, but this practise is discouraged, as on first draw, this data will be undefined.

```html
<div x-scope="{ initialData: 0, count: 10 }">
  <div x-data="{ someMoreData: 'hello' }">
    ...
  </div>
</div>

```

### `x-ref`

Saves the element to the `$refs` object which is available in the scope.

```html
<div x-scope="{ initialData: 0, count: 10 }">
  <span x-ref="example">Hello World</span>
  <span>{{ $refs.example.textContent }}</span>
</div>

```

#### `x-on`

#### `x-model`

#### `x-bind`

#### `x-class`

#### `x-style`

#### `x-if`

#### `x-show`

#### `x-for`

#### `x-text`

#### `x-html`
