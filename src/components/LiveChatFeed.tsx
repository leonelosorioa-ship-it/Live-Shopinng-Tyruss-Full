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
      className="w-[calc(100%-108px)] max-w-[276px] pointer-events-auto"
    >
      <div
        ref={scrollRef}
        data-testid="live-chat-feed"
        className="max-h-[142px] overflow-y-auto no-scrollbar chat-mask flex flex-col gap-1.5 pr-1 pt-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`px-2.5 py-1.5 rounded-2xl text-[11px] leading-snug backdrop-blur-md border shadow-[0_2px_10px_rgba(15,23,42,0.08)] transition-all duration-200 ${
              msg.isHost
                ? 'bg-emerald-50/92 border-emerald-200/90 text-slate-800'
                : msg.isUser
                ? 'bg-sky-50/92 border-sky-200/90 text-slate-800'
                : 'bg-white/84 border-white/75 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`font-display font-bold text-[11px] ${
                  msg.isHost
                    ? 'text-emerald-800'
                    : msg.isUser
                    ? 'text-sky-800'
                    : 'text-slate-900'
                }`}
              >
                {msg.author}
              </span>
              {msg.isHost && (
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-px rounded bg-emerald-100 text-emerald-800">
                  Guía
                </span>
              )}
              {msg.city && (
                <span className="text-[10px] text-slate-500">· {msg.city}</span>
              )}
            </div>
            <p className="mt-0.5 text-slate-700 break-words">{msg.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
