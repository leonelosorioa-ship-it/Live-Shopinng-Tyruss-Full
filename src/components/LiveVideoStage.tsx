import { useState } from 'react';
import { LIVE_SCENES, STORE_BRAND } from '../data/liveShopData';

interface LiveVideoStageProps {
  activeSceneIndex: number;
  onSelectScene: (index: number) => void;
}

export function LiveVideoStage({
  activeSceneIndex,
  onSelectScene,
}: LiveVideoStageProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const currentScene = LIVE_SCENES[activeSceneIndex] ?? LIVE_SCENES[0];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-950 select-none">
      {/* Resplandor ambiental sutil para tomas de producto */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(16,185,129,0.22),rgba(6,182,212,0.08)_45%,rgba(0,0,0,0.95)_85%)]"
      />

      {/* Capas visuales de transmisión en vivo en bucle */}
      {LIVE_SCENES.map((scene, index) => {
        const isActive = index === activeSceneIndex;
        const hasError = imageErrors[scene.id];

        return (
          <div
            key={scene.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out flex items-center justify-center ${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {hasError ? (
              <div className="w-full h-full bg-gradient-to-br from-emerald-950 via-zinc-900 to-cyan-950 flex items-center justify-center p-8 text-center">
                <p className="font-display text-lg font-semibold text-white/80">
                  {scene.speaker}
                </p>
              </div>
            ) : index === 0 ? (
              <img
                src={scene.imageSrc}
                alt={scene.imageAlt}
                referrerPolicy="no-referrer"
                onError={() => setImageErrors((prev) => ({ ...prev, [scene.id]: true }))}
                className="w-full h-full object-cover object-top animate-live-camera"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center px-6 pt-28 pb-44">
                <img
                  src={scene.imageSrc}
                  alt={scene.imageAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImageErrors((prev) => ({ ...prev, [scene.id]: true }))}
                  className="max-h-full w-auto object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.85)] animate-live-camera"
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Degradados de contraste para legibilidad de UI sobre video */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/95 via-black/55 to-transparent pointer-events-none"
      />

      {/* Placa corporativa y subtítulo en vivo de Marié */}
      <div className="absolute top-[88px] inset-x-3 z-10 flex flex-col gap-1.5 pointer-events-auto">
        <div className="px-3 py-2 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={STORE_BRAND.hostAvatar}
              alt={STORE_BRAND.hostName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover object-top border border-cyan-300/60 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-cyan-300 whitespace-nowrap">
                  {currentScene.speaker}
                </span>
                <span className="text-[10px] text-emerald-300 font-medium truncate">
                  {currentScene.highlight}
                </span>
              </div>
              <p className="text-[11.5px] leading-snug text-white/95 line-clamp-2 mt-0.5">
                {currentScene.caption}
              </p>
            </div>
          </div>
        </div>

        {/* Selector de tomas del Live */}
        <div
          className="flex items-center justify-center gap-1.5"
          role="tablist"
          aria-label="Escenas de la transmisión"
        >
          {LIVE_SCENES.map((scene, index) => {
            const active = index === activeSceneIndex;
            return (
              <button
                key={scene.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Ver escena ${index + 1}: ${scene.speaker}`}
                onClick={() => onSelectScene(index)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  active ? 'w-7 bg-cyan-400' : 'w-2 bg-white/35 hover:bg-white/60'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
