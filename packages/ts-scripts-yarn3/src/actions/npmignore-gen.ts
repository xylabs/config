import { generateIgnoreFiles } from '../lib/index.ts'

const filename = '.npmignore'

export const npmignoreGen = (pkg?: string) => generateIgnoreFiles(filename, pkg)
