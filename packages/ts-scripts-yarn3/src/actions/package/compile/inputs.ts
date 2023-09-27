import { readdir } from 'fs/promises'
import { glob } from 'glob'

export const getInputs = async (subDir?: string) => {
  return (await readdir(subDir ? `src/${subDir}` : 'src', { recursive: false }))
    .filter(
      (file) => (file.endsWith('.ts') || file.endsWith('.tsx')) && !file.endsWith('d.ts') && !file.includes('.spec.') && !file.includes('.stories.'),
    )
    .map((file) => (subDir ? `${subDir}/${file}` : file))
}

export const getInputDirs = async (depth: number = 0) => {
  if (depth === 0) {
    return []
  }
  return [
    '.',
    ...(await readdir('src', { recursive: true, withFileTypes: true }))
      .filter((file) => file.isDirectory())
      .map((file) => {
        const pathParts = file.path?.split('/') ?? []
        pathParts.shift()
        if (pathParts.length) {
          const root = pathParts.join('/')
          return `${root}/${file.name}`
        } else {
          return file.name
        }
      }),
  ]
}

export const getAllInputs = async (depth = 100) => {
  const dirs = await getInputDirs(depth)
  return (await Promise.all(dirs.map(async (dir) => await getInputs(dir)))).flat()
}

export const getAllInputs2 = (folder: string) => {
  return glob.sync(`${folder}/**/*.*`, { ignore: ['**/*.spec.*', '**/*.stories.*', '**/spec/**/*'] })
}
