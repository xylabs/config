import { glob } from 'glob'

export const getAllInputs = (folder: string) => {
  /* tsup wants posix paths */
  return glob.sync(`${folder}/**/*.*`, { posix: true }).map((file) => {
    return file.slice(Math.max(0, folder.length + 1)) // Remove the folder prefix
  })
}
