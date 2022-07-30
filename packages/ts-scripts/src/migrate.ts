#!/usr/bin/env node
import { execSync } from 'child_process'

import { safeExit } from './safeExit'

const npmIgnore = ['.pnp.*', '.yarn/*']

const gitIgnore = ['.pnp.*', '.yarn/*', '!.yarn/patches', '!.yarn/plugins', '!.yarn/releases', '!.yarn/sdks', '!.yarn/versions']

safeExit(() => {
  console.log(`Migrate [${process.cwd()}]`)
  execSync('yarn set version berry', { stdio: 'inherit' })
  execSync(`echo "\n${gitIgnore.join('\n')}" >> .gitignore`, { stdio: 'inherit' })
  execSync(`echo "\n${npmIgnore.join('\n')}" >> .npmignore`, { stdio: 'inherit' })
  execSync('yarn install', { stdio: 'inherit' })
  execSync('yarn plugin import version', { stdio: 'inherit' })
  execSync('yarn plugin import interactive-tools', { stdio: 'inherit' })
  execSync('yarn plugin import https://mskelton.dev/yarn-outdated/v2', { stdio: 'inherit' })
})
