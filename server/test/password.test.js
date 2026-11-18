const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword, verifyPassword } = require('../utils/password');

test('hashPassword creates an Argon2id PHC hash that verifies', async () => {
    const hash = await hashPassword('correct horse battery staple');

    assert.match(hash, /^\$argon2id\$/);
    assert.equal((await verifyPassword('correct horse battery staple', hash)).valid, true);
    assert.equal((await verifyPassword('wrong password', hash)).valid, false);
});

test('legacy MD5 passwords verify once and require rehash', async () => {
    const result = await verifyPassword('admin123', '0192023a7bbd73250516f069df18b500');

    assert.deepEqual(result, { valid: true, needsRehash: true });
});
