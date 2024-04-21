# lazyaesgcm

Lazy AES-GCM in JavaScript

### Algorithm details

- Key exchange: X25519
- Encryption: XChaCha20
- Authentication: Poly1305

### Install

```shell
npm install lazyaesgcm
```

### How to use

- Generate Key

```javascript
let key = await generateKey();
```

- Generate Key Pair

```javascript
let keypair = generateKeyPair();
let pk = keypair.pk;
let sk = keypair.sk;
```

- Shared Key

```javascript
const clientKp = generateKeyPair();
const serverKp = generateKeyPair();
const clientSharedKey = sharedKey(clientKp.sk, serverKp.pk);
const serverSharedKey = sharedKey(serverKp.sk, clientKp.pk);
```

- Encrypt

```javascript
let plaintext = 'Hello';
let key = "fa6cd8fb8d2d4525def2b89ee791c1af5bf4e2219f37a5e1603936d06fc2bd56";
let ciphertext = await encrypt(plaintext, key);
```

- Decrypt

```javascript
let ciphertext = 'd111c7590154d08f2b378ffbceebe629331ddfe5ce0a8ee02f185757ee8c90edb3';
let key = "fa6cd8fb8d2d4525def2b89ee791c1af5bf4e2219f37a5e1603936d06fc2bd56";
let plaintext = await decrypt(ciphertext, key);
```

### Example

```javascript
const lazyaesgcm = require('lazyaesgcm');

;(async () => {
    let key = await lazyaesgcm.generateKey();
    console.log("key:", key);

    let keypair = lazyaesgcm.generateKeyPair();
    let pk = keypair.pk;
    let sk = keypair.sk;
    console.log("pk:", pk);
    console.log("sk:", sk);

    const clientKp = lazyaesgcm.generateKeyPair();
    const serverKp = lazyaesgcm.generateKeyPair();
    const clientSharedKey = lazyaesgcm.sharedKey(clientKp.sk, serverKp.pk);
    const serverSharedKey = lazyaesgcm.sharedKey(serverKp.sk, clientKp.pk);
    console.log("clientSharedKey:", clientSharedKey);
    console.log("serverSharedKey:", serverSharedKey);

    let plaintext = 'Hello';
    let ciphertext = await lazyaesgcm.encrypt(plaintext, clientSharedKey);
    console.log('ciphertext:', ciphertext);

    let plaintext2 = await lazyaesgcm.decrypt(ciphertext, serverSharedKey);
    console.log('plaintext:', plaintext2);
})()
```
