import { getAllInputs2 } from './inputs.ts'
import { EntryMode } from './XyConfig.ts'

export const buildEntries = (folder: string, entryMode?: EntryMode, verbose = false) => {
  switch (entryMode) {
    case 'platform': {
      if (verbose) console.log('buildEntries [platform]')
      return [`${folder}/index-node.ts`, `${folder}/index-browser.ts`]
    }
    case 'all': {
      if (verbose) console.log('buildEntries [all]')
      return getAllInputs2(folder).filter((entry) => !entry.includes('.spec.') && !entry.includes('.story.'))
    }
    default: {
      if (verbose) console.log('buildEntries [single]')
      return [`${folder}/index.ts`]
    }
  }
}
