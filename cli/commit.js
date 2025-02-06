import { execSync } from 'node:child_process'
import process from 'node:process'

function greenLog(str) {
  console.log('\x1B[38;2;103;58;183m', str)
}

try {
  // 同步执行 Git 命令获取所有合并的提交信息
  const stdout = execSync('git log --merges --pretty=format:"%s"').toString().trim()

  // 解析输出，提取分支名
  const mergeBranches = stdout.split('\n').map((line) => {
    const match = line.trim().match(/Merge branch '(.+)' into (.+)/)
    console.log('line=>', line)
    return match ? { source: match[1], target: match[2] } : null
  }).filter(branch => branch !== null)

  // 输出合并的分支名
  const has = false
  mergeBranches.forEach((branch) => {
    if (['dev', 'test', 'temp'].includes(branch.source)) {
      console.error(`当前分支包含合并分支:${branch.source}，禁止提交。`)
      return has
    }
  })
  if (has) {
    process.exit(1)
  }
  else {
    greenLog('分支检测ok')
  }
}
catch (error) {
  console.error(`执行 Git 命令出错: ${error.message}`)
}
