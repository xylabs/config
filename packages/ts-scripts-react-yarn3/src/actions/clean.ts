#!/usr/bin/env node
import { rimrafSync } from 'rimraf'

export const clean = () => {
  console.log('Clean [dist]')
  rimrafSync('dist')
  console.log('Clean [build]')
  rimrafSync('build')
  console.log('Clean [.eslintcache]')
  rimrafSync('.eslintcache')
  return 0
}
