export type Effect = () => void
export type WatcherEffect<T> = (newVal: T, oldVal: T | undefined) => void
export type RawObject = Record<PropertyKey, never>
