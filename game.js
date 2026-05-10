/* ============================================================
   Quiz Arena — game.js
   Ana oyun motoru
   Özellikler:
     - Solo ve 2-oyuncu modu
     - Canvas zamanlayıcı + Canvas konfeti + Canvas skor grafiği
     - Level sistemi (her 5 soruda zorluk artar)
     - Seri (streak) sistemi + combo animasyonu
     - localStorage skor tablosu
     - Tam TR/EN çeviri desteği
     - İsim girişi (solo + VS)
     - "Nasıl Oynanır" ekranı
   ============================================================ */

/* ============================================================
   1. ÇEVİRİ / LOCALIZATION
   ============================================================ */
const T_DATA = {
  tr: {
    /* Menü */
    sub: 'Ayarlarını seç ve oyna!',
    lname: 'Oyuncu Adın', lmode: 'Oyun Modu',
    lcat: 'Kategori', ldiff: 'Zorluk Seviyesi', lqcount: 'Soru Sayısı',
    mSolo: 'Tek Oyuncu', mSoloSub: 'Rekorunu kır',
    mVs: '2 Oyuncu',    mVsSub: 'Aynı cihaz düellosu',
    easy: 'Kolay', medium: 'Orta', hard: 'Zor',
    easyPts: '+10 puan', medPts: '+20 puan', hardPts: '+30 puan',
    start: 'Başla', next: 'Sonraki Soru',
    qOf: (a, b) => `Soru ${a} / ${b}`,
    pts: 'puan', scoreLive: s => `${s} puan`,
    /* Oyun */
    correct:  '✓ Doğru!',
    wrong:    a => `✗ Yanlış! Doğru: ${a}`,
    timeout:  a => `⏱ Süre doldu! Doğru: ${a}`,
    vsRound:  n => `${n} oynuyor`,
    streak:   n => `${n}× Seri Ateşi`,
    quit: 'Oyundan çıkmak istediğine emin misin?',
    levelUp: 'Seviye Atladın!', levelUpSub: d => `Zorluk → ${d}`,
    /* Sonuç */
    rTitle: 'Oyun Bitti!',
    rNewRec: '🎉 Yeni Rekor!',
    rCorrect: 'Doğru', rWrong: 'Yanlış', rAcc: 'Başarı',
    rStreak: 'En uzun seri', rTime: 'Ort. süre', rBest: 'En iyi skor',
    rMsg: (s, t) =>
      s >= 90 ? `Mükemmel! ${t} soruda neredeyse hatasız performans.` :
      s >= 70 ? `Çok iyi! Biraz daha pratikle zirveye ulaşacaksın.` :
      s >= 50 ? `Fena değil! Daha fazla çalışarak gelişebilirsin.` :
                `Pes etme! Her deneme seni daha güçlü yapar.`,
    chartTitle: 'Her Sorunun Cevap Süresi (saniye)',
    winMsg:  n => `${n} kazandı!`,
    winSub:  (a, b) => `${a} – ${b} puan`,
    drawMsg: 'Berabere!', drawSub: 'Her iki oyuncu eşit puan aldı',
    btnLb: 'Tablo', btnMenu: 'Menü', btnAgain: 'Tekrar',
    /* Skor tablosu */
    lbTitle: 'Skor Tablosu', lbClear: 'Tabloyu Temizle',
    lbEmpty: 'Henüz kayıtlı skor yok.',
    lbAll: 'Tümü',
    lbDiff: d => ({ easy:'Kolay', medium:'Orta', hard:'Zor' }[d] || d),
    /* Nasıl oynanır */
    howtoTitle: 'Nasıl Oynanır?', howtoBack: 'Ana Menü',
    howtoStart: 'Oynamaya Başla',
    s1t: 'Ayarlarını Seç', s1d: 'Kategori, zorluk ve soru sayısını belirle. 2 oyuncu modunda arkadaşınla yarış!',
    s2t: 'Soruları Cevapla', s2d: 'Her soruda 4 seçenek var. Doğru cevabı bul ve tıkla.',
    s3t: 'Zamana Dikkat Et', s3d: 'Kolay: 20 sn | Orta: 15 sn | Zor: 10 sn. Süre dolunca soru yanlış sayılır.',
    s4t: 'Puan Kazan', s4d: 'Kolay +10, Orta +20, Zor +30 puan. 3+ arka arkaya doğruda seri bonusu!',
    s5t: 'Seviye Atla', s5d: 'Her 5 soruda zorluk otomatik artar. Ne kadar zor, o kadar fazla puan!',
    s6t: '2 Oyuncu Modu', s6d: 'İsimlerinizi girin, sırayla oynayın. Daha yüksek puanı yapan kazanır.',
    tipsTitle: 'İpuçları',
    tip1: '3+ arka arkaya doğru cevap = Ateş Serisi animasyonu!',
    tip2: 'Skor tablosu puanları kaydeder — tarayıcıyı kapatsan bile silinmez.',
    tip3: 'TR / EN butonuyla dili istediğin zaman değiştirebilirsin.',
    tip4: 'Sonuç ekranında Canvas grafiğiyle cevap sürelerini görebilirsin.',
    /* Kategoriler */
    cats: { all:'Karışık', science:'Bilim', history:'Tarih', culture:'Genel Kültür', sports:'Spor', geo:'Coğrafya', tech:'Teknoloji', math:'Matematik' },
    catSubs: { all:'Tüm kategoriler', science:'Fen & Teknoloji', history:'Tarih & Uygarlık', culture:'Sanat & Yaşam', sports:'Spor Dünyası', geo:'Dünya Coğrafyası', tech:'Dijital Dünya', math:'Sayılar & Formüller' },
    p1: 'Oyuncu 1', p2: 'Oyuncu 2',
    quit2: 'Çık',
  },
  en: {
    sub: 'Pick your settings and play!',
    lname: 'Your Name', lmode: 'Game Mode',
    lcat: 'Category', ldiff: 'Difficulty', lqcount: 'Question Count',
    mSolo: 'Solo',     mSoloSub: 'Beat your record',
    mVs: '2 Players',  mVsSub: 'Same device duel',
    easy: 'Easy', medium: 'Medium', hard: 'Hard',
    easyPts: '+10 pts', medPts: '+20 pts', hardPts: '+30 pts',
    start: 'Start', next: 'Next Question',
    qOf: (a, b) => `Q ${a} / ${b}`,
    pts: 'pts', scoreLive: s => `${s} pts`,
    correct:  '✓ Correct!',
    wrong:    a => `✗ Wrong! Answer: ${a}`,
    timeout:  a => `⏱ Time\'s up! Answer: ${a}`,
    vsRound:  n => `${n}\'s turn`,
    streak:   n => `${n}× Streak Fire`,
    quit: 'Are you sure you want to quit?',
    levelUp: 'Level Up!', levelUpSub: d => `Difficulty → ${d}`,
    rTitle: 'Game Over!',
    rNewRec: '🎉 New Record!',
    rCorrect: 'Correct', rWrong: 'Wrong', rAcc: 'Accuracy',
    rStreak: 'Best streak', rTime: 'Avg time', rBest: 'Best score',
    rMsg: (s, t) =>
      s >= 90 ? `Outstanding! Nearly flawless across ${t} questions.` :
      s >= 70 ? `Great job! A bit more practice and you\'ll ace it.` :
      s >= 50 ? `Not bad! Keep practising to improve.` :
                `Don\'t give up! Every attempt makes you stronger.`,
    chartTitle: 'Time Per Question (seconds)',
    winMsg:  n => `${n} wins!`,
    winSub:  (a, b) => `${a} – ${b} pts`,
    drawMsg: 'Draw!', drawSub: 'Both players scored equally',
    btnLb: 'Board', btnMenu: 'Menu', btnAgain: 'Again',
    lbTitle: 'Leaderboard', lbClear: 'Clear Board',
    lbEmpty: 'No scores recorded yet.',
    lbAll: 'All',
    lbDiff: d => ({ easy:'Easy', medium:'Medium', hard:'Hard' }[d] || d),
    howtoTitle: 'How to Play?', howtoBack: 'Main Menu',
    howtoStart: 'Start Playing',
    s1t: 'Choose Settings', s1d: 'Pick category, difficulty and question count. Play 2-player mode with a friend!',
    s2t: 'Answer Questions', s2d: 'Each question has 4 options. Find the correct one and tap it.',
    s3t: 'Watch the Timer', s3d: 'Easy: 20s | Medium: 15s | Hard: 10s. If time runs out, the question is marked wrong.',
    s4t: 'Earn Points', s4d: 'Easy +10, Medium +20, Hard +30 pts. Get 3+ in a row for a streak bonus!',
    s5t: 'Level Up', s5d: 'Difficulty increases every 5 questions automatically. Harder = more points!',
    s6t: '2-Player Mode', s6d: 'Enter your names, take turns answering. Highest score wins!',
    tipsTitle: 'Tips',
    tip1: '3+ correct in a row = Streak Fire animation!',
    tip2: 'The leaderboard saves scores — they persist even after closing the browser.',
    tip3: 'Switch between TR and EN anytime with the language button.',
    tip4: 'See your answer times as a Canvas chart on the results screen.',
    cats: { all:'Mixed', science:'Science', history:'History', culture:'General Knowledge', sports:'Sports', geo:'Geography', tech:'Technology', math:'Mathematics' },
    catSubs: { all:'All categories', science:'Science & Tech', history:'History & Civilization', culture:'Art & Life', sports:'Sports World', geo:'World Geography', tech:'Digital World', math:'Numbers & Formulas' },
    p1: 'Player 1', p2: 'Player 2',
    quit2: 'Quit',
  },
};

/* ============================================================
   2. SABİTLER
   ============================================================ */
const CATS      = ['all','science','history','culture','sports','geo','tech','math'];
const TIMES     = { easy: 20, medium: 15, hard: 10 };
const POINTS    = { easy: 10, medium: 20, hard: 30 };
const LB_KEY    = 'quiz_arena_v3';
const MEDALS    = ['🥇','🥈','🥉'];
const MED_CLS   = ['gold','silver','bronze'];

/* Kategori SVG ikonları (emoji yerine) */
const CAT_SVGS = {
  all:     { bg:'#EEEDFE', stroke:'#534AB7', path:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  science: { bg:'#EAF3DE', stroke:'#3B6D11', path:'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18' },
  history: { bg:'#FAEEDA', stroke:'#854F0B', path:'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
  culture: { bg:'#F0F4FF', stroke:'#185FA5', path:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  sports:  { bg:'#FEF0F0', stroke:'#A32D2D', path:'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M4.93 4.93l14.14 14.14' },
  geo:     { bg:'#E6F1FB', stroke:'#185FA5', path:'M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
  tech:    { bg:'#F5F4FF', stroke:'#534AB7', path:'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z' },
  math:    { bg:'#FAEEDA', stroke:'#854F0B', path:'M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' },
};

/* Canvas zamanlayıcı sabitleri */
const TIMER_R   = 22;   // yarıçap (px)
const TIMER_CX  = 28;   // merkez x
const TIMER_CY  = 28;   // merkez y
const TIMER_CIRC = 2 * Math.PI * TIMER_R;

/* ============================================================
   3. UYGULAMA DURUMU
   ============================================================ */
let lang        = 'tr';
let category    = null;
let difficulty  = 'easy';
let mode        = 'solo';
let qCount      = 10;

/* Solo mod */
let questions   = [];
let currentQ    = 0;
let totalScore  = 0;
let correctCnt  = 0;
let streak      = 0;
let maxStreak   = 0;
let answerTimes = [];   // Her sorunun geçen süresi (sn)
let origDiff    = 'easy'; // Level sistemi için başlangıç zorluğu

/* VS mod */
let p1 = { name:'', score:0, correct:0 };
let p2 = { name:'', score:0, correct:0 };
let vsQ  = { 1:[], 2:[] };
let vsQI = { 1:0, 2:0 };
let activeP = 1;

/* Zamanlayıcı */
let timerInterval = null;
let timeLeft      = 0;

/* ============================================================
   4. YARDIMCI FONKSİYONLAR
   ============================================================ */
/** id ile DOM elementi al */
const $ = id => document.getElementById(id);

/** Aktif dil metnini döndür */
const T = () => T_DATA[lang];

/** Diziyi rastgele karıştır (Fisher-Yates) */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Aktif ekranı değiştir */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
  // Sayfanın en üstüne kaydır
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** HTML injection'ı önle */
function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/'/g,'&#39;').replace(/"/g,'&quot;');
}

/** Soru havuzu oluştur (kategori + zorluk + dil) */
function buildPool(cat, diff, l) {
  const allCats = ['science','history','culture','sports','geo','tech','math'];
  const pool = cat === 'all'
    ? allCats.flatMap(c => QUESTIONS[l][c] || [])
    : (QUESTIONS[l][cat] || []);
  return pool.filter(q => q.d === diff);
}

/* ============================================================
   5. DİL & MENÜ FONKSİYONLARI
   ============================================================ */
function setLang(l) {
  lang = l;
  document.querySelectorAll('.lang-btn').forEach(b =>
    b.classList.toggle('active', b.textContent === l.toUpperCase())
  );
  updateTexts();
  renderCategories();
}

/** Tüm statik metinleri güncelle */
function updateTexts() {
  const t = T();
  /* Menü */
  $('lbl-name').textContent   = t.lname;
  $('lbl-mode').textContent   = t.lmode;
  $('lbl-cat').textContent    = t.lcat;
  $('lbl-diff').textContent   = t.ldiff;
  $('lbl-qcount').textContent = t.lqcount;
  $('mode-solo-lbl').textContent = t.mSolo;
  $('mode-solo-sub').textContent = t.mSoloSub;
  $('mode-vs-lbl').textContent   = t.mVs;
  $('mode-vs-sub').textContent   = t.mVsSub;
  $('lbl-easy').textContent  = t.easy;   $('lbl-easy-pts').textContent  = t.easyPts;
  $('lbl-med').textContent   = t.medium; $('lbl-med-pts').textContent   = t.medPts;
  $('lbl-hard').textContent  = t.hard;   $('lbl-hard-pts').textContent  = t.hardPts;
  $('start-lbl').textContent = t.start;
  $('lbl-lb').textContent    = t.lbTitle;
  $('solo-name').placeholder = t.lname + '...';
  $('p1-name').placeholder   = t.p1;
  $('p2-name').placeholder   = t.p2;
  /* Nasıl oynanır */
  $('howto-title').textContent    = t.howtoTitle;
  $('howto-back').textContent     = t.howtoBack;
  $('howto-start-btn').textContent= t.howtoStart;
  $('howto-s1-title').textContent = t.s1t; $('howto-s1-desc').textContent = t.s1d;
  $('howto-s2-title').textContent = t.s2t; $('howto-s2-desc').textContent = t.s2d;
  $('howto-s3-title').textContent = t.s3t; $('howto-s3-desc').textContent = t.s3d;
  $('howto-s4-title').textContent = t.s4t; $('howto-s4-desc').textContent = t.s4d;
  $('howto-s5-title').textContent = t.s5t; $('howto-s5-desc').textContent = t.s5d;
  $('howto-s6-title').textContent = t.s6t; $('howto-s6-desc').textContent = t.s6d;
  $('tips-title').textContent     = t.tipsTitle;
  $('tip1').textContent = t.tip1; $('tip2').textContent = t.tip2;
  $('tip3').textContent = t.tip3; $('tip4').textContent = t.tip4;
  /* Skor tablosu */
  $('lb-title').textContent  = t.lbTitle;
  $('lbl-clear').textContent = t.lbClear;
  /* Oyun butonları */
  if ($('quit-lbl')) $('quit-lbl').textContent = t.quit2;
}

/** Kategori ızgarasını çiz */
function renderCategories() {
  const t = T();
  $('cat-grid').innerHTML = CATS.map(c => {
    const svg = CAT_SVGS[c];
    return `
    <div class="sel-card ${category===c?'selected':''}" onclick="setCategory('${c}')">
      <div class="cat-icon-wrap" style="background:${svg.bg}">
        <svg viewBox="0 0 24 24" fill="none" stroke="${svg.stroke}" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="${svg.path}"/>
        </svg>
      </div>
      <div class="cl">${t.cats[c]}</div>
      <div class="cs">${t.catSubs[c]}</div>
    </div>`;
  }).join('');
}

/** Kategori seç */
function setCategory(c) {
  category = c;
  renderCategories();
  $('start-btn').disabled = false;
  SoundSystem.click();
}

/** Zorluk seç */
function setDiff(d, btn) {
  difficulty = d;
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  SoundSystem.click();
}

/** Soru sayısı seç */
function setQCount(n, btn) {
  qCount = n;
  ['q5','q10','q15'].forEach(id => $(id).classList.remove('selected'));
  btn.classList.add('selected');
  SoundSystem.click();
}

/** Oyun modunu seç */
function setMode(m, el) {
  mode = m;
  document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  $('vs-names').style.display = m === 'vs' ? 'block' : 'none';
  SoundSystem.click();
}

/** Ses efektlerini aç/kapat */
function toggleSound() { SoundSystem.toggleSound(); }

/** Müziği aç/kapat */
function toggleMusic() { SoundSystem.toggleMusic(); }

/** Nasıl oynanır ekranına git */
function goHowTo() {
  SoundSystem.click();
  showScreen('screen-howto');
}

/* ============================================================
   6. OYUN BAŞLATMA
   ============================================================ */
function startGame() {
  if (!category) return;

  /* Durumu sıfırla */
  totalScore = 0; correctCnt = 0;
  streak = 0; maxStreak = 0; answerTimes = [];
  origDiff = difficulty;

  if (mode === 'vs') {
    /* ------- 2 Oyuncu başlatma ------- */
    const n1 = $('p1-name').value.trim() || T().p1;
    const n2 = $('p2-name').value.trim() || T().p2;
    p1 = { name: n1, score: 0, correct: 0 };
    p2 = { name: n2, score: 0, correct: 0 };

    /* Her oyuncuya aynı havuzdan ayrı sorular çek */
    const pool = buildPool(category, difficulty, lang);
    if (!pool.length) { alert('Bu kombinasyon için yeterli soru yok.'); return; }
    vsQ  = { 1: shuffle(pool).slice(0, qCount), 2: shuffle(pool).slice(0, qCount) };
    vsQI = { 1: 0, 2: 0 };
    activeP = 1;

    /* VS header */
    $('vsh-p1n').textContent = p1.name;
    $('vsh-p2n').textContent = p2.name;
    $('vsh-p1-av').textContent = n1.charAt(0).toUpperCase();
    $('vsh-p2-av').textContent = n2.charAt(0).toUpperCase();
    $('vs-header-wrap').style.display = 'block';
    updateVsHeader();
  } else {
    /* ------- Solo başlatma ------- */
    const pool = buildPool(category, difficulty, lang);
    if (!pool.length) { alert('Bu kombinasyon için yeterli soru yok.'); return; }
    questions = shuffle(pool).slice(0, qCount);
    currentQ  = 0;
    $('vs-header-wrap').style.display = 'none';
  }

  /* Sonuç panelleri */
  $('result-solo').style.display = mode === 'solo' ? 'block' : 'none';
  $('result-vs').style.display   = mode === 'vs'   ? 'block' : 'none';

  SoundSystem.start();
  showScreen('screen-game');
  renderQuestion();
}

/* ============================================================
   7. SORU RENDER
   ============================================================ */
function renderQuestion() {
  const t = T();
  let q, total, idx;

  if (mode === 'vs') {
    /* VS: aktif oyuncunun sorusunu al */
    q     = vsQ[activeP][vsQI[activeP]];
    total = vsQ[activeP].length;
    idx   = vsQI[activeP];
    $('cur-player-lbl').textContent = t.vsRound(activeP === 1 ? p1.name : p2.name);
  } else {
    q = questions[currentQ]; total = questions.length; idx = currentQ;
    $('cur-player-lbl').textContent = '';
  }

  /* İlerleme */
  const pct = (idx / total) * 100;
  $('prog-fill').style.width = pct + '%';
  $('prog-label').textContent = `${idx + 1}/${total}`;

  /* Rozet ve skor */
  $('cat-badge').textContent  = t.cats[category];
  $('diff-badge').textContent = t[difficulty];
  $('score-live').textContent = t.scoreLive(mode === 'vs'
    ? (activeP === 1 ? p1.score : p2.score) : totalScore);

  /* Soru numarası ve metni */
  $('q-num').textContent  = t.qOf(idx + 1, total);
  $('q-text').textContent = q.q;

  /* Geri bildirimi temizle */
  $('fb-box').textContent = '';
  $('fb-box').className   = 'feedback-box';
  $('next-btn').style.display = 'none';
  $('next-lbl').textContent   = t.next;
  $('streak-badge').style.display = 'none';

  /* Seçenekleri karıştır ve oluştur */
  const correctText = q.o[q.a];
  const opts = shuffle([...q.o]);
  $('opts-grid').innerHTML = opts.map(o =>
    `<button class="opt-btn" onclick="answer(this,'${esc(o)}','${esc(correctText)}')">${o}</button>`
  ).join('');

  startTimer();
}

/* ============================================================
   8. CANVAS ZAMANLAIYICI
   ============================================================ */
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = TIMES[difficulty];
  const total = timeLeft;
  const numEl = $('timer-num');
  numEl.className = 'timer-num';
  numEl.textContent = timeLeft;
  drawTimerCanvas(1); // tam dolu başla

  timerInterval = setInterval(() => {
    timeLeft--;
    numEl.textContent = timeLeft;
    drawTimerCanvas(timeLeft / total);
    if (timeLeft <= 5) numEl.className = 'timer-num urgent';
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      answerTimes.push(total); // tam süre = cevap verilemedi
      handleTimeout();
    }
  }, 1000);
}

/** Canvas ile dairesel ilerleme çiz */
function drawTimerCanvas(ratio) {
  const canvas = $('timer-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  /* Arka plan halkası */
  ctx.beginPath();
  ctx.arc(TIMER_CX, TIMER_CY, TIMER_R, 0, Math.PI * 2);
  ctx.strokeStyle = '#E5E2D8';
  ctx.lineWidth = 4;
  ctx.stroke();

  /* İlerleme yayı */
  const startAngle = -Math.PI / 2;
  const endAngle   = startAngle + (Math.PI * 2 * ratio);
  const color = ratio > .4 ? '#534AB7' : ratio > .2 ? '#EF9F27' : '#A32D2D';

  ctx.beginPath();
  ctx.arc(TIMER_CX, TIMER_CY, TIMER_R, startAngle, endAngle);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.stroke();
}

/* ============================================================
   9. CEVAP İŞLEME
   ============================================================ */
function handleTimeout() {
  /* Aktif soruyu al */
  const q       = mode === 'vs' ? vsQ[activeP][vsQI[activeP]] : questions[currentQ];
  const correct = q.o[q.a];
  const t       = T();

  /* Tüm butonları kilitle, doğruyu göster */
  document.querySelectorAll('.opt-btn').forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add('correct');
  });

  streak = 0;
  SoundSystem.timeout();

  const fb = $('fb-box');
  fb.textContent = t.timeout(correct);
  fb.className   = 'feedback-box timeout';
  $('next-btn').style.display = 'block';
}

function answer(btn, chosen, correct) {
  clearInterval(timerInterval);
  const elapsed = TIMES[difficulty] - timeLeft;
  answerTimes.push(Math.max(elapsed, 1)); // en az 1 saniye kaydet
  const t   = T();
  const pts = POINTS[difficulty];

  /* Tüm butonları kilitle ve doğruyu vurgula */
  document.querySelectorAll('.opt-btn').forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add('correct');
  });

  const fb = $('fb-box');

  if (chosen === correct) {
    /* --------- DOĞRU --------- */
    btn.classList.add('correct');
    streak++;
    if (streak > maxStreak) maxStreak = streak;

    if (mode === 'vs') {
      activeP === 1 ? (p1.score += pts, p1.correct++) : (p2.score += pts, p2.correct++);
      updateVsHeader();
    } else {
      totalScore += pts;
      correctCnt++;
    }

    $('score-live').textContent = t.scoreLive(
      mode === 'vs' ? (activeP === 1 ? p1.score : p2.score) : totalScore
    );

    fb.textContent = t.correct;
    fb.className   = 'feedback-box correct';

    /* Seri efekti: 3+ art arda doğru */
    if (streak >= 3) {
      SoundSystem.streak();
      showComboAnim(t.streak(streak));
      /* Seri rozetini güncelle */
      $('streak-badge').style.display = 'block';
      $('streak-badge').textContent   = t.streak(streak);
    } else {
      SoundSystem.correct();
      $('streak-badge').style.display = 'none';
    }
  } else {
    /* --------- YANLIŞ --------- */
    btn.classList.add('wrong');
    streak = 0;
    $('streak-badge').style.display = 'none';
    fb.textContent = t.wrong(correct);
    fb.className   = 'feedback-box wrong';
    SoundSystem.wrong();
  }

  $('next-btn').style.display = 'block';
}

/* ============================================================
   10. SONRAKİ SORU & LEVEL SİSTEMİ
   ============================================================ */
function nextQ() {
  SoundSystem.click();

  if (mode === 'vs') {
    /* VS: oyuncu sırası döner */
    vsQI[activeP]++;
    const d1 = vsQI[1] >= vsQ[1].length;
    const d2 = vsQI[2] >= vsQ[2].length;
    if (d1 && d2) { showResult(); return; }
    activeP = (!d2 && activeP === 1) ? 2 :
              (!d1 && activeP === 2) ? 1 : (d2 ? 1 : 2);
    updateVsHeader();
  } else {
    /* Solo: level sistemi */
    const next = currentQ + 1;
    if (next > 0 && next % 5 === 0 && next < questions.length) {
      const prev = difficulty;
      if      (difficulty === 'easy')   difficulty = 'medium';
      else if (difficulty === 'medium') difficulty = 'hard';
      if (difficulty !== prev) {
        showLevelUp(difficulty);
        currentQ = next;
        return; // level up animasyonu sonrası renderQuestion() çağrılacak
      }
    }
    currentQ++;
    if (currentQ >= questions.length) { showResult(); return; }
  }
  renderQuestion();
}

/* ============================================================
   11. VS HEADER GÜNCELLEME
   ============================================================ */
function updateVsHeader() {
  $('vsh-p1s').textContent = p1.score;
  $('vsh-p2s').textContent = p2.score;
  $('vs-round-lbl').textContent = T().vsRound(activeP === 1 ? p1.name : p2.name);

  /* Denge çubuğu */
  const total = p1.score + p2.score;
  const p1pct = total === 0 ? 50 : Math.round((p1.score / total) * 100);
  $('vs-bar-p1').style.width = p1pct + '%';
  $('vs-bar-p2').style.width = (100 - p1pct) + '%';
}

/* ============================================================
   12. ANİMASYONLAR
   ============================================================ */
/** Seri / combo metin animasyonu */
function showComboAnim(text) {
  const el = $('combo-overlay');
  el.textContent = text;
  el.style.display = 'block';
  el.style.animation = 'none';
  void el.offsetWidth; // reflow — animasyonu sıfırla
  el.style.animation = 'comboFloat .85s ease forwards';
  setTimeout(() => { el.style.display = 'none'; }, 880);
}

/** Level up popup göster */
function showLevelUp(newDiff) {
  const t = T();
  $('levelup-txt').textContent = t.levelUp;
  $('levelup-sub').textContent = t.levelUpSub(t[newDiff]);
  const overlay = $('levelup-overlay');
  overlay.style.display = 'flex';
  SoundSystem.levelUp();
  setTimeout(() => {
    overlay.style.display = 'none';
    renderQuestion();
  }, 1900);
}

/* ============================================================
   13. CANVAS KONFETİ
   ============================================================ */
function launchConfetti() {
  const canvas = $('confetti-canvas');
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  const ctx = canvas.getContext('2d');
  const pieces = [];
  const COLORS = ['#534AB7','#EF9F27','#3B6D11','#D85A30','#E91E63','#00BCD4','#FF5722'];

  /* 60 konfeti parçası oluştur */
  for (let i = 0; i < 60; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 100,
      vx: (Math.random() - .5) * 3,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * 360,
      rotV: (Math.random() - .5) * 8,
      w: 8 + Math.random() * 10,
      h: 6 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() > .5 ? 'rect' : 'circle',
    });
  }

  let frame = 0;
  const MAX_FRAMES = 120; // 2 saniye @ 60fps

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rotV;
      p.vy  += 0.05; // yerçekimi

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - frame / MAX_FRAMES);

      if (p.shape === 'rect') {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    frame++;
    if (frame < MAX_FRAMES) requestAnimationFrame(draw);
    else canvas.style.display = 'none';
  }

  requestAnimationFrame(draw);
}

/* ============================================================
   14. CANVAS SKOR GRAFİĞİ
   ============================================================ */
function drawScoreChart(times, maxTime) {
  const canvas = $('result-canvas');
  if (!canvas || !times.length) return;

  /* Canvas genişliğini container'a uydur */
  canvas.width  = canvas.offsetWidth || canvas.parentElement.offsetWidth || 400;
  canvas.height = 120;

  const ctx = canvas.getContext('2d');
  const W   = canvas.width;
  const H   = canvas.height;
  const PAD = { top:10, right:10, bottom:25, left:30 };
  const gW  = W - PAD.left - PAD.right;
  const gH  = H - PAD.top  - PAD.bottom;
  const n   = times.length;
  const barW = Math.max(4, Math.floor(gW / n) - 4);

  ctx.clearRect(0, 0, W, H);

  /* Y ekseni kılavuz çizgileri */
  ctx.strokeStyle = '#E5E2D8';
  ctx.lineWidth   = 1;
  [0, .5, 1].forEach(t => {
    const y = PAD.top + gH * (1 - t);
    ctx.beginPath();
    ctx.moveTo(PAD.left, y);
    ctx.lineTo(PAD.left + gW, y);
    ctx.stroke();
    /* Y ekseni etiketi */
    ctx.fillStyle  = '#8A8880';
    ctx.font       = '10px sans-serif';
    ctx.textAlign  = 'right';
    ctx.fillText(Math.round(maxTime * t) + 's', PAD.left - 4, y + 3);
  });

  /* Çubuklar */
  times.forEach((sec, i) => {
    const ratio  = Math.min(sec / maxTime, 1);
    const barH   = Math.max(2, gH * ratio);
    const x      = PAD.left + (gW / n) * i + (gW / n - barW) / 2;
    const y      = PAD.top + gH - barH;

    /* Süreye göre renk: yeşil (hızlı) → turuncu → kırmızı (yavaş) */
    const hue = Math.round(120 * (1 - ratio)); // 120=yeşil, 0=kırmızı
    ctx.fillStyle = `hsl(${hue}, 65%, 45%)`;

    /* Yuvarlak üst köşeli dikdörtgen */
    const r = Math.min(3, barW / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + barW - r, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
    ctx.lineTo(x + barW, y + barH);
    ctx.lineTo(x, y + barH);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.fill();

    /* X ekseni soru numarası */
    ctx.fillStyle = '#8A8880';
    ctx.font      = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(i + 1, x + barW / 2, H - 6);
  });

  /* X ekseni başlığı */
  ctx.fillStyle = '#8A8880';
  ctx.font      = '10px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(T().chartTitle, PAD.left, H - 0);
}

/* ============================================================
   15. SONUÇ EKRANI
   ============================================================ */
function showResult() {
  clearInterval(timerInterval);
  const t = T();

  if (mode === 'solo') {
    /* ------- Solo sonuç ------- */
    const total  = questions.length;
    const acc    = total ? Math.round((correctCnt / total) * 100) : 0;
    const avgT   = answerTimes.length
      ? Math.round(answerTimes.reduce((a,b) => a+b, 0) / answerTimes.length) : 0;
    const prevB  = getBestScore(category, origDiff);
    const isRec  = totalScore > prevB;

    /* Oyuncu adı */
    const playerName = $('solo-name').value.trim();

    $('r-title').textContent     = isRec ? t.rNewRec : t.rTitle;
    $('r-score').textContent     = totalScore;
    $('r-score-lbl').textContent = t.pts;
    $('r-correct').textContent   = correctCnt;
    $('r-correct-lbl').textContent = t.rCorrect;
    $('r-wrong').textContent     = total - correctCnt;
    $('r-wrong-lbl').textContent = t.rWrong;
    $('r-acc').textContent       = acc + '%';
    $('r-acc-lbl').textContent   = t.rAcc;
    $('r-streak').textContent    = maxStreak;
    $('r-streak-lbl').textContent= t.rStreak;
    $('r-time').textContent      = avgT + 's';
    $('r-time-lbl').textContent  = t.rTime;
    $('r-best').textContent      = prevB > 0 ? prevB : '—';
    $('r-best-lbl').textContent  = t.rBest;
    $('chart-title').textContent = t.chartTitle;
    $('r-msg').textContent       = t.rMsg(acc, total);

    saveLB(totalScore, correctCnt, total, origDiff, category, playerName);

    /* Canvas skor grafiği */
    const maxSec = TIMES[origDiff];
    setTimeout(() => drawScoreChart(answerTimes, maxSec), 150);

    /* Ses & animasyon */
    if (acc >= 70) { SoundSystem.win(); launchConfetti(); }
    else            { SoundSystem.lose(); }

  } else {
    /* ------- VS sonuç ------- */
    const banner = $('winner-banner');
    if (p1.score > p2.score) {
      banner.className = 'winner-banner p1';
      $('winner-txt').textContent = t.winMsg(p1.name);
      $('winner-sub').textContent = t.winSub(p1.score, p2.score);
    } else if (p2.score > p1.score) {
      banner.className = 'winner-banner p2';
      $('winner-txt').textContent = t.winMsg(p2.name);
      $('winner-sub').textContent = t.winSub(p2.score, p1.score);
    } else {
      banner.className = 'winner-banner draw';
      $('winner-txt').textContent = t.drawMsg;
      $('winner-sub').textContent = t.drawSub;
    }
    $('rv-p1n').textContent  = p1.name;  $('rv-p1s').textContent  = p1.score;
    $('rv-p2n').textContent  = p2.name;  $('rv-p2s').textContent  = p2.score;
    $('rv-p1c').textContent  = `${p1.correct} ${t.rCorrect}`;
    $('rv-p2c').textContent  = `${p2.correct} ${t.rCorrect}`;
    $('rv-p1-av').textContent = p1.name.charAt(0).toUpperCase();
    $('rv-p2-av').textContent = p2.name.charAt(0).toUpperCase();

    SoundSystem.win();
    launchConfetti();
  }

  $('btn-lb').textContent   = t.btnLb;
  $('btn-menu').textContent = t.btnMenu;
  $('btn-again').textContent= t.btnAgain;

  showScreen('screen-result');
  $('prog-fill').style.width = '100%';
}

/* ============================================================
   16. SKOR TABLOSU
   ============================================================ */
function getLB() {
  try { return JSON.parse(localStorage.getItem(LB_KEY) || '[]'); }
  catch (e) { return []; }
}

function saveLB(score, correct, total, diff, cat, name) {
  let lb = getLB();
  lb.push({
    score, correct, total, diff, cat,
    name: name || '—',
    date: new Date().toLocaleDateString(),
    ts: Date.now(),
  });
  lb.sort((a,b) => b.score - a.score);
  lb = lb.slice(0, 50);
  try { localStorage.setItem(LB_KEY, JSON.stringify(lb)); } catch(e) {}
}

function getBestScore(cat, diff) {
  const lb = getLB().filter(e => e.cat === cat && e.diff === diff);
  return lb.length ? lb[0].score : 0;
}

function clearLB() {
  try { localStorage.removeItem(LB_KEY); } catch(e) {}
  renderLB('all');
}

function goLB() {
  showScreen('screen-lb');
  renderLBTabs();
}

function renderLBTabs() {
  const t = T();
  $('lb-tabs').innerHTML = ['all', ...CATS.filter(c => c !== 'all')].map(c => `
    <button class="tab-btn ${c==='all'?'active':''}" onclick="selectLBTab('${c}',this)">
      ${c === 'all' ? t.lbAll : t.cats[c]}
    </button>`).join('');
  renderLB('all');
}

function selectLBTab(cat, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderLB(cat);
}

function renderLB(filterCat) {
  const t = T();
  let lb = getLB();
  if (filterCat !== 'all') lb = lb.filter(e => e.cat === filterCat);
  if (!lb.length) {
    $('lb-list').innerHTML = `<p class="lb-empty">${t.lbEmpty}</p>`;
    return;
  }
  $('lb-list').innerHTML = lb.slice(0, 15).map((e, i) => `
    <div class="lb-row ${MED_CLS[i] || ''}">
      <div class="lb-rank">${MEDALS[i] || '#' + (i+1)}</div>
      <div class="lb-info">
        <div class="lb-name">${esc(e.name)} — ${e.score} ${t.pts}</div>
        <div class="lb-meta">${t.lbDiff(e.diff)} · ${t.cats[e.cat]||e.cat} · ${e.correct}/${e.total} · ${e.date}</div>
      </div>
      <div class="lb-score">${Math.round((e.correct/e.total)*100)}%</div>
    </div>`).join('');
}

/* ============================================================
   17. NAVİGASYON
   ============================================================ */
function goMenu() {
  clearInterval(timerInterval);
  /* Zorluk seçimini başlangıca döndür */
  difficulty = 'easy';
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
  $('d-easy').classList.add('selected');
  showScreen('screen-menu');
}

function confirmQuit() {
  if (confirm(T().quit)) {
    clearInterval(timerInterval);
    goMenu();
  }
}

/* ============================================================
   18. SPLASH EKRANI & BAŞLATMA
   ============================================================ */

/**
 * Uygulamayı başlat:
 * Splash ekranını 1.6 sn göster, ardından ana menüye geç.
 * Hem DOMContentLoaded hem de doğrudan çağrı olarak güvenli çalışır.
 */
function initApp() {
  /* q10 başlangıç seçimi */
  const q10 = $('q10');
  if (q10) q10.classList.add('selected');

  /* Splash → Menü geçişi */
  setTimeout(() => {
    showScreen('screen-menu');
    renderCategories();
    updateTexts();
  }, 1600);

  /* Ekran boyutu değişince Canvas timer'ı yeniden çiz */
  window.addEventListener('resize', () => {
    if (timerInterval) drawTimerCanvas(timeLeft / TIMES[difficulty]);
  });
}

/* JS dosyası body sonunda yüklendiği için DOM her zaman hazır olur.
   Yine de her iki durumu da karşıla. */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  /* DOM zaten yüklendi (script defer/async veya body sonu) */
  initApp();
}
