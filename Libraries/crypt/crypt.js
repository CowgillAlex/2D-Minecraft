const base64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const crypt = {
  // Bit-wise rotation left
  rotl(n, b) {
    return (n << b) | (n >>> (32 - b));
  },

  // Bit-wise rotation right
  rotr(n, b) {
    return (n << (32 - b)) | (n >>> b);
  },

  // Swap big-endian to little-endian and vice versa
  endian(n) {
    // If number given, swap endian
    if (typeof n === 'number') {
      return this.rotl(n, 8) & 0x00FF00FF | this.rotl(n, 24) & 0xFF00FF00;
    }

    // Else, assume array and swap all items
    for (let i = 0; i < n.length; i++) {
      n[i] = this.endian(n[i]);
    }
    return n;
  },

  // Generate an array of any length of random bytes
  randomBytes(n) {
    const bytes = [];
    while (n-- > 0) {
      bytes.push(Math.floor(Math.random() * 256));
    }
    return bytes;
  },

  // Convert a byte array to big-endian 32-bit words
  bytesToWords(bytes) {
    const words = [];
    let b = 0;
    for (let i = 0; i < bytes.length; i++, b += 8) {
      words[b >>> 5] |= bytes[i] << (24 - b % 32);
    }
    return words;
  },

  // Convert big-endian 32-bit words to a byte array
  wordsToBytes(words) {
    const bytes = [];
    let b = 0;
    for (b = 0; b < words.length * 32; b += 8) {
      bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
    }
    return bytes;
  },

  // Convert a byte array to a hex string
  bytesToHex(bytes) {
    const hex = [];
    for (let i = 0; i < bytes.length; i++) {
      hex.push((bytes[i] >>> 4).toString(16));
      hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join('');
  },

  // Convert a hex string to a byte array
  hexToBytes(hex) {
    const bytes = [];
    for (let c = 0; c < hex.length; c += 2) {
      bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
  },

  // Convert a byte array to a base-64 string
  bytesToBase64(bytes) {
    const base64 = [];
    for (let i = 0; i < bytes.length; i += 3) {
      const triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
      for (let j = 0; j < 4; j++) {
        if (i * 8 + j * 6 <= bytes.length * 8) {
          base64.push(base64map.charAt((triplet >>> (6 * (3 - j))) & 0x3F));
        } else {
          base64.push('=');
        }
      }
    }
    return base64.join('');
  },

  // Convert a base-64 string to a byte array
  base64ToBytes(base64) {
    // Remove non-base-64 characters
    base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

    const bytes = [];
    let imod4 = 0;
    for (let i = 0; i < base64.length; imod4 = ++i % 4) {
      if (imod4 === 0) continue;
      bytes.push(((base64map.indexOf(base64.charAt(i - 1))
        & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
        | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
    }
    return bytes;
  }
};

export default crypt;
