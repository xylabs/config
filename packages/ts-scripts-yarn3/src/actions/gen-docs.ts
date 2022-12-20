import { runSteps } from '../lib'

export const genDocs = () => {
  return runSteps('Generate TypeDocs', [
    [
      'yarn',
      [
        'workspaces',
        'foreach',
        '-ptA',
        'yarn',
        'typedoc',
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
