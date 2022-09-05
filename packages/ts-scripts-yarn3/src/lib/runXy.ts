import { runSteps } from './runSteps'

export const runXy = (command: string) => {
  return runSteps(`XY [${command}]`, [['yarn', ['xy', command, ...process.argv.filter((value, index) => (index > 1 ? value : undefined))]]])
}
