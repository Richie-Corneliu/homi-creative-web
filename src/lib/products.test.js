import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRupiah,
  getProductImages,
  getSafeImageUrl,
  isValidHttpsUrl,
  parseFeatures,
} from './products.js';

test('formatRupiah formats Indonesian currency without decimals', () => {
  assert.equal(formatRupiah(35000), 'Rp 35.000');
  assert.equal(formatRupiah('45000'), 'Rp 45.000');
  assert.equal(formatRupiah(0), 'Rp 0');
  assert.equal(formatRupiah(null), 'Harga belum tersedia');
  assert.equal(formatRupiah('invalid'), 'Harga belum tersedia');
});

test('isValidHttpsUrl accepts only valid https URLs', () => {
  assert.equal(isValidHttpsUrl('https://shopee.co.id/produk-1'), true);
  assert.equal(isValidHttpsUrl('http://shopee.co.id/produk-1'), false);
  assert.equal(isValidHttpsUrl('javascript:alert(1)'), false);
  assert.equal(isValidHttpsUrl('https://'), false);
  assert.equal(isValidHttpsUrl(''), false);
});

test('getSafeImageUrl & getProductImages deduplicate and filter unsafe URLs', () => {
  assert.equal(getSafeImageUrl('https://example.com/a.jpg'), 'https://example.com/a.jpg');
  assert.equal(getSafeImageUrl('/img/sapu.jpg'), '/img/sapu.jpg');
  assert.equal(getSafeImageUrl('http://insecure.example/a.jpg'), '');
  assert.equal(getSafeImageUrl('javascript:alert(1)'), '');

  const imgs = getProductImages({
    image_url: 'https://example.com/1.jpg',
    images: ['https://example.com/1.jpg', 'https://example.com/2.jpg', 'http://bad.com/3.jpg'],
  });
  assert.deepEqual(imgs, ['https://example.com/1.jpg', 'https://example.com/2.jpg']);
});

test('parseFeatures parses JSON strings, string arrays, and object arrays', () => {
  assert.deepEqual(parseFeatures(null), []);
  assert.deepEqual(parseFeatures('["Kayu Jati","Finishing Halus"]'), [
    { title: 'Kayu Jati', description: '' },
    { title: 'Finishing Halus', description: '' },
  ]);
  assert.deepEqual(
    parseFeatures([{ title: 'Sekat Serbaguna', description: 'Muat untuk sendok dan garpu' }]),
    [{ title: 'Sekat Serbaguna', description: 'Muat untuk sendok dan garpu' }]
  );
  assert.deepEqual(parseFeatures('not-json'), [{ title: 'not-json', description: '' }]);
});
