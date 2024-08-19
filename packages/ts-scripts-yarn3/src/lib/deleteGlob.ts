import fs from 'node:fs'

import { glob } from 'glob'

export const deleteGlob = (globPath: string) => {
  // Find all files matching the glob pattern
  const files = glob.sync(globPath)

  // Remove each file or directory
  for (const file of files) {
    fs.rmSync(file, {
      recursive: true, force: true,
    })
  }
}
