export const multiLineToJSONArray = (output: string) => {
  const withCommas = output.replace(/\r\n/g, '').replace(/\n/g, ',')
  const cleanCollection = withCommas.substring(0, withCommas.length - 1)
  const collection = `[${cleanCollection}]`
  return JSON.parse(collection)
}
