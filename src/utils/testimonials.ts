export const TESTIMONIAL_INITIAL_DELAY_MS = 1600;
export const TESTIMONIAL_VISIBLE_MS = 6500;
export const TESTIMONIAL_HIDDEN_MS = 4000;

export function getNextTestimonialIndex(currentIndex: number, total: number): number {
  if (total <= 0) return 0;
  const safeCurrent = ((Math.floor(currentIndex) % total) + total) % total;
  return (safeCurrent + 1) % total;
}

export function getPrevTestimonialIndex(currentIndex: number, total: number): number {
  if (total <= 0) return 0;
  const safeCurrent = ((Math.floor(currentIndex) % total) + total) % total;
  return (safeCurrent - 1 + total) % total;
}
