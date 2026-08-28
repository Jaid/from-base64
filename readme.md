# from-base64

Decode Base64 or Base64URL strings into bytes or UTF-8 strings.

## Usage

```ts
import fromBase64 from 'from-base64'

fromBase64('Zm9v') // Uint8Array [102, 111, 111]
fromBase64('+/8=') // Uint8Array [251, 255]
fromBase64('-_8') // Uint8Array [251, 255]

fromBase64.arrayBuffer('Zm9v') // ArrayBuffer
fromBase64.blob('Zm9v') // Blob {type: 'application/octet-stream'}
fromBase64.blob('Zm9v', 'image/png') // Blob {type: 'image/png'}

fromBase64.string('4pyT') // '✓'
```

`fromBase64(input)` returns a `Uint8Array`.

Both the Base64 (`+`, `/`) and Base64URL (`-`, `_`) alphabets are accepted, with or without `=` padding.

Invalid characters, lengths and padding throw a `TypeError`.