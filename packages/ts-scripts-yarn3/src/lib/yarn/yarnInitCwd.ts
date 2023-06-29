export const INIT_CWD = () => {
  if (!process.env.INIT_CWD) console.error('Missing INIT_CWD')
  return process.env.INIT_CWD
}
