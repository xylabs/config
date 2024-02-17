import path from 'node:path/posix'

import chalk from 'chalk'
import cpy from 'cpy'

export interface PackageCopyAssetsParams {
  target?: 'esm' | 'cjs'
}

const copyTargetAssets = async (target: 'esm' | 'cjs', name: string, location: string) => {
  try {
    const values = await cpy(
      ['**/*.jpg', '**/*.png', '**/*.gif', '**/*.svg', '**/*.webp', '**/*.sass', '**/*.scss', '**/*.gif', '**/*.css'],
      `../dist/${target}`,
      {
        cwd: path.join(location, 'src'),
        parents: true,
      },
    )
    if (values.length > 0) {
      console.log(chalk.green(`Copying Assets [${target.toUpperCase()}] - ${name} - ${location}`))
    }
    for (const value of values) {
      console.log(`${value.split('/').pop()} => ./dist/${target}`)
    }
    return 0
  } catch (ex) {
    const error = ex as Error
    console.log(`Copy Assets Failed: ${name}: ${error.message}`)
    return 1
  }
}

export const packageCopyAssets = async ({ target }: PackageCopyAssetsParams) => {
  const pkg = process.env.INIT_CWD ?? './'
  const pkgName = process.env.npm_package_name ?? 'Unknown'
  switch (target) {
    case 'esm': {
      return await copyTargetAssets('esm', pkgName, pkg)
    }
    case 'cjs': {
      return await copyTargetAssets('cjs', pkgName, pkg)
    }
    default: {
      return (await copyTargetAssets('esm', pkgName, pkg)) || (await copyTargetAssets('cjs', pkgName, pkg))
    }
  }
}
