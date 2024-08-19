import { spawnSync } from 'node:child_process'

export const isYarnVersionOrGreater = (major: number, minor?: number, patch?: number): [boolean, string] => {
  const result = spawnSync('yarn', ['-v'], {
    encoding: 'utf8', shell: true,
  })
  const version = result.stdout.toString().replaceAll('\n', '')
  const versionNumbers = version.split('.').map(ver => Number.parseInt(ver))
  const majorDelta = versionNumbers[0] - major
  const minorDelta = versionNumbers[1] - (minor ?? versionNumbers[1])
  const patchDelta = versionNumbers[2] - (patch ?? versionNumbers[2])

  const majorOk = majorDelta >= 0
  const minorOk = majorDelta > 0 || minorDelta >= 0
  const patchOk = majorDelta > 0 || minorDelta > 0 || patchDelta >= 0

  return [majorOk && minorOk && patchOk, version]
}
