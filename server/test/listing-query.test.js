const test = require('node:test');
const assert = require('node:assert/strict');
const { buildListQuery } = require('../controllers/listing');

test('root featured query only returns top-level featured listings', () => {
  const query = buildListQuery(null, 'user-1');

  assert.deepEqual(query, {
    parentId: null,
    onFeatured: true,
    userId: 'user-1',
    listingType: { $ne: 'stream' }
  });
  assert.equal(Object.hasOwn(query, 'parent'), false);
});

test('folder query returns children of the selected folder', () => {
  const query = buildListQuery('507f1f77bcf86cd799439011', 'user-1');

  assert.equal(query.parentId.toString(), '507f1f77bcf86cd799439011');
  assert.equal(query.userId, 'user-1');
  assert.deepEqual(query.listingType, { $ne: 'stream' });
});
