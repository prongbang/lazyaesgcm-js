const {generateKey, encrypt, decrypt, generateKeyPair, sharedKey} = require("./index");

test('Should return key pair when generate key pair success', async () => {
    // Given
    const keySize = 64;

    // When
    let keypair = generateKeyPair();

    // Then
    expect(keypair.pk.length).toBe(keySize);
    expect(keypair.sk.length).toBe(keySize);
});

test('Should return shared key when key exchange success', async () => {
    // Given
    const clientKp = generateKeyPair();
    const serverKp = generateKeyPair();

    // When
    const clientSharedKey = sharedKey(clientKp.sk, serverKp.pk);
    const serverSharedKey = sharedKey(serverKp.sk, clientKp.pk);

    // Then
    expect(clientSharedKey).toBe(serverSharedKey);
});

test('Should return secret key when generate key success', async () => {
    // Given
    const keySize = 64;

    // When
    let key = await generateKey();

    // Then
    expect(key.length).toBe(keySize);
});

test('Should return ciphertext when encrypt success', async () => {
    // Given
    let key = "fa6cd8fb8d2d4525def2b89ee791c1af5bf4e2219f37a5e1603936d06fc2bd56";
    let plaintext = 'Hello';

    // When
    let ciphertext = await encrypt(plaintext, key);

    // Then
    expect(ciphertext.length > 0).toBe(true);
});

test('Should return plaintext when decrypt success', async () => {
    // Given
    let key = "fa6cd8fb8d2d4525def2b89ee791c1af5bf4e2219f37a5e1603936d06fc2bd56";
    let ciphertext = 'd111c7590154d08f2b378ffbceebe629331ddfe5ce0a8ee02f185757ee8c90edb3';

    // When
    let plaintext = await decrypt(ciphertext, key);

    // Then
    expect(plaintext).toBe('Hello');
});

test('Should return plaintext when decrypt ciphertext from server success', async () => {
    // Given
    let key = "e4f7fe3c8b4066490f8ffde56f080c70629ff9731b60838015027c4687303b1d";
    let ciphertext = '84d685b20c1a647d1bdfddd575fe506163e2215142df6494f9430619e24271240bea94340ed26651573fd125328d9b18d63d6f464f0f7024474ac3864fea59f34dbdbfd5119de23985a0c8549440626dae5d54c00c3171b58f084dda82656c34ecf1de4eb11b33b208a52cac97eb78d88987a4cdd79b11a0713857563df328bfbb52d1c0c04ba931ec';
    let expected = "{\"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.rTCH8cLoGxAm_xw68z-zXVKi9ie6xJn9tnVWjd_9ftE\"}";

    // When
    let plaintext = await decrypt(ciphertext, key);

    // Then
    expect(plaintext).toBe(expected);
});
