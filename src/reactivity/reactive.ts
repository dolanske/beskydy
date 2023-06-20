import { activeEffect } from './shared'
import type { Effect, RawObject } from './types'

class DependencyTracker {
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
const dependencyRegistry = new WeakMap<RawObject, Map<RawObject, DependencyTracker>>()

function getOrCreateDep(target: RawObject, key: any) {
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
    dependency = new DependencyTracker()

    // Now each object stores its accessors by the key we are accesing.
    targetKeyDepStorage.set(key, dependency)
  }

  return dependency
}

function proxyValidator<T extends RawObject>() {
  return {
    get(target: T, key: PropertyKey, receiver: any) {
      if (typeof target[key] === 'object')
        return new Proxy(target[key], proxyValidator<T>())

      // When we access a key, we run the dependency handler
      const dependency = getOrCreateDep(target, key)

      // And we track the function we passed into the watcher (which currently is the activeEffect variable)
      dependency.track()

      // Return it from the original object
      return Reflect.get(target, key, receiver)
    },
    set(target: T, key: PropertyKey, value: any, receiver: any) {
      // Get the dependency
      const dependency = getOrCreateDep(target, key)
      const result = Reflect.set(target, key, value, receiver)

      // Now, on access, we run all the
      dependency.notify()
      return result
    },
  }
}

// const proxyValidator = {
//   get(target: RawObject, key: PropertyKey, receiver: any) {
//     if (typeof target[key] === 'object')
//       return new Proxy(target[key], proxyValidator)

//     // When we access a key, we run the dependency handler
//     const dependency = getOrCreateDep(target, key)

//     // And we track the function we passed into the watcher (which currently is the activeEffect variable)
//     dependency.track()

//     // Return it from the original object
//     return Reflect.get(target, key, receiver)
//   },
//   set(target: RawObject, key: PropertyKey, value: any, receiver: any) {
//     // Get the dependency
//     const dependency = getOrCreateDep(target, key)
//     const result = Reflect.set(target, key, value, receiver)

//     // Now, on access, we run all the
//     dependency.notify()
//     return result
//   },
// }

/**
 * Returns a reactive object.
 *
 * 1. If the value passed in is an object/array/map/set, it will return reactive proxy object        (reactive())
 * 2. If the value is a basic type string/number/boolean, it will return a reactive reference class  (ref())
 */
export function reactive<T extends RawObject>(obj: T) {
  return new Proxy<T>(obj, proxyValidator<T>())
}

/**
 * The way this works, we globally set activeEffect as the function we are passing in.
 *
 * This function gets run once and all the reactive accessors within get this function tracked as their dependant.
 * Now whenever those objects are accessed, this function will be run.
 */

export function watchEffect(effect: Effect) {
  // @ts-expect-error Assigning to global variable
  activeEffect = effect
  effect()

  // @ts-expect-error Assigning to global variable
  activeEffect = null
}

const test = reactive({
  hello: 10,
})

test.hello
