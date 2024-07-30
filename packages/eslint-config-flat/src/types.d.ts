declare module 'eslint-plugin-import' {
  const configs: Linter.Plugin
}

declare module 'eslint-plugin-workspaces' {
  const configs: Linter.Plugin
}

declare module 'eslint-plugin-unicorn' {
  const configs: {
    all: unknown
    'flat/all': unknown
    'flat/recommended': unknown
    recommended: unknown
  }
}

declare module 'markdown-eslint-parser' {}

declare module 'eslint-plugin-md' {
  const configs: Linter.Plugin
}
