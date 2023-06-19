type Effect = () => void

let activeEffect: Effect | null

class DepndencyImpl {
  effects = new Set<Effect>()

  track() {
    if (activeEffect)
      this.effects.add(activeEffect)
  }

  notify() {
    for (const effect of this.effects)
      effect()
  }
}

// Track references to the original objects. When those get garbage collected,
// all their reactive references get removed as they are no longer needed
const dependencyRegistry = new WeakMap<{}, Map<{}, DepndencyImpl>>()

function getOrCreateDep(target: {}, key: any) {
  // Check wether a dependencies for the accessed object (target) already exist
  let targetKeyDepStorage = dependencyRegistry.get(target)

  if (!targetKeyDepStorage) {
    // On first access, we create an empty map of dependency key accessors
    targetKeyDepStorage = new Map()
    dependencyRegistry.set(target, targetKeyDepStorage)
  }

  // Check if the current target access key dependency storage exists
  let dependency = targetKeyDepStorage.get(key)

  if (!dependency) {
    // If not, we create it and save it
    dependency = new DepndencyImpl()

    // Now each object stores its accessors by the key we are accesing.
    targetKeyDepStorage.set(key, dependency)
  }

  return dependency
}

const proxyValidator = {
  get(target: {}, key: PropertyKey, receiver: any) {
    if (typeof target[key] === 'object')
      return new Proxy(target[key], proxyValidator)

    // When we access a key, we run the dependency handler
    const dependency = getOrCreateDep(target, key)

    // And we track the function we passed into the watcher (which currently is the activeEffect variable)
    dependency.track()

    // Return it from the original object
    return Reflect.get(target, key, receiver)
  },
  set(target: {}, key: PropertyKey, value: any, receiver: any) {
    // Get the dependency
    const dependency = getOrCreateDep(target, key)
    const result = Reflect.set(target, key, value, receiver)

    // Now, on access, we run all the
    dependency.notify()
    return result
  },
}

// Implements on top of dependency tracking
// This class also holds its value and does not return a Proxy
class ReferenceDependencyImpl<T> extends DepndencyImpl {
  #value: T
  constructor(value: T) {
    super()
    this.#value = value
  }

  get val() {
    this.track()
    return this.#value
  }

  set val(newValue) {
    this.#value = newValue
    this.notify()
  }
}

/**
 * Returns a reactive object.
 *
 * 1. If the value passed in is an object/array/map/set, it will return reactive proxy object        (reactive())
 * 2. If the value is a basic type string/number/boolean, it will return a reactive reference class  (ref())
 */
export function refObj<T extends object>(obj: T) {
  // if (!obj || ['boolean', 'number', 'string', 'bigint', 'undefined'].includes(typeof obj))
  // return new ReferenceDependencyImpl(obj)

  return new Proxy<T>(obj, proxyValidator)
}

/**
 * The way this works, we globally set activeEffect as the function we are passing in.
 *
 * This function gets run once and all the reactive accessors within get this function tracked as their dependant.
 * Now whenever those objects are accessed, this function will be run.
 */
export function watchEffect(effect: Effect) {
  activeEffect = effect
  effect()
  activeEffect = null
}

// type WatcherFn = <T>

// export function watch<T>(source: ReferenceDependencyImpl<T>, fn: (prev: T, next: T) => void) {
//   activeEffect = fn
//   source.track()
//   activeEffect = undefined
// }

// ---- test ----
// const form = refObj({
//   shallow: 0,
//   inner: {
//     deep: 0,
//   },
// })

// watchEffect(() => {
//   console.log(form.inner.deep)
// })

// form.inner.deep++

const ref = new ReferenceDependencyImpl(10)
ref.val = 25
console.log(ref.val)
