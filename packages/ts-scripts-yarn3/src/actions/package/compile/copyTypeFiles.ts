import { copyFile, readdir } from 'fs/promises'

const getDistTypeFiles = async () => {
  return (await readdir('dist', { recursive: true })).filter((file) => file.endsWith('d.ts')).map((file) => `dist/${file}`)
}

const getDistTypeMapFiles = async () => {
  return (await readdir('dist', { recursive: true })).filter((file) => file.endsWith('d.ts.map')).map((file) => `dist/${file}`)
}

export const copyTypeFiles = async () => {
  //hybrid packages want two copies of the types
  const distTypeFiles = await getDistTypeFiles()
  await Promise.all(
    distTypeFiles.map(async (file) => {
      await copyFile(file, file.replace('d.ts', 'd.mts'))
    }),
  )

  const distTypeMapFiles = await getDistTypeMapFiles()
  await Promise.all(
    distTypeMapFiles.map(async (file) => {
      await copyFile(file, file.replace('d.ts.map', 'd.mts.map'))
    }),
  )
}
