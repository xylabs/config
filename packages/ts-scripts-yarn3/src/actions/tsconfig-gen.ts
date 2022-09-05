import { tsconfigGenCjs } from './tsconfig-gen-cjs'
import { tsconfigGenEsm } from './tsconfig-gen-esm'
import { tsconfigGenTest } from './tsconfig-gen-test'

export interface TsconfigGenParams {
  target?: 'esm' | 'cjs'
  pkg?: string
}

export const tsconfigGen = ({ target }: TsconfigGenParams) => {
  switch (target) {
    case 'esm':
      return tsconfigGenEsm() || tsconfigGenTest()
    case 'cjs':
      return tsconfigGenCjs() || tsconfigGenTest()
    default:
      return tsconfigGenEsm() || tsconfigGenCjs() || tsconfigGenTest()
  }
}
