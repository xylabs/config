export const empty = (value?: string | undefined): boolean => value?.trim().length === 0
export const notEmpty = (value?: string | undefined): boolean => !empty(value)
