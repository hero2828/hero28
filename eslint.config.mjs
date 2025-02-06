import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  ignorePatterns: ['**/dist/**', '*-lock.yaml', '**/cli/**', '**/node_modules/**'],
})
