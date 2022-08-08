import { assertEx } from '@xylabs/sdk-js'

export const INIT_CWD = () => assertEx(process.env.INIT_CWD, 'Missing INIT_CWD')
