/* eslint-disable complexity */
/* eslint-disable max-statements */
import { existsSync } from 'node:fs'
import path from 'node:path'

import chalk from 'chalk'
import {
  Application, ArgumentsReader, TSConfigReader, TypeDocReader,
} from 'typedoc'

const ExitCodes = {
  CompileError: 3,
  ExceptionThrown: 6,
  NoEntryPoints: 2,
  Ok: 0,
  OptionError: 1,
  OutputError: 5,
  ValidationError: 4,
}

export const packageGenDocs = async () => {
  const pkg = process.env.INIT_CWD

  if (pkg && !existsSync(path.join(pkg, 'typedoc.json'))) {
    return
  }

  const app = await Application.bootstrap({
    entryPointStrategy: 'merge',
    entryPoints: [`${pkg}/src/**/*.ts`, `${pkg}/packages/*/dist/docs.json`],
    excludeExternals: true,
    json: `${pkg}/dist/docs.json`,
    logLevel: 'Error',
    tsconfig: `${pkg}/tsconfig.json`,
  })

  app.options.addReader(new ArgumentsReader(0))
  app.options.addReader(new TypeDocReader())
  app.options.addReader(new TSConfigReader())
  app.options.addReader(new ArgumentsReader(300))

  return await runTypeDoc(app)
}

const runTypeDoc = async (app: Application) => {
  const pkgName = process.env.npm_package_name
  if (app.options.getValue('version')) {
    console.log(app.toString())
    return ExitCodes.Ok
  }

  if (app.options.getValue('showConfig')) {
    console.log(app.options.getRawValues())
    return ExitCodes.Ok
  }

  if (app.logger.hasErrors()) {
    return ExitCodes.OptionError
  }
  if (app.options.getValue('treatWarningsAsErrors') && app.logger.hasWarnings()) {
    return ExitCodes.OptionError
  }

  if (app.options.getValue('entryPoints').length === 0) {
    app.logger.error('No entry points provided')
    return ExitCodes.NoEntryPoints
  }

  if (app.options.getValue('watch')) {
    await app.convertAndWatch(async (project) => {
      const out = app.options.getValue('out')
      if (out) {
        await app.generateDocs(project, out)
      }
      const json = app.options.getValue('json')
      if (json) {
        await app.generateJson(project, json)
      }

      if (!out && !json) {
        await app.generateDocs(project, './docs')
      }
    })
    return ExitCodes.Ok
  }

  const project = await app.convert()
  if (!project) {
    return ExitCodes.CompileError
  }
  if (app.options.getValue('treatWarningsAsErrors') && app.logger.hasWarnings()) {
    return ExitCodes.CompileError
  }

  app.validate(project)
  if (app.logger.hasErrors()) {
    return ExitCodes.ValidationError
  }
  if (app.options.getValue('treatWarningsAsErrors') && app.logger.hasWarnings()) {
    return ExitCodes.ValidationError
  }

  if (app.options.getValue('emit') !== 'none') {
    const out = app.options.getValue('out')
    if (out) {
      await app.generateDocs(project, out)
    }
    const json = app.options.getValue('json')
    if (json) {
      await app.generateJson(project, json)
    }

    if (!out && !json) {
      await app.generateDocs(project, './docs')
    }

    if (app.logger.hasErrors()) {
      return ExitCodes.OutputError
    }
    if (app.options.getValue('treatWarningsAsErrors') && app.logger.hasWarnings()) {
      return ExitCodes.OutputError
    }
  }
  console.log(chalk.green(`${pkgName} - Ok`))
  return ExitCodes.Ok
}
