import { glob } from 'glob'

export const getAllInputs = (folder: string) => {
  /* tsup wants posix paths */
  return glob.sync(`${folder}/**/*.*`, { ignore: ['**/*.spec.*', '**/*.stories.*', '**/spec/**/*'], posix: true })
}
