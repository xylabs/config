import type { Options } from 'tsup'

import { getAllInputs } from './inputs.ts'
import type { EntryMode } from './XyConfig.ts'

export const buildEntries = (srcDir: string, entryMode: EntryMode = 'single', options?: Options | boolean, excludeSpecAndStories = true, verbose = false) => {
  let entries: string[] = []
  switch (entryMode) {
    case 'platform': {
      entries = ['index-node.ts', 'index-browser.ts']
      break
    }
    case 'all': {
      entries = (excludeSpecAndStories
        ? getAllInputs(srcDir).filter(entry => !entry.includes('.spec.') && !entry.includes('.stories.'))
        : getAllInputs(srcDir)).filter(entry => !entry.endsWith('.d.ts'))
      break
    }
    case 'custom': {
      entries = []
      break
    }
    default: {
      entries = ['index.ts']
      break
    }
  }

  if (typeof options !== 'boolean' && Array.isArray(options?.entry)) {
    entries.push(...options.entry)
  }

  if (verbose) console.log(`buildEntries [${entryMode}] ${entries.length}`)
  return entries
}
