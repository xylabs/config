import { generateIgnoreFiles } from '../lib/index.ts'

const filename = '.gitignore'

export const gitignoreGen = (pkg?: string) => generateIgnoreFiles(filename, pkg)
