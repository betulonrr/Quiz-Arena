/* ============================================================
   Quiz Arena — sound.js
   Web Audio API ile ses efektleri ve arka plan müziği
   Emoji veya harici dosya gerektirmez; tamamen algoritmik
   ============================================================ */

const SoundSystem = (() => {
  /* --- Dahili durum --- */
  let ctx       = null;   // AudioContext (lazy init)
  let soundOn   = true;   // Ses efektleri açık mı?
  let musicOn   = false;  // Arka plan müziği açık mı?
  let musicTimer = null;  // Müzik döngüsü zamanlayıcısı
  let melodyIdx  = 0;     // Müzik döngüsü pozisyonu

  /* --- AudioContext: yalnızca kullanıcı etkileşimi sonrası başlat ---
     Tarayıcılar otomatik ses çalmayı engeller; bu lazy init bunu çözer */
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* --- Düşük seviye: tek bir dalga formu + frekans çal ---
     freqs: [{ freq, start, dur }] dizisi
     type : 'sine' | 'square' | 'sawtooth' | 'triangle'
     vol  : 0.0 – 1.0 */
  function play(freqs, totalDur, type = 'sine', vol = 0.3) {
    if (!soundOn) return;
    try {
      const ac   = getCtx();
      const gain = ac.createGain();
      gain.gain.setValueAtTime(vol, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + totalDur);
      gain.connect(ac.destination);

      freqs.forEach(({ freq, start = 0, dur = totalDur }) => {
        const osc = ac.createOscillator();
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(gain);
        osc.start(ac.currentTime + start);
        osc.stop(ac.currentTime + start + dur);
      });
    } catch (e) { /* ses devre dışıysa sessizce geç */ }
  }

  /* ============================================================
     SES EFEKTLERİ
     Her fonksiyon bir oyun olayına karşılık gelir
  ============================================================ */

  /** Doğru cevap: yükselen iki nota */
  function playCorrect() {
    play([
      { freq: 523, start: 0,    dur: 0.13 },   // C5
      { freq: 659, start: 0.11, dur: 0.22 },   // E5
    ], 0.36);
  }

  /** Yanlış cevap: alçalan sawtooth */
  function playWrong() {
    play([
      { freq: 330, start: 0,    dur: 0.15 },   // E4
      { freq: 220, start: 0.13, dur: 0.28 },   // A3
    ], 0.44, 'sawtooth', 0.22);
  }

  /** Süre doldu: üç kısa darbe */
  function playTimeout() {
    play([
      { freq: 440, start: 0,    dur: 0.09 },
      { freq: 440, start: 0.13, dur: 0.09 },
      { freq: 330, start: 0.26, dur: 0.22 },
    ], 0.52, 'square', 0.18);
  }

  /** Seri (3+ doğru art arda): yükselen üç nota */
  function playStreak() {
    play([
      { freq: 523, start: 0,    dur: 0.1 },
      { freq: 659, start: 0.1,  dur: 0.1 },
      { freq: 784, start: 0.2,  dur: 0.2 },
    ], 0.44, 'sine', 0.32);
  }

  /** Level up: kısa fanfar */
  function playLevelUp() {
    play([
      { freq: 523, start: 0,    dur: 0.1 },
      { freq: 659, start: 0.1,  dur: 0.1 },
      { freq: 784, start: 0.2,  dur: 0.12 },
      { freq: 1047,start: 0.32, dur: 0.3 },
    ], 0.68, 'sine', 0.36);
  }

  /** Zafer / oyun kazanıldı: uzun fanfar */
  function playWin() {
    play([
      { freq: 523, start: 0,    dur: 0.1 },
      { freq: 659, start: 0.1,  dur: 0.1 },
      { freq: 784, start: 0.2,  dur: 0.12 },
      { freq: 1047,start: 0.32, dur: 0.16 },
      { freq: 784, start: 0.48, dur: 0.1 },
      { freq: 1047,start: 0.58, dur: 0.32 },
    ], 0.95, 'sine', 0.36);
  }

  /** Yenilgi: alçalan üçlü */
  function playLose() {
    play([
      { freq: 392, start: 0,    dur: 0.2 },
      { freq: 349, start: 0.2,  dur: 0.2 },
      { freq: 294, start: 0.4,  dur: 0.32 },
    ], 0.76, 'sawtooth', 0.22);
  }

  /** UI tıklama: kısa sine darbesi */
  function playClick() {
    play([{ freq: 880, start: 0, dur: 0.045 }], 0.06, 'sine', 0.14);
  }

  /** Oyun başladı: iki nota */
  function playStart() {
    play([
      { freq: 392, start: 0,    dur: 0.1 },
      { freq: 523, start: 0.1,  dur: 0.1 },
      { freq: 659, start: 0.2,  dur: 0.18 },
    ], 0.42, 'sine', 0.28);
  }

  /* ============================================================
     ARKA PLAN MÜZİĞİ
     C majör pentatonik arpeji — algoritmik, döngüsel
  ============================================================ */
  const MELODY = [
    261.63, 329.63, 392.00, 523.25,   // C4 E4 G4 C5
    392.00, 329.63, 261.63, 329.63,   // geri iniş
    293.66, 349.23, 440.00, 587.33,   // D4 F4 A4 D5
    440.00, 349.23, 293.66, 349.23,   // geri iniş
  ];

  function scheduleNote() {
    if (!musicOn || !ctx) return;
    const ac   = getCtx();
    const freq  = MELODY[melodyIdx % MELODY.length];
    melodyIdx++;

    const osc  = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.07, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.38);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.42);

    musicTimer = setTimeout(scheduleNote, 300); // BPM ≈ 200 (arpeji)
  }

  function startMusic() {
    if (!musicOn) return;
    getCtx();
    melodyIdx = 0;
    scheduleNote();
  }

  function stopMusic() {
    if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; }
  }

  /* ============================================================
     TOGGLE FONKSİYONLARI (UI butonlarıyla bağlanır)
  ============================================================ */
  function toggleSound() {
    soundOn = !soundOn;
    const btn = document.getElementById('sound-btn');
    if (btn) btn.classList.toggle('muted', !soundOn);
    if (soundOn) playClick();
  }

  function toggleMusic() {
    musicOn = !musicOn;
    const btn = document.getElementById('music-btn');
    if (btn) btn.classList.toggle('muted', !musicOn);
    musicOn ? startMusic() : stopMusic();
  }

  /* Public API */
  return {
    correct:  playCorrect,
    wrong:    playWrong,
    timeout:  playTimeout,
    streak:   playStreak,
    levelUp:  playLevelUp,
    win:      playWin,
    lose:     playLose,
    click:    playClick,
    start:    playStart,
    toggleSound,
    toggleMusic,
  };
})();
