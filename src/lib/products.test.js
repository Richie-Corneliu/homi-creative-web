import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRupiah,
  getProductImages,
  getSafeImageUrl,
  isValidHttpsUrl,
  isValidProductId,
  normalizeProduct,
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

test('normalizeProduct trims trailing whitespace and newlines', () => {
  const clean = normalizeProduct({
    id: 13,
    name: ' Sapu GX Outdoor \n',
    category: 'Alat Kebersihan\n',
    image_url: 'https://example.com/a.jpg\n',
    shopee_url: ' https://shopee.co.id ',
  });
  assert.equal(clean.name, 'Sapu GX Outdoor');
  assert.equal(clean.category, 'Alat Kebersihan');
  assert.equal(clean.image_url, 'https://example.com/a.jpg');
  assert.equal(clean.shopee_url, 'https://shopee.co.id');
});

test('isValidProductId accepts positive integers and UUIDs only', () => {
  assert.equal(isValidProductId('13'), true);
  assert.equal(isValidProductId(1), true);
  assert.equal(isValidProductId('550e8400-e29b-41d4-a716-446655440000'), true);
  assert.equal(isValidProductId('abc'), false);
  assert.equal(isValidProductId(''), false);
  assert.equal(isValidProductId('-1'), false);
});
