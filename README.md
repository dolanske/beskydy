# beskydy

 Like alps, but smaller. Alpine / vue-petite but mine I guess.

 ```html
<div x-scope x-data="{ count: 0 }">
  <button
    x-data="{ increment: 2 }"
    x-on:click="count += increment"
    x-text="`Add ${increment}`"
  ></button>
  <span x-text="count"></span>
</div>
 ```

## TODO

- [ ] rewrite lol
- [ ] add deleteProperty to proxy handler
- [ ] Compute `{{ }}` denominators
- [ ] x-for
- [ ] x-cloak
  - hide element (x-show) until the whole scope is processed
- [ ] x-ref
  - Save element's reference to the global $refs helper accessible in every scope