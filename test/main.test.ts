import {expect, test} from 'bun:test'

const {default: fromBase64} = await import('#src/main.ts')

test('should run', () => {
  const result = fromBase64()
  expect(result).toBe('from-base64') // TODO Test actual functionality
})
