import { tsconfigGenCjs } from './tsconfig-gen-cjs'
import { tsconfigGenEsm } from './tsconfig-gen-esm'
import { tsconfigGenTest } from './tsconfig-gen-test'

export interface TsconfigGenParams {
  target?: 'esm' | 'cjs'
  pkg?: string
}

export const tsconfigGen = ({ target, pkg }: TsconfigGenParams) => {
  switch (target) {
    case 'esm':
      return tsconfigGenEsm(pkg) || tsconfigGenTest(pkg)
    case 'cjs':
      return tsconfigGenCjs(pkg) || tsconfigGenTest(pkg)
    default:
      return tsconfigGenEsm(pkg) || tsconfigGenCjs(pkg) || tsconfigGenTest(pkg)
  }
}
