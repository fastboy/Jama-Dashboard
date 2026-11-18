const crypto = require('crypto');
const md5 = require('md5');
const argon2 = require('argon2');

const ARGON2_OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
};

const isArgon2Hash = (value) => typeof value === 'string' && value.startsWith('$argon2');
const isLegacyMd5Hash = (value) => typeof value === 'string' && /^[a-f0-9]{32}$/i.test(value);

const hashPassword = (password) => argon2.hash(password, ARGON2_OPTIONS);

const verifyPassword = async (password, storedHash) => {
    if (isArgon2Hash(storedHash)) {
        return {
            valid: await argon2.verify(storedHash, password),
            needsRehash: false,
        };
    }

    if (isLegacyMd5Hash(storedHash)) {
        const suppliedHash = Buffer.from(md5(password), 'utf8');
        const expectedHash = Buffer.from(storedHash, 'utf8');
        const valid = suppliedHash.length === expectedHash.length
            && crypto.timingSafeEqual(suppliedHash, expectedHash);

        return { valid, needsRehash: valid };
    }

    return { valid: false, needsRehash: false };
};

module.exports = {
    ARGON2_OPTIONS,
    hashPassword,
    verifyPassword,
};
