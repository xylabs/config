// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<any, any>

function deepMerge<T extends AnyObject>(target: AnyObject, source: AnyObject): T {
  if (!source || typeof source !== 'object') return target

  for (const key of Object.keys(source)) {
    if (
      typeof source[key] === 'object'
      && source[key] !== null
      && !Array.isArray(source[key])
    ) {
      // Recursively merge nested objects
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {} as T[typeof key]
      }
      deepMerge(target[key], source[key])
    } else {
      // Overwrite with non-object values
      target[key] = source[key]
    }
  }

  return target
}

export function deepMergeObjects<T extends AnyObject>(objects: T[]): T {
  const result = {} as T
  for (const obj of objects) {
    deepMerge(result, obj)
  }
  return result
}
