// ─────────────────────────────────────────────────────────────────────────────
// crypto.js  — AES-CBC encryption for save data and export files
//
// The SECRET_KEY is embedded in the build. It is never exposed to the user.
// Encryption pipeline:  JSON → AES-CBC(key) → base64 → base64 → base64
// Decryption pipeline:  base64 → base64 → base64 → AES-CBC-decrypt → JSON
// ─────────────────────────────────────────────────────────────────────────────

// 256-bit key material, hex-encoded. Change this to rotate the key.
const SECRET_HEX =
  'a3f8c2e14b7d6059e0218af3c74d9b1e' +
  '5f2a0c8d3e6b9741f0a2c5d8e1b4f703';

// ── helpers ──────────────────────────────────────────────────────────────────

function hexToBytes(hex) {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++)
    arr[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return arr;
}

async function getKey() {
  const raw = hexToBytes(SECRET_HEX);
  return crypto.subtle.importKey(
    'raw', raw,
    { name: 'AES-CBC' },
    false,
    ['encrypt', 'decrypt']
  );
}

function toB64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function fromB64(str) {
  const bin = atob(str);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr.buffer;
}

// Triple-base64 helpers
function tripleB64Encode(str) {
  return btoa(btoa(btoa(str)));
}

function tripleB64Decode(str) {
  return atob(atob(atob(str)));
}

// ── public API ────────────────────────────────────────────────────────────────

/**
 * Encrypt a plain object → opaque string suitable for localStorage / file export.
 */
export async function encryptState(obj) {
  const json = JSON.stringify(obj);
  const iv   = crypto.getRandomValues(new Uint8Array(16));
  const key  = await getKey();
  const enc  = new TextEncoder();
  const ct   = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    enc.encode(json)
  );
  // Combine iv + ciphertext, then triple-base64
  const combined = new Uint8Array(16 + ct.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ct), 16);
  const b64once = toB64(combined.buffer);
  return tripleB64Encode(b64once);
}

/**
 * Decrypt an opaque string → plain object.
 * Throws if the data is tampered / wrong key.
 */
export async function decryptState(str) {
  const b64once = tripleB64Decode(str);
  const buf     = fromB64(b64once);
  const iv      = new Uint8Array(buf, 0, 16);
  const ct      = new Uint8Array(buf, 16);
  const key     = await getKey();
  const dec     = new TextDecoder();
  const plain   = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv },
    key,
    ct
  );
  return JSON.parse(dec.decode(plain));
}

// ── Convenience wrappers used by SettingsModal (export/import) ───────────────
export async function encodeGameState(state) {
  return encryptState(state);
}

export async function decodeGameState(str) {
  return decryptState(str);
}
