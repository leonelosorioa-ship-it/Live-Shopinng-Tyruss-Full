import { useEffect, useState, type RefObject } from 'react';
import { STORE_BRAND } from '../data/liveShopData';
import { computeRemainingSeconds } from '../utils/liveSession';

interface LiveVideoStageProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  isMuted: boolean;
  audioActivated: boolean;
  liveEnded: boolean;
  onVideoEnded: () => void;
  onTimeProgress?: (remainingSeconds: number | null, totalDurationSeconds?: number | null) => void;
}

export function LiveVideoStage({
  videoRef,
  isMuted,
  audioActivated,
  liveEnded,
  onVideoEnded,
  onTimeProgress,
}: LiveVideoStageProps) {
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (liveEnded) {
      video.pause();
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = Math.max(0, video.duration - 0.05);
      }
      onTimeProgress?.(0, Number.isFinite(video.duration) && video.duration > 0 ? video.duration : null);
      return;
    }

    video.muted = isMuted;
    if (video.paused) {
      video.play().catch(() => {
        // Algunos navegadores esperan interacción del usuario antes de reproducir con sonido
      });
    }
  }, [isMuted, liveEnded, onTimeProgress, videoRef]);

  const syncRemainingTime = () => {
    const video = videoRef.current;
    if (!video) return;
    const totalDuration =
      Number.isFinite(video.duration) && video.duration > 0 ? video.duration : null;
    onTimeProgress?.(
      computeRemainingSeconds(video.duration, video.currentTime, liveEnded, audioActivated),
      totalDuration
    );
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    if (liveEnded) {
      video.pause();
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = Math.max(0, video.duration - 0.05);
      }
    }
    syncRemainingTime();
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black select-none">
      {/* Resplandor ambiental de fondo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(16,185,129,0.18),rgba(6,182,212,0.08)_45%,rgba(0,0,0,0.95)_85%)]"
      />

      {videoError ? (
        <img
          src={STORE_BRAND.hostAvatar}
          alt="Marié presentando Tyruss Full en ColShopi Tienda"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top animate-live-camera"
        />
      ) : (
        <video
          ref={videoRef}
          data-testid="live-background-video"
          src={STORE_BRAND.liveVideoSrc}
          poster={STORE_BRAND.hostAvatar}
          autoPlay={!liveEnded}
          loop={!audioActivated && !liveEnded}
          playsInline
          preload="auto"
          muted={isMuted}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={syncRemainingTime}
          onEnded={() => {
            if (audioActivated) {
              const video = videoRef.current;
              const totalDuration =
                video && Number.isFinite(video.duration) && video.duration > 0
                  ? video.duration
                  : null;
              onTimeProgress?.(0, totalDuration);
              onVideoEnded();
            }
          }}
          onError={() => setVideoError(true)}
          aria-label="Transmisión en vivo de Marié presentando Tyruss Full en ColShopi Tienda"
          className="w-full h-full object-cover object-center"
        />
      )}

      {/* Degradados suaves solo en bordes superior e inferior para mantener legible la UI sobre el video */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/92 via-black/45 to-transparent pointer-events-none"
      />
    </div>
  );
}
