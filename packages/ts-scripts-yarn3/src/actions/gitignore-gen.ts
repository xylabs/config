import { generateIgnoreFiles } from '../lib'

const filename = '.gitignore'

export const gitignoreGen = (pkg?: string) => generateIgnoreFiles(filename, pkg)
