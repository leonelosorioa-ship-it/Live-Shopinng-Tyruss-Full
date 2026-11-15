import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Sparkles, Volume2 } from 'lucide-react';
import {
  COMBO_OPTIONS,
  INITIAL_CHAT_MESSAGES,
  LIVE_SCENES,
  SIMULATED_CHAT_QUEUE,
  type ChatMessage,
} from './data/liveShopData';
import { LiveVideoStage } from './components/LiveVideoStage';
import { LiveHeader } from './components/LiveHeader';
import { FloatingProductCard } from './components/FloatingProductCard';
import { LiveChatFeed } from './components/LiveChatFeed';
import { LiveFooterBar, type FloatingHeartParticle } from './components/LiveFooterBar';
import { CheckoutModal, type ModalTab } from './components/CheckoutModal';
import { liveAudio } from './utils/liveAudio';

function getInitialAutostart(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('autostart') === '1';
}

export default function App() {
  const autostart = getInitialAutostart();
  const [audioActivated, setAudioActivated] = useState<boolean>(autostart);
  const [isMuted, setIsMuted] = useState<boolean>(!autostart);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);

  const [viewerCount, setViewerCount] = useState<number>(612);
  const [likesCount, setLikesCount] = useState<number>(4800);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeartParticle[]>([]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const chatCursorRef = useRef<number>(0);
  const heartIdRef = useRef<number>(1);

  const defaultCombo = COMBO_OPTIONS.find((c) => c.isDefault) ?? COMBO_OPTIONS[2];
  const [selectedComboId, setSelectedComboId] = useState<string>(defaultCombo.id);
  const [modalState, setModalState] = useState<{ open: boolean; tab: ModalTab }>({
    open: false,
    tab: 'checkout',
  });

  // Cambio automático de escenas en el stream en vivo cada 8 segundos
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSceneIndex((prev) => (prev + 1) % LIVE_SCENES.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, []);

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

  // Inyección automática de mensajes simulados de usuarias colombianas y Marié
  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextTemplate =
        SIMULATED_CHAT_QUEUE[chatCursorRef.current % SIMULATED_CHAT_QUEUE.length];
      chatCursorRef.current += 1;

      const newMessage: ChatMessage = {
        ...nextTemplate,
        id: `sim-${Date.now()}-${chatCursorRef.current}`,
        timestamp: 'Ahora',
      };

      setChatMessages((prev) => [...prev.slice(-18), newMessage]);
      if (!liveAudio.isMuted()) {
        liveAudio.playMessagePing();
      }
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  // Limpieza del controlador de audio al desmontar
  useEffect(() => {
    return () => {
      liveAudio.dispose();
    };
  }, []);

  const handleActivateAudio = useCallback(() => {
    setAudioActivated(true);
    setIsMuted(false);
    liveAudio.activate();
  }, []);

  const handleToggleMute = useCallback(() => {
    setAudioActivated(true);
    setIsMuted((prev) => {
      const nextMuted = !prev;
      liveAudio.setMuted(nextMuted);
      return nextMuted;
    });
  }, []);

  const handleLike = useCallback(() => {
    setLikesCount((prev) => prev + 1);
    liveAudio.playLikePop();

    const id = heartIdRef.current++;
    const driftX = Math.round((Math.random() - 0.5) * 28);
    const rotate = Math.round((Math.random() - 0.5) * 26);

    setFloatingHearts((prev) => [...prev.slice(-10), { id, driftX, rotate }]);
    window.setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((item) => item.id !== id));
    }, 1550);
  }, []);

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

  const selectedCombo =
    COMBO_OPTIONS.find((item) => item.id === selectedComboId) ?? defaultCombo;

  return (
    <main className="w-full h-[100dvh] bg-black flex items-center justify-center overflow-hidden">
      {/* Contenedor vertical estilo Smartphone (9:16), máx 430px */}
      <div className="relative w-full max-w-[430px] h-[100dvh] sm:h-[min(100dvh,880px)] sm:rounded-[28px] bg-black border border-white/12 shadow-[0_0_80px_rgba(6,182,212,0.14)] overflow-hidden flex flex-col justify-between">
        {/* Capa 1: Video / Escenario en vivo de fondo */}
        <LiveVideoStage
          activeSceneIndex={activeSceneIndex}
          onSelectScene={setActiveSceneIndex}
        />

        {/* Capa 2: Header Superior */}
        <LiveHeader
          viewerCount={viewerCount}
          likesCount={likesCount}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onLike={handleLike}
        />

        {/* Capa 3: Zona intermedia — Chat (inferior izquierdo) + Tarjeta de Producto (derecha) */}
        <div className="relative z-10 flex-1 flex items-end justify-between gap-2 px-3 pb-2 pointer-events-none">
          <LiveChatFeed messages={chatMessages} />

          <div className="pointer-events-auto shrink-0 self-end">
            <FloatingProductCard
              selectedCombo={selectedCombo}
              onOpenCheckout={() => setModalState({ open: true, tab: 'checkout' })}
              onOpenDetails={() => setModalState({ open: true, tab: 'details' })}
            />
          </div>
        </div>

        {/* Capa 4: Barra inferior de acciones (Thumb zone) */}
        <LiveFooterBar
          onOpenCheckout={() => setModalState({ open: true, tab: 'checkout' })}
          onSendComment={handleSendComment}
          onLike={handleLike}
          floatingHearts={floatingHearts}
        />

        {/* Capa flotante inicial para activar el sonido del Live (encima de tarjetas y chat) */}
        {!audioActivated && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/65 backdrop-blur-sm px-6">
            <button
              type="button"
              onClick={handleActivateAudio}
              data-testid="activate-audio-btn"
              className="group w-full max-w-[300px] flex flex-col items-center gap-3.5 p-6 rounded-3xl bg-zinc-950/95 border border-cyan-400/45 shadow-[0_24px_60px_rgba(0,0,0,0.9)] hover:border-cyan-300 active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
                <Volume2 className="w-7 h-7" />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center border-2 border-zinc-950">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </span>
              </div>

              <div className="text-center space-y-1.5">
                <p className="font-display text-[17px] font-bold text-white leading-snug text-balance">
                  Toca para activar el sonido del Live
                </p>
                <p className="text-xs text-zinc-300 leading-relaxed text-balance">
                  Marié está en vivo presentando{' '}
                  <span className="text-emerald-300 font-semibold">Tyruss Full</span> + App TyroFem 30D
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-slate-950 text-xs font-extrabold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Entrar al Live Shop
              </span>
            </button>
          </div>
        )}

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
