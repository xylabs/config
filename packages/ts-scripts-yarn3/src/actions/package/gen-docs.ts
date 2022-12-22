/* eslint-disable complexity */
/* eslint-disable max-statements */
import typedoc from 'typedoc'

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

  const app = new typedoc.Application()

  app.options.addReader(
    new typedoc.ArgumentsReader(0, [
      '--logLevel',
      'Error',
      '--tsconfig',
      `${pkg}/.tsconfig.build.esm.json`,
      '--excludeExternals',
      `${pkg}/src/index.ts`,
      '--json',
      `${pkg}/dist/docs.json`,
    ]),
  )
  app.options.addReader(new typedoc.TypeDocReader())
  app.options.addReader(new typedoc.TSConfigReader())
  app.options.addReader(new typedoc.ArgumentsReader(300))

  app.bootstrap()

  return await runTypeDoc(app)
}

const runTypeDoc = async (app: typedoc.Application) => {
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
    app.convertAndWatch(async (project) => {
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

  const project = app.convert()
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

  return ExitCodes.Ok
}
