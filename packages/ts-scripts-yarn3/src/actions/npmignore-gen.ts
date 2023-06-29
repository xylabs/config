import { generateIgnoreFiles } from '../lib'

const filename = '.npmignore'

export const npmignoreGen = (pkg?: string) => generateIgnoreFiles(filename, pkg)
