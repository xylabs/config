export const withError = <T extends Error = Error>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ex: any,
  closure: (error: T) => number,
  predicate = (ex: T) => ex.name !== undefined && ex.message !== undefined
) => {
  return predicate(ex as T) ? closure(ex as T) : undefined
}
