import { EntryMode } from './CompileParams'
import { getAllInputs2 } from './inputs'

export const buildEntries = (folder: string, entryMode?: EntryMode) => {
  switch (entryMode) {
    case 'platform':
      console.log('buildEntries [platform]')
      return [`${folder}/index-node.ts`, `${folder}/index-browser.ts`]
    case 'all':
      console.log('buildEntries [all]')
      return getAllInputs2(folder).filter((entry) => !entry.includes('.spec.') && !entry.includes('.story.'))
    case 'single':
    default:
      console.log('buildEntries [single]')
      return [`${folder}/index.ts`]
  }
}
