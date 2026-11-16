export const LIVE_FINISHED_SESSION_KEY = 'colshopi_live_finished_v1';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

function resolveSessionStorage(customStorage?: StorageLike | null): StorageLike | null {
  if (customStorage !== undefined) return customStorage;
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Verifica si la usuaria ya vio el Live completo hasta el final en la sesión actual.
 */
export function hasFinishedLiveInSession(customStorage?: StorageLike | null): boolean {
  const storage = resolveSessionStorage(customStorage);
  if (!storage) return false;
  try {
    return storage.getItem(LIVE_FINISHED_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Marca en sessionStorage que el Live ya finalizó en la sesión actual para evitar que reinicie desde cero.
 */
export function markLiveFinishedInSession(customStorage?: StorageLike | null): boolean {
  const storage = resolveSessionStorage(customStorage);
  if (!storage) return false;
  try {
    storage.setItem(LIVE_FINISHED_SESSION_KEY, '1');
    return true;
  } catch {
    return false;
  }
}

/**
 * Determina si el video puede reproducirse o debe permanecer en el estado finalizado.
 */
export function canStartLiveVideo(liveEnded: boolean): boolean {
  return !liveEnded;
}

/**
 * Calcula los segundos restantes reales de la transmisión en vivo.
 */
export function computeRemainingSeconds(
  duration: number,
  currentTime: number,
  liveEnded: boolean,
  audioActivated = true
): number | null {
  if (liveEnded) return 0;
  if (!Number.isFinite(duration) || duration <= 0) return null;
  if (!audioActivated) {
    return Math.max(0, Math.ceil(duration));
  }
  const safeCurrent = Number.isFinite(currentTime) && currentTime > 0 ? currentTime : 0;
  return Math.max(0, Math.ceil(duration - safeCurrent));
}

/**
 * Formatea segundos en MM:SS para mostrar la cuenta atrás del Live.
 */
export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const CART_DEMAND_CAPACITY = 100;

/**
 * Calcula el porcentaje (0-100) de llenado de la barra de demanda según personas que agregaron al carrito.
 */
export function computeCartDemandPercent(
  count: number,
  capacity = CART_DEMAND_CAPACITY
): number {
  if (!Number.isFinite(count) || !Number.isFinite(capacity) || capacity <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((count / capacity) * 100)));
}

/**
 * Incrementa dinámicamente el conteo de personas que agregaron productos sin agotar visualmente el stock.
 */
export function nextCartDemandCount(
  current: number,
  capacity = CART_DEMAND_CAPACITY
): number {
  const cap = Math.max(1, capacity - 3);
  if (!Number.isFinite(current) || current < 0) return 1;
  return Math.min(cap, Math.floor(current) + 1);
}

export const INITIAL_URGENCY_STOCK = 125;
export const FINAL_URGENCY_STOCK = 16;

/**
 * Calcula el inventario esperado según el progreso del Live (de 125 a 16 unidades)
 * y aplica una caída orgánica de 1 a 3 unidades sin retroceder ni bajar de 16.
 */
export function nextUrgencyStockCount(
  current: number,
  randomValue = Math.random(),
  remainingSeconds: number | null = null,
  totalDurationSeconds: number | null = null,
  liveEnded = false
): number {
  if (liveEnded) return FINAL_URGENCY_STOCK;
  if (!Number.isFinite(current) || current <= 0) return INITIAL_URGENCY_STOCK;

  const safeCurrent = Math.min(
    INITIAL_URGENCY_STOCK,
    Math.max(FINAL_URGENCY_STOCK, Math.floor(current))
  );
  if (safeCurrent <= FINAL_URGENCY_STOCK) return FINAL_URGENCY_STOCK;

  if (
    remainingSeconds !== null &&
    totalDurationSeconds !== null &&
    Number.isFinite(remainingSeconds) &&
    Number.isFinite(totalDurationSeconds) &&
    totalDurationSeconds > 0
  ) {
    if (remainingSeconds <= 3) return FINAL_URGENCY_STOCK;

    const progress = Math.min(
      1,
      Math.max(0, (totalDurationSeconds - remainingSeconds) / totalDurationSeconds)
    );
    const span = INITIAL_URGENCY_STOCK - FINAL_URGENCY_STOCK;
    const paceTarget = Math.round(INITIAL_URGENCY_STOCK - span * progress);

    if (safeCurrent > paceTarget + 2) {
      const catchUpStep = randomValue >= 0.5 ? 3 : 2;
      return Math.max(FINAL_URGENCY_STOCK, safeCurrent - catchUpStep);
    }
    if (safeCurrent < paceTarget - 2) {
      return safeCurrent;
    }
  }

  const step = randomValue >= 0.72 ? 2 : 1;
  return Math.max(FINAL_URGENCY_STOCK, safeCurrent - step);
}

/**
 * Calcula un intervalo aleatorio realista (entre 2.5s y 5.5s) para reflejar ritmo continuo de ventas en vivo.
 */
export function getNextUrgencyDelayMs(randomValue = Math.random()): number {
  const clamped = Number.isFinite(randomValue) ? Math.min(1, Math.max(0, randomValue)) : 0.5;
  return 2500 + Math.round(clamped * 3000);
}

/**
 * Formatea la etiqueta dinámica de urgencia sobre el botón de compra.
 */
export function formatRemainingProductsLabel(count: number): string {
  const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : INITIAL_URGENCY_STOCK;
  return safeCount === 1 ? 'Último 1 producto' : `Últimos ${safeCount} productos`;
}
