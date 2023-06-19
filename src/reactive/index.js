/**
 * ---------------- REACTIVITY API ----------------
 */

// Global activeEffect
let activeEffect

// Basic reactive property, equivalent of a barebones version of ref()
class Dep {
  constructor(value) {
    this.subscribers = new Set()
    this._value = value
  }

  get value() {
    this.depend()
    return this._value
  }

  set value(newValue) {
    this._value = newValue
    this.notify()
  }

  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect)
    }
  }

  notify() {
    this.subscribers.forEach((effect) => {
      effect()
    })
  }
}

// const dep = new Dep('lol')

// This API doesn't count for conditional cases, meaning the effect function will be run even if one
// of its nested dependencies is called. You can still get the desired functionality, but in optimal world,
// the function wouldn't be re-run if the updated dependency is behind a condition that is not met

// watchEffect(() => {
//   console.log(dep.value)
// })

// dep.value = "changed"

// reactive() API implementation
// We can reuse some of the Dep class functionality
class DepMini {
  subscribers = new Set()

  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect)
    }
  }

  notify() {
    this.subscribers.forEach((effect) => {
      effect()
    })
  }
}

// Global storage for dependencies
const targetMap = new WeakMap()

function getDep(target, key) {
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)

  if (!dep) {
    dep = new DepMini()
    depsMap.set(key, dep)
  }

  return dep
}

const reactiveHandlers = {
  get(target, key, receiver) {
    const dep = getDep(target, key)

    dep.depend()

    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    const dep = getDep(target, key)
    const result = Reflect.set(target, key, value, receiver)

    dep.notify()

    return result
  },
}

/**
 * ---------------- Exports --------------------
 */

export function reactive(raw) {
  return new Proxy(raw, reactiveHandlers)
}

export function ref(raw) {
  return new Dep(raw)
}

// Inside the watch effect function we do all our reactive logic
export function watchEffect(effect) {
  activeEffect = effect
  effect()
  activeEffect = null
}
