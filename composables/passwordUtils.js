// import {
//     scryptSync,
//     randomFillSync,
//     randomBytes,
//     createCipheriv,
// } from 'node:crypto';

class Vigenere{
    constructor() {
        this.alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890`-=[]\\;',./~!@#$%^&*()_+}{|\"<>?:"
    }

    // Modified vigenere encryption that includes numbers and symbols
    vigenere_modified_encrypt(plaintext, key) {
        
        let encrypted_text = ""

        // Loop through the plaintext
        for (let i = 0; i < plaintext.length; i++) {
            let char = plaintext[i]
            // Check if the current character of the plaintext and
            // the current character of the key is in the alphanumeric string
            // Key repeats if the end is reached
            if (this.alphanumeric.includes(char) && this.alphanumeric.includes(key[i % key.length])) {
                // x = index of plaintext character in alphanumeric string
                // y = index of key character in alphanumeric string
                // computed index = (x + y) mod (length of alphanumeric string)
                // encrypted character = character at computed index in alphanumeric string
                // Concatenate the encrypted character into the encrypted text
                encrypted_text += this.alphanumeric[(this.alphanumeric.indexOf(char) + this.alphanumeric.indexOf(key[i % key.length])) % this.alphanumeric.length]
            } else {
                // Use the current character of the plaintext if the condition above is not met
                encrypted_text += char
            }
        }

        return encrypted_text
    }

    // Decryption of the modified vigenere encryption that includes numbers and symbols
    vigenere_modified_decrypt(ciphertext, key) {
        let decrypted_text = ""

        // Loop through the ciphertext
        for (let i = 0; i < ciphertext.length; i++) {
            let char = ciphertext[i]
            // Check if the current character of the plaintext and
            // the current character of the key is in the alphanumeric string
            // Key repeats if the end is reached
            if (this.alphanumeric.includes(char) && this.alphanumeric.includes(key[i % key.length])) {
                // x = index of plaintext character in alphanumeric string
                // y = index of key character in alphanumeric string
                // computed index = (x + y) mod (length of alphanumeric string)
                // encrypted character = character at computed index in alphanumeric string
                // Concatenate the encrypted character into the encrypted text
                decrypted_text += this.alphanumeric[(this.alphanumeric.indexOf(char) + this.alphanumeric.indexOf(key[i % len(key)])) % this.alphanumeric.length]
            } else {
                // Use the current character of the plaintext if the condition above is not met
                decrypted_text += char
            }
        }

        return decrypted_text
    }
}

// class SecurityUtils{
//     constructor() {
//         this.algorithm = 'aes128';
//         this.password = '3c3ABlO9r073ct';
//         this.salt = '0c00b4e4a5715a3d2f1f54f0e81c5460ed3355970fe063d8351e2e7793a12978';
//         this.bytes = 16;
//         this.iv = '';
//     }

//     getAlgorithm() {
//         return this.algorithm;
//     }
//     getPassword() {
//         return this.password;
//     }
//     getSalt() {
//         return this.salt;
//     }
//     getBytes() {
//         return this.bytes;
//     }
//     getIV() {
//         return this.iv;
//     }

//     setIV(newIV) {
//         this.iv = newIV;
//     }

//     encryptData(data) {
//         const key = scryptSync(this.getPassword(), this.getSalt(), this.getBytes());
//         const iv = this.getIV();

//         const cipher = createCipheriv(this.getAlgorithm(), key, iv);
//         let encrypted = cipher.update(data, 'utf8', 'hex');
//         encrypted += cipher.final('hex');
        
//         return {
//             encryptedData : encrypted,
//             initVector : iv
//         }
//     }
// }

// const security = new SecurityUtils();
const vig = new Vigenere();
export { vig }
