import {describe, expect, test} from 'bun:test'

import fromBase64 from '#src/main.ts'

describe('fromBase64', () => {
  test('decodes padded and unpadded Base64', () => {
    expect([...fromBase64('Zg')]).toEqual([102])
    expect([...fromBase64('Zg==')]).toEqual([102])
    expect([...fromBase64('Zm8')]).toEqual([102, 111])
    expect([...fromBase64('Zm8=')]).toEqual([102, 111])
    expect([...fromBase64('Zm9v')]).toEqual([102, 111, 111])
  })
  test('decodes Base64 and Base64URL symbols', () => {
    expect([...fromBase64('+/8=')]).toEqual([251, 255])
    expect([...fromBase64('-_8')]).toEqual([251, 255])
  })
  test('returns an ArrayBuffer', () => {
    expect(new Uint8Array(fromBase64.arrayBuffer('Zm9v'))).toEqual(new Uint8Array([102, 111, 111]))
  })
  test('returns a Blob', async () => {
    const defaultBlob = fromBase64.blob('Zm9v')
    expect(defaultBlob.type).toBe('application/octet-stream')
    expect(new Uint8Array(await defaultBlob.arrayBuffer())).toEqual(new Uint8Array([102, 111, 111]))
    expect(fromBase64.blob('Zm9v', 'image/png').type).toBe('image/png')
  })
  test('decodes UTF-8 bytes', () => {
    expect(fromBase64.string('4pyT')).toBe('✓')
  })
  test('decodes every byte value', () => {
    const bytes = Uint8Array.from({length: 256}, (_, index) => index)
    const encoded = Buffer.from(bytes).toString('base64url')
    expect(fromBase64(encoded)).toEqual(bytes)
  })
  test('rejects invalid input', () => {
    expect(() => fromBase64('A')).toThrow(TypeError)
    expect(() => fromBase64('Zm=8')).toThrow(TypeError)
    expect(() => fromBase64('Zg=')).toThrow(TypeError)
    expect(() => fromBase64('Zg===')).toThrow(TypeError)
    expect(() => fromBase64('Zm$v')).toThrow(TypeError)
  })
})
