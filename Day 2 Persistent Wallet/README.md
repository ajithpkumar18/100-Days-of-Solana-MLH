# Reusable Solana Wallet (Node.js)

This project demonstrates how to create and persist a reusable Solana wallet across multiple script runs using Node.js.

Instead of generating a new keypair every time, the wallet is saved locally and reconstructed when needed.

---

## 🚀 Features

- Generate a new Solana wallet (Ed25519 keypair)
- Persist the wallet to `wallet.json`
- Reload the same wallet in future runs
- Compatible with Solana CLI keypair format

---

## 📦 How It Works

### 1. Keypair Generation

The script uses:

```js
generateKeyPair(true);
```

- The `true` flag makes the key **extractable**
- Required for exporting the private key
- Without it, `crypto.subtle.exportKey` will fail

---

### 2. Private Key Export (PKCS8)

Node.js does **not support raw export** for Ed25519 private keys.

So the script:

- Exports the private key in **PKCS8 format**
- Extracts the **last 32 bytes** (actual private key)

Why?

- PKCS8 adds a 16-byte header
- The actual key material is at the end

---

### 3. Wallet Storage

The wallet is stored in:

```
wallet.json
```

Format:

- 64 bytes total
    - 32 bytes private key
    - 32 bytes public key

This matches the **Solana CLI keypair format**.

---

### 4. Wallet Reconstruction

To reuse the wallet:

```js
createKeyPairSignerFromBytes(...)
```

This restores:

- The same address
- Full signing capability

---

## ⚠️ Security Warning

This project stores private keys in plain JSON.

This is **only safe for development (devnet)**.

For production:

- Use encrypted keystores
- Use hardware wallets
- Use secure key management systems

---

## 🧪 Usage

1. Run the script to generate a wallet
2. `wallet.json` will be created
3. Re-run scripts to reuse the same wallet

You only need to fund the wallet **once** for devnet usage.

---

## 📌 Notes

- Compatible with Solana tooling
- Ideal for learning and local development
- Avoid using this pattern in production

---

## 🛠 Tech Stack

- Node.js
- Web Crypto API
- Solana Web3 / Kit utilities
