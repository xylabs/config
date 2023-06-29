export const union = (a: string[], b: string[]): Set<string> => new Set([...new Set(a), ...new Set(b)])
