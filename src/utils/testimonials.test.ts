import test from 'node:test';
import assert from 'node:assert/strict';
import { CUSTOMER_TESTIMONIALS } from '../data/liveShopData';
import {
  TESTIMONIAL_HIDDEN_MS,
  TESTIMONIAL_INITIAL_DELAY_MS,
  TESTIMONIAL_VISIBLE_MS,
  getNextTestimonialIndex,
  getPrevTestimonialIndex,
} from './testimonials';

test('CUSTOMER_TESTIMONIALS provides valid customer profiles and quotes', () => {
  assert.ok(CUSTOMER_TESTIMONIALS.length >= 4);
  for (const item of CUSTOMER_TESTIMONIALS) {
    assert.ok(item.name.trim().length > 0);
    assert.ok(item.city.trim().length > 0);
    assert.ok(item.quote.trim().length > 15);
    assert.equal(item.rating, 5);
  }
});

test('getNextTestimonialIndex and getPrevTestimonialIndex wrap cyclically', () => {
  assert.equal(getNextTestimonialIndex(0, 4), 1);
  assert.equal(getNextTestimonialIndex(3, 4), 0);
  assert.equal(getPrevTestimonialIndex(0, 4), 3);
  assert.equal(getPrevTestimonialIndex(2, 4), 1);
  assert.equal(getNextTestimonialIndex(0, 0), 0);
});

test('cyclical timing constants keep positive reading and breathing intervals', () => {
  assert.ok(TESTIMONIAL_INITIAL_DELAY_MS > 0);
  assert.ok(TESTIMONIAL_VISIBLE_MS >= 4000);
  assert.ok(TESTIMONIAL_HIDDEN_MS >= 2000);
});
