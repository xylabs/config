import type { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'

const config: XyTsupConfig = {
  compile: {
    browser: { src: true },
    entryMode: 'all',
  },
}

// custom - for testing only

/*
const config: XyTsupConfig = {
  compile: {
    browser: { src: { entry: ['index.ts', 'bin/xy.ts'] } },
    entryMode: 'custom',
    node: { src: { entry: ['index.ts', 'bin/xy.ts'] } },
    neutral: {},
  },
  verbose: true,
}
  */

/*
const config: XyTsupConfig = {
  compile: {
    entryMode: 'custom',
    browser: { src: { entry: ['index.ts', 'bin/xy.ts'] } },
    node: { src: { entry: ['index.ts', 'bin/xy.ts'] } },
    neutral: {},
  },
  verbose: true,
}
  */

export default config
