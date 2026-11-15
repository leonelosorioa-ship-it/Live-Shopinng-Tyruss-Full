import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSocialShareLinks, SHARE_COPY } from './share';

test('buildSocialShareLinks generates valid encoded URLs for all networks', () => {
  const testUrl = 'https://colshopi.example.com/live?ref=marie';
  const links = buildSocialShareLinks(testUrl);

  assert.ok(links.whatsapp.startsWith('https://wa.me/?text='));
  assert.ok(links.whatsapp.includes(encodeURIComponent(testUrl)));
  assert.ok(links.whatsapp.includes(encodeURIComponent(SHARE_COPY.message)));

  assert.ok(links.facebook.startsWith('https://www.facebook.com/sharer/sharer.php?u='));
  assert.ok(links.facebook.includes(encodeURIComponent(testUrl)));

  assert.ok(links.x.startsWith('https://twitter.com/intent/tweet?text='));
  assert.ok(links.x.includes(encodeURIComponent(testUrl)));

  assert.ok(links.telegram.startsWith('https://t.me/share/url?url='));
  assert.ok(links.telegram.includes(encodeURIComponent(testUrl)));
});
