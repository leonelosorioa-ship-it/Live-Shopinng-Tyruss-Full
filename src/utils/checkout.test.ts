import test from 'node:test';
import assert from 'node:assert/strict';
import { BATIDO_VERDE_ADDON, COMBO_OPTIONS, STORE_BRAND } from '../data/liveShopData';
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  calculateOrderTotal,
  formatCOP,
  formatLikesCount,
  getComboSavings,
  validateCheckoutForm,
} from './checkout';

test('formatCOP formats Colombian pesos with dot separators', () => {
  assert.equal(formatCOP(89900), '$89.900');
  assert.equal(formatCOP(134850), '$134.850');
  assert.equal(formatCOP(179800), '$179.800');
  assert.equal(formatCOP(269700), '$269.700');
});

test('formatLikesCount formats compact thousands cleanly', () => {
  assert.equal(formatLikesCount(842), '842');
  assert.equal(formatLikesCount(4800), '4.8K');
  assert.equal(formatLikesCount(4860), '4.9K');
  assert.equal(formatLikesCount(5000), '5K');
});

test('getComboSavings calculates discount vs compareAtPrice', () => {
  const single = COMBO_OPTIONS[0];
  const threePack = COMBO_OPTIONS[2];
  const fivePack = COMBO_OPTIONS[3];

  assert.equal(getComboSavings(single), 0);
  assert.equal(getComboSavings(threePack), 89900);
  assert.equal(getComboSavings(fivePack), 179800);
});

test('validateCheckoutForm rejects empty and invalid inputs', () => {
  const errors = validateCheckoutForm({
    fullName: 'Al',
    phone: '12345',
    city: '',
    address: 'Cll',
  });

  assert.ok(errors.fullName);
  assert.ok(errors.phone);
  assert.ok(errors.city);
  assert.ok(errors.address);
});

test('validateCheckoutForm passes for valid Colombian shipping details', () => {
  const errors = validateCheckoutForm({
    fullName: 'Laura Gómez',
    phone: '300 123 4567',
    city: 'Medellín',
    address: 'Cra 43A # 1-50, El Poblado',
  });

  assert.deepEqual(errors, {});
});

test('buildWhatsAppOrderMessage includes combo, price, TyroFem bonus, and customer data', () => {
  const vipCombo = COMBO_OPTIONS[3];
  const message = buildWhatsAppOrderMessage(vipCombo, {
    fullName: 'Laura Gómez',
    phone: '3001234567',
    city: 'Medellín',
    address: 'Cra 43A # 1-50, El Poblado',
  });

  assert.match(message, /ColShopi Tienda/i);
  assert.match(message, /Pague 3 Lleve 5 Tarros/);
  assert.match(message, /Loción Térmica \(Obsequio\)/);
  assert.match(message, /\$269\.700 COP/);
  assert.match(message, /App TyroFem 30D VIP/);
  assert.match(message, /Laura Gómez/);
  assert.match(message, /3001234567/);
  assert.match(message, /Medellín/);
  assert.match(message, /Cra 43A # 1-50, El Poblado/);

  const url = buildWhatsAppUrl(STORE_BRAND.whatsappNumber, message);
  assert.ok(url.startsWith('https://wa.me/573235700653?text='));
  assert.ok(url.includes(encodeURIComponent('Laura Gómez')));
});

test('calculateOrderTotal and WhatsApp message include optional Batido Verde when selected', () => {
  const combo = COMBO_OPTIONS[2]; // $179.800
  assert.equal(calculateOrderTotal(combo, false), 179800);
  assert.equal(calculateOrderTotal(combo, true), 179800 + BATIDO_VERDE_ADDON.price);

  const messageWithAddon = buildWhatsAppOrderMessage(
    combo,
    {
      fullName: 'Laura Gómez',
      phone: '3001234567',
      city: 'Medellín',
      address: 'Cra 43A # 1-50, El Poblado',
    },
    true
  );

  assert.match(messageWithAddon, /Loción Térmica \(Obsequio\)/);
  assert.match(messageWithAddon, /Batido Verde \(Linazamix\)/);
  assert.match(messageWithAddon, /\$194\.800 COP/);
});
