import { glob } from 'glob'

export const getAllInputs = (folder: string) => {
  /* tsup wants posix paths */
  return glob.sync(`${folder}/**/*.*`, { posix: true })
}
