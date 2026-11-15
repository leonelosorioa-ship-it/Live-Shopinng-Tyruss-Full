import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../data/liveShopData';

interface LiveChatFeedProps {
  messages: ChatMessage[];
}

export function LiveChatFeed({ messages }: LiveChatFeedProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <section
      aria-label="Chat en vivo de compradoras"
      className="w-[calc(100%-130px)] max-w-[280px] pointer-events-auto"
    >
      <div
        ref={scrollRef}
        data-testid="live-chat-feed"
        className="max-h-[172px] overflow-y-auto no-scrollbar chat-mask flex flex-col gap-1.5 pr-1 pt-5"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`px-2.5 py-1.5 rounded-2xl text-[11.5px] leading-snug backdrop-blur-md border transition-all duration-200 ${
              msg.isHost
                ? 'bg-emerald-950/80 border-emerald-400/35 text-emerald-50'
                : msg.isUser
                ? 'bg-cyan-950/85 border-cyan-400/45 text-white'
                : 'bg-black/55 border-white/10 text-zinc-100'
            }`}
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`font-display font-bold text-[11px] ${
                  msg.isHost
                    ? 'text-emerald-300'
                    : msg.isUser
                    ? 'text-cyan-300'
                    : 'text-amber-300'
                }`}
              >
                {msg.author}
              </span>
              {msg.isHost && (
                <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-px rounded bg-emerald-400/20 text-emerald-200">
                  Guía
                </span>
              )}
              {msg.city && (
                <span className="text-[10px] text-zinc-400">· {msg.city}</span>
              )}
            </div>
            <p className="mt-0.5 text-white/95 break-words">{msg.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
