import { isYarnVersionOrGreater, processEx } from '../lib'

export const yarn3Only = () => {
  const [valid, version] = isYarnVersionOrGreater(3)
  if (!valid) {
    processEx(`Invalid Yarn version [${version}]`)
  }
}
