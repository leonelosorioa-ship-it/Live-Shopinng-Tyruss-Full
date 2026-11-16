import test from 'node:test';
import assert from 'node:assert/strict';
import { META_PIXEL_ID, trackMetaPixelEvent } from './metaPixel.ts';

test('META_PIXEL_ID matches configured pixel ID', () => {
  assert.equal(META_PIXEL_ID, '249723086883097');
});

test('trackMetaPixelEvent invokes fbq with event name and COP parameters', () => {
  const calls: Array<{ command: string; event: string; params?: unknown }> = [];
  const mockFbq = (command: string, event: string, params?: unknown) => {
    calls.push({ command, event, params });
  };

  const tracked = trackMetaPixelEvent(
    'Purchase',
    { content_name: 'Pague 2 Lleve 3 Tarros', currency: 'COP', value: 179800, num_items: 1 },
    mockFbq
  );

  assert.equal(tracked, true);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0], {
    command: 'track',
    event: 'Purchase',
    params: {
      content_name: 'Pague 2 Lleve 3 Tarros',
      currency: 'COP',
      value: 179800,
      num_items: 1,
    },
  });
});

test('trackMetaPixelEvent returns false safely when fbq is blocked or throws', () => {
  assert.equal(trackMetaPixelEvent('InitiateCheckout', undefined, null), false);

  const throwingFbq = () => {
    throw new Error('Blocked by extension');
  };
  assert.equal(trackMetaPixelEvent('Lead', { currency: 'COP', value: 89900 }, throwingFbq), false);
});
