import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CART_DEMAND_CAPACITY,
  FINAL_URGENCY_STOCK,
  INITIAL_URGENCY_STOCK,
  LIVE_FINISHED_SESSION_KEY,
  canStartLiveVideo,
  computeCartDemandPercent,
  computeRemainingSeconds,
  formatCountdown,
  formatRemainingProductsLabel,
  getNextUrgencyDelayMs,
  hasFinishedLiveInSession,
  markLiveFinishedInSession,
  nextCartDemandCount,
  nextUrgencyStockCount,
} from './liveSession.ts';

function createMemoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  };
}

test('hasFinishedLiveInSession returns false for fresh session and true after markLiveFinishedInSession', () => {
  const storage = createMemoryStorage();
  assert.equal(hasFinishedLiveInSession(storage), false);
  assert.equal(canStartLiveVideo(false), true);

  const saved = markLiveFinishedInSession(storage);
  assert.equal(saved, true);
  assert.equal(storage.getItem(LIVE_FINISHED_SESSION_KEY), '1');
  assert.equal(hasFinishedLiveInSession(storage), true);
  assert.equal(canStartLiveVideo(true), false);
});

test('liveSession helpers handle null or throwing storage gracefully', () => {
  assert.equal(hasFinishedLiveInSession(null), false);
  assert.equal(markLiveFinishedInSession(null), false);

  const throwingStorage = {
    getItem() {
      throw new Error('Blocked');
    },
    setItem() {
      throw new Error('Blocked');
    },
  };

  assert.equal(hasFinishedLiveInSession(throwingStorage), false);
  assert.equal(markLiveFinishedInSession(throwingStorage), false);
});

test('computeRemainingSeconds and formatCountdown compute accurate MM:SS values', () => {
  assert.equal(computeRemainingSeconds(NaN, 0, false, true), null);
  assert.equal(computeRemainingSeconds(65.2, 20, false, false), 66);
  assert.equal(computeRemainingSeconds(65.2, 5.4, false, true), 60);
  assert.equal(computeRemainingSeconds(65.2, 70, false, true), 0);
  assert.equal(computeRemainingSeconds(65.2, 10, true, true), 0);

  assert.equal(formatCountdown(0), '00:00');
  assert.equal(formatCountdown(9), '00:09');
  assert.equal(formatCountdown(65), '01:05');
  assert.equal(formatCountdown(125), '02:05');
});

test('computeCartDemandPercent and nextCartDemandCount calculate and cap live demand cleanly', () => {
  assert.equal(computeCartDemandPercent(72, CART_DEMAND_CAPACITY), 72);
  assert.equal(computeCartDemandPercent(-5, 100), 0);
  assert.equal(computeCartDemandPercent(150, 100), 100);
  assert.equal(computeCartDemandPercent(10, 0), 0);

  assert.equal(nextCartDemandCount(72, 100), 73);
  assert.equal(nextCartDemandCount(97, 100), 97);
  assert.equal(nextCartDemandCount(99, 100), 97);
});

test('urgency stock countdown starts at 125, decreases with live pacing, and finishes at 16', () => {
  assert.equal(INITIAL_URGENCY_STOCK, 125);
  assert.equal(FINAL_URGENCY_STOCK, 16);
  assert.equal(formatRemainingProductsLabel(INITIAL_URGENCY_STOCK), 'Últimos 125 productos');
  assert.equal(formatRemainingProductsLabel(FINAL_URGENCY_STOCK), 'Últimos 16 productos');
  assert.equal(formatRemainingProductsLabel(1), 'Último 1 producto');

  assert.equal(nextUrgencyStockCount(125, 0.2), 124);
  assert.equal(nextUrgencyStockCount(125, 0.85), 123);
  assert.equal(nextUrgencyStockCount(FINAL_URGENCY_STOCK + 1, 0.9), FINAL_URGENCY_STOCK);
  assert.equal(nextUrgencyStockCount(FINAL_URGENCY_STOCK, 0.5), FINAL_URGENCY_STOCK);
  assert.equal(nextUrgencyStockCount(22, 0.5, 2, 380, false), FINAL_URGENCY_STOCK);
  assert.equal(nextUrgencyStockCount(30, 0.5, 100, 380, true), FINAL_URGENCY_STOCK);

  assert.equal(getNextUrgencyDelayMs(0), 2500);
  assert.equal(getNextUrgencyDelayMs(1), 5500);
});
