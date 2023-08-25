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

Saves the element to the `$refs` object which is available in the scope. Any changes made to the ref element are made reactive.

```html
<div x-scope="{ text: 'Hello' }">
  <input x-model="text" />
    <!-- When we change the input, the ref element's textContent is updated -->
    <span x-ref="item">{{ text }}</span>
    <!-- $refs object is updated whenever the element is modified -->
    <span>{{ $refs.item.textContent }}</span>
  </div> 
</div>

```

### `x-on`

Binds an event listener with optional modifiers.

The syntax id `x-on:eventName.modifier.modifier="expression"

```html
<div x-scope="{ open: false }">
  <button x-on:click="open = !open">Toggle</button>
  <p x-if="open">I am visible</p>
</div>
```

#### Available modifiers

- **once**: Runs the expression only once
- **self**: Runs the expression only if `event.target` equals to `event.currentTarget`
- **left**, **middle**, **right**: Filter mouse clicks
- **prevent**: Runs `event.preventDefault()` before executing the expression
- **stop**: Runs `event.stopPropagation()` before executing the expression

#### Future plans

At some point, I'd like to add an option to provide parameters to the modifiers. For instance it would be quite useful, if we could debounce event listeners, or limit the number of times an expression is called:

```html
<div x-on:click.only[10]="doSomething()" />
<!-- Debounce to 50ms and use the trailing expression call (default is leading) -->
<div x-on:mouseover.debounce[50, false]="doSomething()" />
```

### `x-model`

Provides two way data binding to a input/textarea/select/details. It listens to an input event as well as binding the reactive data to the element's value/state.

```html
<div x-scope="{ text: 'Hello' }">
  <!-- The input will start by having "Hello" written within. Any change to the input from said element will update the reactive `text` property -->
  <input x-model="text" />
</div>
```

The following example works exactly the same as the one above
```html
<input x-on:input="text = $el.target.value" x-bind:value="text" />
```

### `x-bind`

### `x-class`

### `x-style`

### `x-if`

### `x-show`

### `x-for`

### `x-text`

### `x-html`
