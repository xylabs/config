import fs from 'node:fs'
import path from 'node:path'

import ts from 'typescript'

import { getBasePackageName } from './getBasePackageName.ts'

export function getImportsFromFile(filePath: string, importPaths: Record<string, string[]>, typeImportPaths: Record<string, string[]>) {
  const sourceCode = fs.readFileSync(filePath, 'utf8')

  const isMjsFile = filePath.endsWith('.mjs')

  const sourceFile = ts.createSourceFile(
    path.basename(filePath),
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
    isMjsFile ? ts.ScriptKind.JS : undefined,
  )

  const imports: string[] = []
  const typeImports: string[] = []

  const isDeclarationFile = filePath.endsWith('.d.ts')

  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      const moduleSpecifier = (node.moduleSpecifier)?.getFullText()
      const isTypeImport = ts.isImportDeclaration(node) ? (node.importClause?.isTypeOnly ?? false) : false
      if (typeof moduleSpecifier === 'string') {
        const trimmed = moduleSpecifier.replaceAll("'", '').replaceAll('"', '').trim()
        // we are determining if the type import is being imported in an exported d.ts file
        if (isTypeImport || isDeclarationFile) {
          typeImports.push(trimmed)
        } else {
          imports.push(trimmed)
        }
      }
    } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const [arg] = node.arguments
      if (ts.isStringLiteral(arg)) {
        const trimmed = arg.text
        imports.push(trimmed)
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  const importsStartsWithExcludes = ['.', '#', 'node:']

  const cleanedImports = imports.filter(imp => !importsStartsWithExcludes.some(exc => imp.startsWith(exc))).map(getBasePackageName)
  const cleanedTypeImports = typeImports.filter(imp => !importsStartsWithExcludes.some(exc => imp.startsWith(exc))).map(getBasePackageName)

  for (const imp of cleanedImports) {
    importPaths[imp] = importPaths[imp] ?? []
    importPaths[imp].push(filePath)
  }

  for (const imp of cleanedTypeImports) {
    typeImportPaths[imp] = typeImportPaths[imp] ?? []
    typeImportPaths[imp].push(filePath)
  }

  return [cleanedImports, cleanedTypeImports]
}
