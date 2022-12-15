import path from 'path/posix'

import { runSteps } from '../lib'

export const genDocs = () => {
  const proj = (process.env.PROJECT_CWD ?? './').replace(/\\/g, '/')
  return runSteps('Generate TypeDocs', [
    [
      'yarn',
      [
        'workspaces',
        'foreach',
        '-ptA',
        'exec',
        path.join(proj, '/node_modules/typedoc/bin/typedoc'),
        '--logLevel',
        'Error',
        '--tsconfig',
        './.tsconfig.build.esm.json',
        '--excludeExternals',
        './src/index.ts',
        '--json',
        './dist/docs.json',
      ],
    ],
  ])
}
