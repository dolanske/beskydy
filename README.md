# beskydy

 Like alps, but smaller. Alpine / vue-petite inspired but mostly implemented by me. Define small interactive partitions within your HTML without needing to write javascript.

## The Concept

Create a reactive partition by adding `x-scope` directive on an element. This will create a reactive scope for said element and expose all of its properties to its descendants.

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

The only real JS we need to write is the app initialization. This can be done by simply create `new Beskydy()` class and calling the `collect` function.
Optionally, we can provide global reactive properties into the constructor, which will be shared and available across all scopes.

```ts
import { Beskydy } from 'beskydy'

const app = new Beskydy({
  characters: [],
  isLoading: false,
  async fetchCharacters() {
    this.isLoading = true
    this.characters = await fetch('https://swapi.dev/api/people/')
    this.isLoading = false
  }
})

// Calling this method will start the app initialization.
// All declared scopes will be collected and activated.
app.collect()

// If needed, you can destroy Beskydy instance.
// This will remove event listeners, all reactive bindings
// and turn the DOM back into being static
app.teardown()
```

Beskydy offers a flexible and very extensible API. You can creative as many new directives as you please or extend model & event modifiers. Below are a few examples.

```ts
import { Beskydy } from 'beskydy'

const app = new Beskydy()

// Change the delimiters, which Beskydy uses to collect text content expressions
// Default: {{ & }}
app.setDelimiters('[', ']')

// Run code once all the scopes have been initialized
app.onInit(() => {})

// Run code when the app instance is closed
app.onTeardown(() => {})

// Add custom directives
// This directive will append HAHAHA before the provided text property
app.defineDirective('x-funny', (ctx, node, attr) => {
  // Usage
  // <div x-data="{ text: 'hello' }">
  // -> <span x-funny="text"></span>

  // Whenever a reactive property is updated (text), this function is ran
  ctx.effect(() => {
    // Eval returns a value from a string we provide
    // In our example, attr.value is a "text",
    // which means we're referencing a value defined in the data object
    const value = ctx.eval(attr.value)

    // Here's the funny, we add HAHAHA before the text value
    // Result is <span>HAHAHA hello</span>
    node.textContent = `HAHAHA ${String(value)}`

    // If the text property is changed to 'world' (or anything else)
    // This element will automatically update
    // <span>HAHAHA world</span>
  })
})

// Add custom event modifier. Read more about modifiers in the `x-on` section below
app.defineEventModifier('save', (event, customState, param) => {
  localStorage.setItem(param, String(event.data))
})

// Add custom `x-model` modifier. Also supports modifiers with parameters
app.defineModelModifier('toLowerCase', (newValue, oldValue, param) => {
  return String(value).toLowerCase()
})
```

## Expressions

Each expression is a piece of code that gets evaluated. Because it's all in a string, you don't have autocomplete available. Expessions expose a few additional properties, which you can use to your advantage.

- `$el`: Expose the current element we're writing expression for
- `$event`: Expose the event, if used within event listeners
- `$refs`: Expose the scope's element refs

Inline expressions can be added to a text content of any element. You need to wrap these with delimiters `{{ test }}`, and they do not expose anything, but it's the best way to add reactive pieces into text.

## Directives

There are 18 directives in total. Each simplifying the way we can interact or update the DOM.

[x-scope](#x-scope) • [x-data](#x-data) • [x-if](#x-if-x-else-if-x-else) • [x-switch](#x-switch) • [x-show](#x-show) • [x-for](#x-for) • [x-portal](#x-portal) • [x-spy](#x-spy) • [x-ref](#x-ref) • [x-on](#x-on) • [x-model](#x-model) • [x-bind](#x-bind) • [x-class](#x-class) • [x-style](#x-style) • [x-text](#x-text) • [x-html](#x-html) • [x-init](#x-init) • [x-processed](#x-processed)

### `x-scope`

Initializes a reactive scope. Every directive only works if it exists within a scope.

```html
<div x-scope="{ initialData: 0, count: 10 }">
  ...
</div>

```

### `x-data`

Append data into scope's dataset. Any data within this directive will be available to its parent elements, but this practise is discouraged, as on first draw, this data will be undefined.

```html
<div x-scope="{ initialData: 0, count: 10 }">
  <div x-data="{ someMoreData: 'hello' }">
    ...
  </div>
</div>
```

### `x-if`, `x-else-if`, `x-else`

Conditionally render elements based on the expression results.

```html
<div x-scope="{ count: 0 }">
  <span x-if="count < 3">Less than 3</span>
  <span x-else-if="count >= 3 && count <= 6">Between and including 3 and 6</span>
  <span x-else>More than 6</span>
</div>
```

### `x-switch`

Cleaner way to write many of conditional statements for a single reactive value.

```html
<div x-scope="{ htmlNodeType: 1 }">
  <div x-switch="htmlNodeType">
    <span x-case="1">Element Node</span>
    <span x-case="2">Attribute Node</span>
    <span x-case="3">Text node</span>
    <span x-case="11">Document Fragment</span>
    <span x-default>Other nodes</span>
  </div>
</div>

```

### `x-show`

Show or hide the element based on the expression result. It adds `display:none` when hiding and reverts back to the original setting of the `display` property.

```html
<div x-scope="{ visible: false }">
  <p x-show="visible">I am still in the DOM but just hidden</p>
</div>
```

### `x-for`

Render list of elements based on the provided array, object or range.

#### Range

```html
<ul x-scope="{ items: 10 }">
  <li x-for="item in people">{{item + 1}}</li>
</ul>
```

#### Array

Iterator exposes the property and the index.

```html
<ul x-scope="{ people: ['Jan', 'Andrew', 'Jokum', 'Anton'] }">
  <li x-for="(name, personIndex) in people">{{ personIndex + 1 }} {{ name }}</li>
</ul>
```

#### Object

Iterator exposes the property, property key and the index.

```html
<table x-scope="{ people: { name: 'Jan', age: 52 } }">
  <tr x-for="(value, key) in people">
    <th>{{ key }}</th>
    <td>{{ value }}</td>
  </tr>
</table>
```

### `x-portal`

Allows you to move piece of a scope anywhere in the DOM, while retaining its reactive context.

```html
<!-- Original scope -->
<div x-scope="{ text: 'Hello World' }">
  <input type="text" x-model="text">
  <div class="wrapper blue">
    <div>
      <span x-portal="#target" x-data="{ append: ' hehe' }">{{ text + append }}</span>
    </div>
  </div>
</div>

<!-- Anywhere else in the DOM -->
<div class="wrapper red" id="target" />
```

The `<span>` will act like it's always been part of the `#target` element, but it'll have access to all the properties defined within the original scope.

### `x-spy`

Allows you to execute a provided callback whenever the reactive scope is updated.

```html
<div x-scope="{ first: 1 }">
  <button @click="first++" x-spy="console.log('Updated!', first)">Increment</button>
</div>
```

If you want to spy on a specific property, you can add its key as a parameter to `x-spy`. Just note, this way you can only watch for changes in the top-level properties in your scope.

```html
<div x-scope="{ first: 1, second: 10 }">
  <button @click="first++">Increment First</button>
  <button @click="second++">Increment Second</button>

  <!-- The spy callback only runs if the `second` property is updated -->
  <div x-spy:second="console.log('Updated second', second)"></div>
</div>
```

### `x-ref`

Saves the element to the `$refs` object which is available in the scope. Any changes made to the ref element will trigger reactive updates.

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

```html
<div x-on:eventName.modifier.modifier="expression" />
<div @eventName.modifier.modifier="expression" />
```

```html
<div x-scope="{ open: false }">
  <button x-on:click="open = !open">Toggle</button>
  <p x-if="open">I am visible</p>
</div>
```

#### Modifiers

- **once**: Runs only once
- **self**: Runs the expression only if `event.target` equals to `event.currentTarget`
- **left**, **middle**, **right**: Filter mouse clicks
- **prevent**: Runs `event.preventDefault()`
- **stop**: Runs `event.stopPropagation()`
- **stopImmediate**: Runs `event.stopImmediatePropagation()`

#### Modifiers with parameters

You can provide a single parameter to the modifier using this syntax. You can also pass in a property defined in the `x-scope` or `x-data` directives. Note: it does not accept expressions, only variables/primitive values.

```html
<button x-on:click.only[5]="doNothingAfterFiveClicks()" />

<div x-scope="{ limit: 5 }">
  <button x-on:click.only[limit]="doNothingAfterFiveClicks()" />
</div>
```

- **only** (default=1): Run until the provided amount is reached
- **if**: Runs if the provided value is truthy
- **throttle**: (default=300) Limits the amount of calls within the specified timeframe in milliseconds

### `x-model`

Provides two way data binding to a input/textarea/select/details. It listens to an input event as well as binding the reactive data to the element's value/state.

```html
<div x-scope="{ text: 'Hello' }">
  <!-- The input will start by having "Hello" written within. Any change to the input from said element will update the reactive `text` property -->
  <input x-model="text" />
</div>
```

The following example works exactly the same as the one above.

```html
<input x-on:input="text = $el.target.value" x-bind:value="text" />
```

### `x-bind`

Binds an attribute or an attribute object to an element.

```html
<div x-scope="{ isDisabled: false }">
  <div x-bind:disabled="isDisabled" />
  <div :disabled="isDisabled" />
  <div x-bind="{
    disabled: isDisabled,
    class: isDisabled ? 'is-disabled' : 'is-enabled'
  }" />
</div>
```

### `x-class`

Binds a class or class list to an element.

```html
<div x-scope="{ visible: true, isActive: false }">
  <!-- Inline -->
  <p x-class="visible ? 'is-visible' : null"></p>
  <!-- Object syntax -->
  <p x-class="{ 'is-visible': visible }"></p>
  <!-- Array syntax (combines both previous ones) -->
  <p x-class="[{ 'is-visible': visible }, isActive ? 'active' : null]"></p>
</div>

```

### `x-style`

Binds reactive style object to an element. The properties can be written both in camel case and kebab case.

```html
<div x-scope="{ offset: 10 }">
  <div class="ellipse" :style="{ top: offset + '%' }">
</div>
```

### `x-text`

Update the element's `textContent`

```html
<div x-scope="{ count: 5 }">
  <span x-text="`The count is ${count}`"></span>
</div>
```

Note, you can get the same result when writing expressions within the delimiters anywhere in the scope. Both of these examples have the exact same result.

```html
<div x-scope="{ count: 5 }">
  <span>The count is {{ count }}</span>
</div>
```

**Note**
When using `x-text`, the entire element's `textContent` as well as any of its child elements will be overwritten by the provided expression.

### `x-html`

Same as with `x-text`, but sets the `element.innerHTML` instead.

```html
<div x-scope="{ data: '<span>some fetched html</span>' }">
  <div class='conten-wrapper' x-html="data"></div>
</div>
```

### `x-init`

Runs the provided expression when the element's data attributes have been initialized, but not the rest of the directives.
If you want to run some code when the entire app instance has been initialized, use the `app.onInit` hook instead.

```html
<div class="{ scopeLoaded: false }" x-init="scopeLoaded = true">
  Loaded { scopeLoaded }
</div>
```

### `x-processed`

Runs the provided expression when all of the element's directives have been processed

```html
<div class="{ scopeProcessed: false }" x-init="scopeProcessed = true">
  Loaded { scopeProcessed }
</div>
```
