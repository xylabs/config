export const multiLineToJSONArray = (output: string) => {
  const withCommas = output.replaceAll('\r\n', '').replaceAll('\n', ',')
  const cleanCollection = withCommas.slice(0, Math.max(0, withCommas.length - 1))
  const collection = `[${cleanCollection}]`
  return JSON.parse(collection)
}
