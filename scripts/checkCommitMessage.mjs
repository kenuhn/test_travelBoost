import { readFileSync } from 'fs'
import { colorLog } from './logger.mjs'

const [, , COMMIT_MESSAGE_PATH] = process.argv

const commitRegexp =
  /^((\[(CONFIG|CORE|MISC|VERSION)\])+ (Add|Bump|Change|Configure|Fix|Improve|Remove|Rename|Update|Upgrade|Wip)|wip|fixup) (.*)/

const checkCommitMessage = (commitMessagePath) => {
  try {
    const commitMessage = readFileSync(commitMessagePath).toString('utf8')
    const isValidMessage = commitRegexp.test(commitMessage)

    if (!isValidMessage) {
      const messageFormat = commitRegexp.toString()
      colorLog(`Commit message must follow the format: ${messageFormat}`, 'red')
      process.exit(1)
    }
  } catch (error) {
    colorLog(
      `Error while check commit message ${COMMIT_MESSAGE_PATH}: ${error}`,
      'red',
    )
  }
}

checkCommitMessage(COMMIT_MESSAGE_PATH)
