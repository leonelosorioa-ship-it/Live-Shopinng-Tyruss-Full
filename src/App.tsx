import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';
import {
  COMBO_OPTIONS,
  INITIAL_CHAT_MESSAGES,
  SIMULATED_CHAT_QUEUE,
  type ChatMessage,
} from './data/liveShopData';
import { LiveVideoStage } from './components/LiveVideoStage';
import { LiveHeader } from './components/LiveHeader';
import { LiveChatFeed } from './components/LiveChatFeed';
import { LiveFooterBar, type FloatingHeartParticle } from './components/LiveFooterBar';
import { CheckoutModal, type ModalTab } from './components/CheckoutModal';
import { ShareModal } from './components/ShareModal';
import { LiveEndedOverlay } from './components/LiveEndedOverlay';
import { liveAudio } from './utils/liveAudio';
import {
  FINAL_URGENCY_STOCK,
  INITIAL_URGENCY_STOCK,
  canStartLiveVideo,
  getNextUrgencyDelayMs,
  hasFinishedLiveInSession,
  markLiveFinishedInSession,
  nextCartDemandCount,
  nextUrgencyStockCount,
} from './utils/liveSession';
import { trackMetaPixelEvent } from './utils/metaPixel';

function getInitialAutostart(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('autostart') === '1';
}

export default function App() {
  const autostart = getInitialAutostart();
  const [liveEnded, setLiveEnded] = useState<boolean>(() => hasFinishedLiveInSession());
  const [audioActivated, setAudioActivated] = useState<boolean>(() =>
    hasFinishedLiveInSession() ? true : autostart
  );
  const [isMuted, setIsMuted] = useState<boolean>(() =>
    hasFinishedLiveInSession() ? true : !autostart
  );
  const [entryStage, setEntryStage] = useState<'connecting' | 'sound'>('connecting');

  const [viewerCount, setViewerCount] = useState<number>(612);
  const [likesCount, setLikesCount] = useState<number>(4844);
  const [cartDemandCount, setCartDemandCount] = useState<number>(72);
  const [remainingProducts, setRemainingProducts] = useState<number>(() =>
    hasFinishedLiveInSession() ? FINAL_URGENCY_STOCK : INITIAL_URGENCY_STOCK
  );
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeartParticle[]>([]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const chatCursorRef = useRef<number>(0);
  const heartIdRef = useRef<number>(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remainingSecondsRef = useRef<number | null>(null);
  const videoDurationRef = useRef<number | null>(null);

  const defaultCombo = COMBO_OPTIONS.find((c) => c.isDefault) ?? COMBO_OPTIONS[2];
  const [selectedComboId, setSelectedComboId] = useState<string>(defaultCombo.id);
  const [modalState, setModalState] = useState<{ open: boolean; tab: ModalTab }>({
    open: false,
    tab: 'checkout',
  });
  const [shareOpen, setShareOpen] = useState<boolean>(false);

  // Evitar aviso de instalación de app y facilitar colapso de barra URL en móvil sin Fullscreen API
  useEffect(() => {
    const preventInstallPrompt = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener('beforeinstallprompt', preventInstallPrompt);

    if (window.innerWidth <= 639 && window.matchMedia('(pointer: coarse)').matches) {
      window.setTimeout(() => window.scrollTo(0, 64), 90);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', preventInstallPrompt);
    };
  }, []);

  // Secuencia inicial: 4 segundos en "Conectando al Live" y luego botón rápido de sonido
  useEffect(() => {
    if (audioActivated || liveEnded) return;
    setEntryStage('connecting');
    const timer = window.setTimeout(() => {
      setEntryStage('sound');
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [audioActivated, liveEnded]);

  // Variación realista del número de espectadores en vivo
  useEffect(() => {
    const timer = window.setInterval(() => {
      setViewerCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(648, Math.max(598, prev + delta));
      });
    }, 3600);
    return () => window.clearInterval(timer);
  }, []);

  // Incremento orgánico de personas agregando productos al carrito durante el Live
  useEffect(() => {
    if (liveEnded) return;
    const timer = window.setInterval(() => {
      setCartDemandCount((prev) => nextCartDemandCount(prev));
    }, 8500);
    return () => window.clearInterval(timer);
  }, [liveEnded]);

  // Reducción aleatoria de unidades disponibles (de 125 a 16 al terminar el Live)
  useEffect(() => {
    if (liveEnded) {
      setRemainingProducts(FINAL_URGENCY_STOCK);
      return;
    }
    if (!audioActivated) return;

    let timerId: number | undefined;
    let cancelled = false;

    const scheduleDecrement = () => {
      timerId = window.setTimeout(() => {
        if (cancelled) return;
        setRemainingProducts((prev) =>
          nextUrgencyStockCount(
            prev,
            Math.random(),
            remainingSecondsRef.current,
            videoDurationRef.current,
            false
          )
        );
        scheduleDecrement();
      }, getNextUrgencyDelayMs());
    };

    scheduleDecrement();

    return () => {
      cancelled = true;
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [audioActivated, liveEnded]);

  const spawnFloatingHeart = useCallback(
    (isSimulated = false, forcedKind?: 'heart' | 'like') => {
      setLikesCount((prev) => prev + 1);
      if (!isSimulated) {
        liveAudio.playLikePop();
      }

      const heartPalette = ['text-rose-500', 'text-pink-400', 'text-fuchsia-400', 'text-red-500'];
      const likePalette = ['text-cyan-300', 'text-sky-400'];
      const id = heartIdRef.current++;
      const kind: 'heart' | 'like' =
        forcedKind ?? (isSimulated && id % 4 === 0 ? 'like' : 'heart');
      const driftX = Math.round(Math.random() * 38 - 28);
      const rotate = Math.round((Math.random() - 0.5) * 22);
      const colorClass =
        kind === 'like'
          ? likePalette[id % likePalette.length]
          : heartPalette[id % heartPalette.length];

      setFloatingHearts((prev) => [...prev.slice(-8), { id, driftX, rotate, colorClass, kind }]);
      window.setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((item) => item.id !== id));
      }, 2450);
    },
    []
  );

  // Simulación orgánica y moderada de corazones y "Me gusta" de otras mujeres viendo el Live
  useEffect(() => {
    if (liveEnded) return;
    let nextTimer: number | undefined;
    let followUpTimer: number | undefined;
    let cancelled = false;

    const scheduleNext = (delayMs: number) => {
      nextTimer = window.setTimeout(() => {
        if (cancelled) return;
        spawnFloatingHeart(true);
        if (Math.random() < 0.2) {
          followUpTimer = window.setTimeout(() => {
            if (!cancelled) spawnFloatingHeart(true);
          }, 380);
        }
        const organicDelay = 1600 + Math.round(Math.random() * 1300);
        scheduleNext(organicDelay);
      }, delayMs);
    };

    scheduleNext(950);

    return () => {
      cancelled = true;
      if (nextTimer !== undefined) window.clearTimeout(nextTimer);
      if (followUpTimer !== undefined) window.clearTimeout(followUpTimer);
    };
  }, [liveEnded, spawnFloatingHeart]);

  // Inyección inmediata y orgánica de mensajes para mostrar actividad en vivo desde los primeros segundos
  useEffect(() => {
    if (liveEnded) return;
    let timerId: number | undefined;
    let cancelled = false;
    let step = 0;

    const scheduleNextComment = () => {
      const delayMs =
        step === 0
          ? 1300
          : step === 1
          ? 1700
          : step === 2
          ? 2200
          : 5500 + Math.round(Math.random() * 2500);

      timerId = window.setTimeout(() => {
        if (cancelled) return;
        const nextTemplate =
          SIMULATED_CHAT_QUEUE[chatCursorRef.current % SIMULATED_CHAT_QUEUE.length];
        chatCursorRef.current += 1;
        step += 1;

        const newMessage: ChatMessage = {
          ...nextTemplate,
          id: `sim-${Date.now()}-${chatCursorRef.current}`,
          timestamp: 'Ahora',
        };

        setChatMessages((prev) => [...prev.slice(-18), newMessage]);
        scheduleNextComment();
      }, delayMs);
    };

    scheduleNextComment();

    return () => {
      cancelled = true;
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [liveEnded]);

  // Limpieza del controlador de audio al desmontar
  useEffect(() => {
    return () => {
      liveAudio.dispose();
    };
  }, []);

  const handleTimeProgress = useCallback(
    (remaining: number | null, totalDuration: number | null = null) => {
      setRemainingSeconds(remaining);
      remainingSecondsRef.current = remaining;
      if (totalDuration !== null && Number.isFinite(totalDuration) && totalDuration > 0) {
        videoDurationRef.current = totalDuration;
      }
      if (audioActivated && !liveEnded && remaining !== null && remaining <= 3) {
        setRemainingProducts(FINAL_URGENCY_STOCK);
      }
    },
    [audioActivated, liveEnded]
  );

  const handleVideoEnded = useCallback(() => {
    markLiveFinishedInSession();
    setRemainingProducts(FINAL_URGENCY_STOCK);
    setLiveEnded(true);
  }, []);

  const handleActivateAudio = useCallback(() => {
    if (!canStartLiveVideo(liveEnded)) return;

    setAudioActivated(true);
    setIsMuted(false);
    liveAudio.setMuted(false);
    trackMetaPixelEvent('ViewContent', {
      content_name: 'Tyruss Full 500g Live Shop',
      content_category: 'Live Shopping',
      currency: 'COP',
      value: defaultCombo.price,
    });

    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.currentTime = 0;
      video.play().catch(() => {
        // Si el navegador exige mute para reproducir, mantener reproducción silenciada
        video.muted = true;
        setIsMuted(true);
        void video.play().catch(() => {});
      });
    }

    if (
      typeof window !== 'undefined' &&
      window.innerWidth <= 639 &&
      window.matchMedia('(pointer: coarse)').matches
    ) {
      window.scrollTo({ top: 64, behavior: 'smooth' });
    }
  }, [defaultCombo.price, liveEnded]);

  const handleToggleMute = useCallback(() => {
    if (!canStartLiveVideo(liveEnded)) return;
    setAudioActivated(true);
    setIsMuted((prev) => {
      const nextMuted = !prev;
      liveAudio.setMuted(nextMuted);

      const video = videoRef.current;
      if (video) {
        video.muted = nextMuted;
        if (video.paused) {
          void video.play().catch(() => {});
        }
      }

      return nextMuted;
    });
  }, [liveEnded]);

  const handleLike = useCallback(
    (kind: 'heart' | 'like' = 'heart') => {
      spawnFloatingHeart(false, kind);
    },
    [spawnFloatingHeart]
  );

  const handleSendComment = useCallback((text: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      author: 'Tú',
      text,
      isUser: true,
      timestamp: 'Ahora',
    };
    setChatMessages((prev) => [...prev.slice(-18), userMessage]);

    // Respuesta automática contextual de Marié para preguntas del espectador
    const lower = text.toLowerCase();
    let replyText =
      '¡Gracias por conectarte! Toca "Comprar Tyruss Full + App Gratis" abajo para pedir tu combo con envío nacional.';
    if (lower.includes('precio') || lower.includes('vale') || lower.includes('cuesta')) {
      replyText =
        'Desde $89.900 (1 tarro) y el favorito Pague 2 Lleve 3 Tarros en $179.800 con App TyroFem 30D gratis.';
    } else if (lower.includes('env') || lower.includes('contra') || lower.includes('ciudad') || lower.includes('medell') || lower.includes('bogot')) {
      replyText =
        '¡Sí! Hacemos envíos a toda Colombia y manejamos pago contra entrega en la mayoría de ciudades.';
    } else if (lower.includes('app') || lower.includes('tyrofem')) {
      replyText =
        'Con cualquier combo recibes acceso 100% gratis a la App TyroFem 30D apenas confirmas tu pedido por WhatsApp.';
    }

    window.setTimeout(() => {
      setChatMessages((prev) => [
        ...prev.slice(-18),
        {
          id: `host-reply-${Date.now()}`,
          author: 'Marié',
          text: replyText,
          isHost: true,
          timestamp: 'Ahora',
        },
      ]);
    }, 1100);
  }, []);

  return (
    <main className="sticky top-0 w-full h-[100dvh] bg-black flex items-center justify-center overflow-hidden">
      {/* Contenedor a pantalla completa en móvil (edge-to-edge) y marco 9:16 en escritorio */}
      <div className="relative w-full max-w-none sm:max-w-[430px] h-[100dvh] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-black overflow-hidden flex flex-col justify-between rounded-none border-0 sm:rounded-[24px] sm:border sm:border-white/12 sm:shadow-[0_0_80px_rgba(6,182,212,0.14)]">
        {/* Capa 1: Video de fondo de la transmisión en vivo */}
        <LiveVideoStage
          videoRef={videoRef}
          isMuted={isMuted}
          audioActivated={audioActivated}
          liveEnded={liveEnded}
          onVideoEnded={handleVideoEnded}
          onTimeProgress={handleTimeProgress}
        />

        {/* Capa 2: Header Superior */}
        <LiveHeader
          viewerCount={viewerCount}
          likesCount={likesCount}
          isMuted={isMuted}
          liveEnded={liveEnded}
          remainingSeconds={remainingSeconds}
          onToggleMute={handleToggleMute}
          onLike={handleLike}
        />

        {/* Capa 3: Zona intermedia — Aviso flotante ligero sobre el video claro + Chat en vivo */}
        <div
          onClick={
            !audioActivated && !liveEnded
              ? (e) => {
                  if (e.target === e.currentTarget) handleActivateAudio();
                }
              : undefined
          }
          className={`relative z-10 flex-1 flex flex-col justify-end px-3 pb-2 ${
            !audioActivated && !liveEnded ? 'cursor-pointer' : 'pointer-events-none'
          }`}
        >
          {!audioActivated && !liveEnded && (
            <div className="flex-1 flex items-center justify-center px-3 pointer-events-none">
              {entryStage === 'connecting' ? (
                <div key="connecting-stage" className="animate-prompt-in">
                  <button
                    type="button"
                    onClick={handleActivateAudio}
                    data-testid="connecting-live-pill"
                    className="pointer-events-auto max-w-[300px] px-5 py-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 shadow-[0_8px_28px_rgba(0,0,0,0.38)] text-center space-y-1 cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <p className="inline-flex items-center justify-center gap-2 font-display text-[14px] font-bold text-white leading-tight">
                      <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-85" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                      </span>
                      <span>Conectando al Live</span>
                    </p>
                    <p className="text-[12px] text-white/90 leading-snug">
                      Marié está en vivo presentando Tyruss Full
                    </p>
                  </button>
                </div>
              ) : (
                <div key="sound-stage" className="animate-prompt-in">
                  <button
                    type="button"
                    onClick={handleActivateAudio}
                    data-testid="activate-audio-btn"
                    className="pointer-events-auto min-h-[46px] inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-full bg-black/60 hover:bg-black/72 backdrop-blur-md border border-white/25 text-white font-display text-[14px] font-semibold tracking-tight whitespace-nowrap shadow-[0_10px_28px_rgba(0,0,0,0.42)] active:scale-[0.97] transition-all cursor-pointer animate-cta-pulse"
                  >
                    <Volume2 className="w-5 h-5 text-white shrink-0" aria-hidden="true" />
                    <span>Toca para activar el sonido</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <LiveChatFeed messages={chatMessages} />
        </div>

        {/* Capa 4: Barra inferior de acciones (Thumb zone) */}
        <LiveFooterBar
          onOpenCheckout={() => {
            setCartDemandCount((prev) => nextCartDemandCount(prev));
            const activeCombo =
              COMBO_OPTIONS.find((item) => item.id === selectedComboId) ?? defaultCombo;
            trackMetaPixelEvent('InitiateCheckout', {
              content_name: activeCombo.title,
              currency: 'COP',
              value: activeCombo.price,
              num_items: 1,
            });
            setModalState({ open: true, tab: 'checkout' });
          }}
          onOpenShare={() => setShareOpen(true)}
          onSendComment={handleSendComment}
          onLike={handleLike}
          floatingHearts={floatingHearts}
          cartDemandCount={cartDemandCount}
          remainingProducts={remainingProducts}
        />

        {/* Aviso de llamado a la acción al finalizar el Live (sin reiniciar el video desde cero) */}
        {liveEnded && (
          <LiveEndedOverlay
            remainingProducts={remainingProducts}
            onOpenCheckout={() => {
              const activeCombo =
                COMBO_OPTIONS.find((item) => item.id === selectedComboId) ?? defaultCombo;
              trackMetaPixelEvent('InitiateCheckout', {
                content_name: activeCombo.title,
                currency: 'COP',
                value: activeCombo.price,
                num_items: 1,
              });
              setModalState({ open: true, tab: 'checkout' });
            }}
          />
        )}

        {/* Modal para compartir en WhatsApp y redes sociales */}
        <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />

        {/* Modal de Checkout, Combos e Ingredientes */}
        <CheckoutModal
          isOpen={modalState.open}
          initialTab={modalState.tab}
          selectedComboId={selectedComboId}
          onSelectCombo={setSelectedComboId}
          onClose={() => setModalState((prev) => ({ ...prev, open: false }))}
        />
      </div>
    </main>
  );
}
