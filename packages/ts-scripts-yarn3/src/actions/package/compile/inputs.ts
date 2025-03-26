import { glob } from 'glob'

export const getAllInputs = (folder: string, ignore = ['**/*.spec.*', '**/*.stories.*', '**/spec/**/*']) => {
  /* tsup wants posix paths */
  return glob.sync(`${folder}/**/*.*`, { ignore, posix: true })
}
