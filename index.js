const crypto = require('crypto');

async function generateKeyPair() {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: 'X25519',
        },
        true,
        ['deriveKey'],
    );

    // Export the public key
    const publicKey = await crypto.subtle.exportKey("raw", keyPair.publicKey);

    // Convert public key to hexadecimal string
    const hexPublicKey = await toHex(publicKey);

    return {
        pk: hexPublicKey,
        sk: keyPair.privateKey,
    };
}

async function exportCryptoKeyToHex(key) {
    const exportedKey = await crypto.subtle.exportKey("raw", key);
    const exportedKeyBytes = new Uint8Array(exportedKey);
    return await toHex(exportedKeyBytes);
}

async function generateKeyPair1() {
    const {publicKey, privateKey} = crypto.generateKeyPairSync('x25519');
    const publicKeyRaw = publicKey.export({type: 'spki', format: 'der'});
    const privateKeyRaw = privateKey.export({type: 'pkcs8', format: 'der'});
    const pk = publicKeyRaw.toString('hex');
    const sk = privateKeyRaw.toString('hex');
    return {pk, sk};
}

function appendUint8Array(arr1, arr2) {
    return new Uint8Array([...arr1, ...arr2]);
}

function fromHex(hex) {
    return Uint8Array.from(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

async function toHex(arrBuf) {
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
    const key = await crypto.subtle.generateKey({
        name: "AES-GCM", length: 256
    }, true, ["encrypt", "decrypt"]);

    const keyBuf = await crypto.subtle.exportKey("raw", key);
    return toHex(keyBuf);
}

async function encrypt(data, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cryptoKey = await toCryptoKey(key);
    const dataEncode = await encode(data);

    const encrypted = await crypto.subtle.encrypt({
        name: "AES-GCM", iv: iv
    }, cryptoKey, dataEncode);

    // Convert IV and encrypted data to hexadecimal strings
    let ivEncrypted = appendUint8Array(iv, new Uint8Array(encrypted));
    return await toHex(ivEncrypted);
}

async function decrypt(encryptedHex, key) {
    const nonceSize = 12;
    const encrypted = fromHex(encryptedHex);
    const iv = encrypted.slice(0, nonceSize);
    const encryptedData = encrypted.slice(nonceSize);
    const cryptoKey = await toCryptoKey(key);

    const decrypted = await crypto.subtle.decrypt({
        name: "AES-GCM", iv: iv
    }, cryptoKey, encryptedData);

    return await decode(decrypted);
}

module.exports = {
    generateKey, encrypt, decrypt, generateKeyPair,
};