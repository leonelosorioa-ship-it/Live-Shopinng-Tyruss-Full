/**
 * Sintetizador ligero de audio Web Audio API para retroalimentación
 * auditiva de transmisión en vivo sin dependencias externas.
 */
class LiveAudioController {
  private ctx: AudioContext | null = null;
  private ambientInterval: number | null = null;
  private muted = true;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public activate(): void {
    this.muted = false;
    const ctx = this.ensureContext();
    if (!ctx) return;
    this.playChime(523.25, 0.08, 0.14);
    window.setTimeout(() => this.playChime(659.25, 0.07, 0.18), 90);
    window.setTimeout(() => this.playChime(783.99, 0.06, 0.24), 180);
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (!muted) {
      this.ensureContext();
      this.playChime(587.33, 0.05, 0.12);
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public playLikePop(): void {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playMessagePing(): void {
    if (this.muted) return;
    this.playChime(698.46, 0.025, 0.09);
  }

  private playChime(freq: number, volume: number, duration: number): void {
    const ctx = this.ctx;
    if (!ctx || this.muted) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public dispose(): void {
    if (this.ambientInterval !== null) {
      window.clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }
}

export const liveAudio = new LiveAudioController();
