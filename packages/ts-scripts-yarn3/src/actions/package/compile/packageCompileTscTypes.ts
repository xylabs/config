/* eslint-disable max-statements */
import { readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'

import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'
import chalk from 'chalk'
import { rimrafSync } from 'rimraf'
import type { TsConfigCompilerOptions } from 'tsc-prog'
import { createProgramFromConfig } from 'tsc-prog'
import type { CompilerOptions } from 'typescript'
import {
  DiagnosticCategory, formatDiagnosticsWithColorAndContext, getPreEmitDiagnostics, sys,
} from 'typescript'

import { buildEntries } from './buildEntries.ts'
import { getCompilerOptions } from './getCompilerOptions.ts'
import type { XyConfig } from './XyConfig.ts'

function deleteAndCleanEmptyParents(targetDir: string, stopAt: string) {
  rimrafSync(targetDir)

  let current = path.resolve(targetDir)
  const resolvedStopAt = path.resolve(stopAt)

  while (current !== resolvedStopAt) {
    if (!current.startsWith(resolvedStopAt)) {
      throw new Error(`Invalid cleanup path: ${current} does not start with ${resolvedStopAt}`)
    }

    const parent = path.dirname(current)

    try {
      const entries = readdirSync(parent)
      if (entries.length > 0) break

      rimrafSync(parent)
      current = parent
    } catch {
      break // directory doesn't exist or can't be removed
    }
  }
}

export const packageCompileTscTypes = (
  entries: string[],
  outDir: string,
  folder: string = 'src',
  config: XyConfig = {},
  compilerOptionsParam?: CompilerOptions,
): number => {
  const pkg = process.env.INIT_CWD ?? cwd()
  const verbose = config?.verbose ?? false
  const tempRoot = path.resolve(`${pkg}/node_modules/.xylabs-temp`)
  const tempDir = path.resolve(`${tempRoot}/ts-scripts-yarn3/compile/tsc/types`)

  try {
    deleteAndCleanEmptyParents(tempDir, tempRoot)
  } catch (ex) {
    console.error(chalk.red(`Error removing temporary directory (pre): ${tempDir}`), ex)
    return 1
  }

  try {
    const compilerOptions = {
      ...(getCompilerOptions({
        emitDeclarationOnly: true,
        outDir: tempDir,
        removeComments: false,
        skipDefaultLibCheck: true,
        skipLibCheck: true,
        sourceMap: false,
      })),
      ...compilerOptionsParam,
      emitDeclarationOnly: true,
      noEmit: false,
    } as TsConfigCompilerOptions

    const validTsExt = ['.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts']
    const excludes = ['.stories.', '.spec.', '/stories/', '/spec/']

    // calling all here since the types do not get rolled up
    const files = buildEntries(folder, 'all', verbose)
      .filter(file => validTsExt.find(ext => file.endsWith(ext)) && !(excludes.some(exclude => file.includes(exclude))))

    console.log(chalk.green(`Compiling Types ${pkg}: ${files.length}`))

    if (files.length > 0) {
      const program = createProgramFromConfig({
        basePath: pkg ?? cwd(),
        compilerOptions,
        exclude: ['build', 'dist', 'docs', '**/*.spec.*', '**/*.stories.*', 'src/**/spec/**/*'],
        files,
      })

      const diagnostics = getPreEmitDiagnostics(program)

      if (diagnostics.length > 0) {
        const formattedDiagnostics = formatDiagnosticsWithColorAndContext(
          diagnostics,
          {
            getCanonicalFileName: fileName => fileName,
            getCurrentDirectory: () => folder,
            getNewLine: () => sys.newLine,
          },
        )
        console.error(formattedDiagnostics)
      }

      program.emit()
      const tscErrorCount = diagnostics.reduce((acc, diag) => acc + (diag.category === DiagnosticCategory.Error ? 1 : 0), 0)
      if (tscErrorCount > 0) {
        return tscErrorCount
      }

      // api-extractor

      const entryNameToTypeName = (entry: string): string => {
        const splitEntryName = entry.split('.')
        const newEntryExtension = 'd.' + splitEntryName.at(-1)
        return [...splitEntryName.slice(0, -1), newEntryExtension].join('.')
      }

      const entryNames = entries.map(entry => entry.split(`${folder}/`).at(-1) ?? entry)

      for (const entry of entryNames) {
        const entryTypeName = entryNameToTypeName(entry)

        const configObject = {
          projectFolder: '.',
          mainEntryPointFilePath: path.resolve([tempDir, entryTypeName].join('/')),
          bundledPackages: [],
          compiler: { tsconfigFilePath: path.resolve(`${pkg}/tsconfig.json`) },
          dtsRollup: {
            enabled: true,
            untrimmedFilePath: path.resolve(`${outDir}/${entryTypeName}`),
          },
          apiReport: { enabled: false },
          docModel: { enabled: false },
          tsdocMetadata: { enabled: false },
        }

        writeFileSync(`${tempDir}/api-extractor.json`, JSON.stringify(configObject, null, 2))

        const extractorConfig = ExtractorConfig.prepare({
          configObject,
          configObjectFullPath: path.resolve(`${tempDir}/api-extractor.json`), // just a virtual label, doesn't have to exist
          packageJsonFullPath: path.resolve('package.json'),
        })

        const extractorResult = Extractor.invoke(extractorConfig, {
          localBuild: true,
          showVerboseMessages: true,
        })

        if (extractorResult.succeeded) {
          console.log('API Extractor completed successfully')
          process.exitCode = 0
        } else {
          console.error(
            `API Extractor completed with ${extractorResult.errorCount} errors`
            + ` and ${extractorResult.warningCount} warnings`,
          )
          process.exitCode = 1
        }
      }
    }
    return 0
  } finally {
    try {
      deleteAndCleanEmptyParents(tempDir, tempRoot)
    } catch (ex) {
      console.error(chalk.red(`Error removing temporary directory (finally): ${tempDir}`), ex)
      return 1
    }
  }
}
