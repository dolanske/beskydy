# beskydy

 Like alps, but smaller. Alpine / vue-petite inspired but mostly implemented by me. This is a learning project, but feedback or issues are more than welcome. Try it out :D

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