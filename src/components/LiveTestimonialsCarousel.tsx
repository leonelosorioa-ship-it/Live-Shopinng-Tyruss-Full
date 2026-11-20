import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronRight, Star } from 'lucide-react';
import {
  CUSTOMER_TESTIMONIALS,
  type CustomerTestimonial,
} from '../data/liveShopData';
import {
  TESTIMONIAL_HIDDEN_MS,
  TESTIMONIAL_INITIAL_DELAY_MS,
  TESTIMONIAL_VISIBLE_MS,
  getNextTestimonialIndex,
} from '../utils/testimonials';

import camilaAvatar from '../assets/images/cliente_camila_avatar_1795141193275.jpg';
import paolaAvatar from '../assets/images/cliente_paola_avatar_1795141193378.jpg';
import dianaAvatar from '../assets/images/cliente_diana_avatar_1795141192792.jpg';
import julianaAvatar from '../assets/images/cliente_juliana_avatar_1795141193848.jpg';

const AVATAR_BY_ID: Record<CustomerTestimonial['id'], string> = {
  camila: camilaAvatar,
  paola: paolaAvatar,
  diana: dianaAvatar,
  juliana: julianaAvatar,
};

interface LiveTestimonialsCarouselProps {
  paused?: boolean;
}

export function LiveTestimonialsCarousel({
  paused = false,
}: LiveTestimonialsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasShownFirst, setHasShownFirst] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const total = CUSTOMER_TESTIMONIALS.length;
  const activeTestimonial = CUSTOMER_TESTIMONIALS[activeIndex] ?? CUSTOMER_TESTIMONIALS[0];

  // Aparición cíclica sobre la zona del chat: visible -> pausa breve -> siguiente testimonio
  useEffect(() => {
    if (paused || isInteracting || total === 0) return;

    if (!hasShownFirst) {
      const initialTimer = window.setTimeout(() => {
        setHasShownFirst(true);
        setIsVisible(true);
      }, TESTIMONIAL_INITIAL_DELAY_MS);
      return () => window.clearTimeout(initialTimer);
    }

    if (isVisible) {
      const hideTimer = window.setTimeout(() => {
        setIsVisible(false);
      }, TESTIMONIAL_VISIBLE_MS);
      return () => window.clearTimeout(hideTimer);
    }

    const nextTimer = window.setTimeout(() => {
      setActiveIndex((prev) => getNextTestimonialIndex(prev, total));
      setIsVisible(true);
    }, TESTIMONIAL_HIDDEN_MS);

    return () => window.clearTimeout(nextTimer);
  }, [hasShownFirst, isInteracting, isVisible, paused, total, activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => getNextTestimonialIndex(prev, total));
    setHasShownFirst(true);
    setIsVisible(true);
  };

  if (paused || !isVisible || !activeTestimonial) {
    return null;
  }

  const avatarSrc = AVATAR_BY_ID[activeTestimonial.id];
  const hasImageError = Boolean(failedImages[activeTestimonial.id]);

  return (
    <aside
      aria-label="Testimonio verificado de clienta"
      data-testid="live-testimonial-carousel"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      className="w-[calc(100%-56px)] max-w-[312px] mb-1.5 pointer-events-auto"
    >
      <div
        key={activeTestimonial.id}
        data-testid="live-testimonial-card"
        className="animate-testimonial-in flex items-center gap-2.5 px-2.5 py-2 rounded-2xl bg-zinc-950/78 backdrop-blur-md border border-emerald-400/30 shadow-[0_8px_24px_rgba(0,0,0,0.42)]"
      >
        {/* Foto circular pequeña de la clienta con respaldo tipográfico */}
        <div className="relative shrink-0 w-9 h-9 rounded-full overflow-hidden ring-2 ring-emerald-400/65 bg-gradient-to-br from-emerald-900 to-cyan-950 flex items-center justify-center">
          {!hasImageError && avatarSrc ? (
            <img
              src={avatarSrc}
              alt={`Foto de ${activeTestimonial.name}`}
              referrerPolicy="no-referrer"
              onError={() =>
                setFailedImages((prev) => ({
                  ...prev,
                  [activeTestimonial.id]: true,
                }))
              }
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <span className="font-display text-[11px] font-bold text-emerald-200">
              {activeTestimonial.initials}
            </span>
          )}
        </div>

        {/* Contenido principal del testimonio */}
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center justify-between gap-2">
            <span
              data-testid="testimonial-customer-name"
              className="font-display text-[11.5px] font-bold text-white leading-tight truncate"
            >
              {activeTestimonial.name}
            </span>

            <div
              aria-label={`${activeTestimonial.rating} de 5 estrellas`}
              className="flex items-center gap-0.5 shrink-0"
            >
              {Array.from({ length: activeTestimonial.rating }).map((_, idx) => (
                <Star
                  key={idx}
                  className="w-2.5 h-2.5 text-amber-400 fill-amber-400"
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          <p
            data-testid="testimonial-customer-quote"
            className="text-[10.5px] text-white/95 leading-snug"
          >
            “{activeTestimonial.quote}”
          </p>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <span className="inline-flex items-center gap-1 text-[9.5px] font-medium text-emerald-300/95 truncate">
              <CheckCircle2 className="w-2.5 h-2.5 shrink-0 text-emerald-400" aria-hidden="true" />
              <span className="truncate">
                {activeTestimonial.city} · {activeTestimonial.verifiedLabel}
              </span>
            </span>

            {/* Indicadores compactos del carrusel */}
            <div
              aria-label={`Testimonio ${activeIndex + 1} de ${total}`}
              className="flex items-center gap-1 shrink-0"
            >
              {CUSTOMER_TESTIMONIALS.map((item, idx) => (
                <span
                  key={item.id}
                  aria-hidden="true"
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === activeIndex ? 'w-3 bg-emerald-400' : 'w-1 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Control discreto para avanzar manualmente al siguiente testimonio */}
        <button
          type="button"
          onClick={handleNext}
          data-testid="testimonial-next-btn"
          aria-label="Ver siguiente testimonio"
          className="shrink-0 inline-flex items-center justify-center w-7 h-7 -mr-1 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
