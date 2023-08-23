# beskydy

 Like alps, but smaller. Alpine / vue-petite but mine I guess.

 ```html
<div x-scope="{ count: 0 }">
  <button
    x-data="{ increment: 2 }"
    x-on:click="count += increment"
    x-text="`Add ${increment}`"
  ></button>
  <span x-text="count"></span>
</div>
 ```

## TODO

- [ ] x-for
- [ ] x-cloak
  - hide element (x-show) until the whole scope is processed