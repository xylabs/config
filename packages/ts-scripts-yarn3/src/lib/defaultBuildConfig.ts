export const defaultBuildConfig = {
  compilerOptions: {
    rootDir: 'src',
    rootDirs: ['package.json'],
  },
  exclude: ['**/build', '**/dist', '**/node_modules', '**/*.spec.*', '**/*.spec', '**/*.stories.*', '**/*.example.*', '**/spec/*', '**/stories/*'],
  include: ['src'],
}
