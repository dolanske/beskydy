# beskydy

 Like alps, but smaller. Alpine / vue-petite inspired but mostly implemented by me. Define small interactive partitions within your HTML without needing to write javascript.

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
import { Beskydy } from 'beskydy'

// You can also define global properties, which will be available in every scope
const app = Beskydy({
  characters: [],
  isLoading: false,
  async fetchCharacters() {
    this.isLoading = true
    this.characters = await fetch('https://swapi.dev/api/people/')
    this.isLoading = false
  }
})

// Add custom directives
app.defineDirective('x-funny', (ctx, node, attr) => {
  node.textContent = 'That\'s really funny'
})

// Add custom event modifier
// Can be used as x-on:input.save[key]
// **NOTE**: If the provided parameter matches a variable
// name defined in the current or global scope it will use its current value.
// This way you can create dynamic modifier parameters
app.defineEventModifier('save', (event, customState, param) => {
  localStorage.setItem(param, String(event.data))
})

// Add custom `x-model` modifier
// Same as with event modifiers, modifier parameters are also supported
app.defineModelModifier('toLowerCase', (newValue, oldValue, param) => {
  return String(value).toLowerCase()
})

// Begin collection of individual scopes and start the app
app.start()
```

## Expressions

Each expression is a piece of code that gets evaluated. Because it's all in a string, you don't have autocomplete available. Expessions expose a few additional properties, which you can use to your advantage.

- `$el`: Expose the current element we're writing expression for
- `$event`: Expose the event, if used within event listeners
- `$refs`: Expose the scope's element refs

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

### `x-if`, `x-else-if`, `x-else`

Conditionally render elements based on the expression results

```html
<div x-scope="{ count: 0 }">
  <span x-if="count < 3">Less than 3</span>
  <span x-else-if="count >= 3 && count <= 6">Between and including 3 and 6</span>
  <span x-else>More than 6</span>
</div>
```

### `x-switch`

Cleaner way to write many of conditional statements for a single reactive value

```html
<div x-scope="{ htmlNodeType: 1 }">
  <div x-switch="htmlNodeType">
    <span x-case="1">Element Node</span>
    <span x-case="2">Attribute Node</span>
    <span x-casA="3">Text node</span>
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

#### Objecty

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

You can provide a single parameter to the modifier using this syntax. You can also pass in a defined in the `x-scope` and `x-data`. Note: it does not accept expressions, only variables/primitive values.

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

The following example works exactly the same as the one above

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

Note, you can get the same result when writing expressions within the `{{ }}` delimiters anywhere in the scope. Both of these examples have the exact same result.

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
