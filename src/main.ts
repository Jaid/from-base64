const decodeDigit = (codePoint: number, index: number) => {
  if (codePoint >= 65 && codePoint <= 90) {
    return codePoint - 65
  }
  if (codePoint >= 97 && codePoint <= 122) {
    return codePoint - 71
  }
  if (codePoint >= 48 && codePoint <= 57) {
    return codePoint + 4
  }
  if (codePoint === 43 || codePoint === 45) {
    return 62
  }
  if (codePoint === 47 || codePoint === 95) {
    return 63
  }
  throw new TypeError(`Invalid Base64 character at index ${index}.`)
}
const fromBase64 = (input: string) => {
  let dataLength = input.length
  let paddingLength = 0
  while (dataLength > 0 && input.codePointAt(dataLength - 1) === 61) {
    dataLength--
    paddingLength++
  }
  if (paddingLength > 2 || paddingLength > 0 && input.length % 4 !== 0 || dataLength % 4 === 1) {
    throw new TypeError('Invalid Base64 length or padding.')
  }
  const output = new Uint8Array(Math.floor(dataLength * 3 / 4))
  let outputIndex = 0
  let inputIndex = 0
  while (inputIndex + 4 <= dataLength) {
    const digit0 = decodeDigit(input.codePointAt(inputIndex)!, inputIndex)
    const digit1 = decodeDigit(input.codePointAt(inputIndex + 1)!, inputIndex + 1)
    const digit2 = decodeDigit(input.codePointAt(inputIndex + 2)!, inputIndex + 2)
    const digit3 = decodeDigit(input.codePointAt(inputIndex + 3)!, inputIndex + 3)
    output[outputIndex++] = digit0 << 2 | digit1 >> 4
    output[outputIndex++] = (digit1 & 0x0F) << 4 | digit2 >> 2
    output[outputIndex++] = (digit2 & 0x03) << 6 | digit3
    inputIndex += 4
  }
  const remainder = dataLength - inputIndex
  if (remainder === 2) {
    const digit0 = decodeDigit(input.codePointAt(inputIndex)!, inputIndex)
    const digit1 = decodeDigit(input.codePointAt(inputIndex + 1)!, inputIndex + 1)
    output[outputIndex] = digit0 << 2 | digit1 >> 4
  } else if (remainder === 3) {
    const digit0 = decodeDigit(input.codePointAt(inputIndex)!, inputIndex)
    const digit1 = decodeDigit(input.codePointAt(inputIndex + 1)!, inputIndex + 1)
    const digit2 = decodeDigit(input.codePointAt(inputIndex + 2)!, inputIndex + 2)
    output[outputIndex++] = digit0 << 2 | digit1 >> 4
    output[outputIndex] = (digit1 & 0x0F) << 4 | digit2 >> 2
  }
  return output
}
fromBase64.arrayBuffer = (input: string) => {
  return fromBase64(input).buffer
}
fromBase64.blob = (input: string, type = 'application/octet-stream') => {
  return new Blob([fromBase64(input)], {type})
}
fromBase64.string = (input: string) => {
  const textDecoder = new TextDecoder
  return textDecoder.decode(fromBase64(input))
}
export default fromBase64
