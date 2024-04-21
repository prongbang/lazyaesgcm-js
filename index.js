const x25519 = require('@stablelib/x25519');

function generateKeyPair() {
    const kp = x25519.generateKeyPair();
    return {
        pk: toHex(kp.publicKey),
        sk: toHex(kp.secretKey),
    }
}

function sharedKey(sk, pk) {
    const publicKey = fromHex(pk);
    const secretKey = fromHex(sk);
    const key = x25519.sharedKey(secretKey, publicKey);
    return toHex(key)
}

function appendUint8Array(arr1, arr2) {
    return new Uint8Array([...arr1, ...arr2]);
}

function fromHex(hex) {
    return Uint8Array.from(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

function toHex(arrBuf) {
    return Array.from(new Uint8Array(arrBuf))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

async function encode(data) {
    return new TextEncoder().encode(data);
}

async function decode(data) {
    return new TextDecoder().decode(data);
}

async function toCryptoKey(keyHex) {
    const keyBytes = Uint8Array.from(keyHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    return await crypto.subtle.importKey("raw", keyBytes, {
        name: "AES-GCM",
        length: keyBytes.length * 8
    }, true, ["encrypt", "decrypt"]);
}

// Generate a 256-bit key (32 bytes)
async function generateKey() {
    const key = await crypto.subtle.generateKey({name: "AES-GCM", length: 256}, true, ["encrypt", "decrypt"]);

    const keyBuf = await crypto.subtle.exportKey("raw", key);
    return toHex(keyBuf);
}

async function encrypt(data, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cryptoKey = await toCryptoKey(key);
    const dataEncode = await encode(data);

    const encrypted = await crypto.subtle.encrypt({name: "AES-GCM", iv: iv}, cryptoKey, dataEncode);

    // Convert IV and encrypted data to hexadecimal strings
    let ivEncrypted = appendUint8Array(iv, new Uint8Array(encrypted));
    return toHex(ivEncrypted);
}

async function decrypt(encryptedHex, key) {
    const nonceSize = 12;
    const encrypted = fromHex(encryptedHex);
    const iv = encrypted.slice(0, nonceSize);
    const encryptedData = encrypted.slice(nonceSize);
    const cryptoKey = await toCryptoKey(key);

    const decrypted = await crypto.subtle.decrypt({name: "AES-GCM", iv: iv}, cryptoKey, encryptedData);

    return await decode(decrypted);
}

module.exports = {
    generateKey,
    encrypt,
    decrypt,
    generateKeyPair,
    sharedKey,
};