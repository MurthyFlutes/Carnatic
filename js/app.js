// ============================================================
// CARNATIC MUSIC APP — MAIN APPLICATION LOGIC
// ============================================================

// ── STATE ──────────────────────────────────────────────────
const State = {
  currentTab: 'home',
  currentSection: 'sarali',
  currentAlankaramTala: 'all',
  detailOpen: false,
  detailItem: null,
  detailSectionId: null,
  trackerDate: dateKey(new Date()),
  metro: {
    bpm: 60,
    tala: 'adi',
    playing: false,
    beat: -1,
    nextBeatTime: 0,
    timerID: null
  },
  quiz: {
    mode: 'sarali',
    score: 0,
    total: 0,
    streak: 0,
    answered: false,
    currentQ: null
  },
  tuner: { active: false, shrutiHz: 130.81 }
};

// ── STORAGE ────────────────────────────────────────────────
const Store = {
  key: 'carnatic_v1',
  get() {
    try { return JSON.parse(localStorage.getItem(this.key)) || {}; } catch { return {}; }
  },
  set(data) {
    try { localStorage.setItem(this.key, JSON.stringify(data)); } catch {}
  },
  getPractice(dateStr) {
    const d = this.get();
    return d.practice?.[dateStr] || {};
  },
  setPractice(dateStr, exId, speeds) {
    const d = this.get();
    if (!d.practice) d.practice = {};
    if (!d.practice[dateStr]) d.practice[dateStr] = {};
    d.practice[dateStr][exId] = speeds;
    this.set(d);
  },
  isDone(dateStr, exId) {
    const p = this.getPractice(dateStr);
    return !!(p[exId]);
  },
  getSpeedsDone(dateStr, exId) {
    const p = this.getPractice(dateStr);
    return p[exId] || [];
  },
  getStreak() {
    const d = this.get();
    return d.practice ? Object.keys(d.practice).length : 0;
  },
  getTodayDoneCount(dateStr) {
    const p = this.getPractice(dateStr);
    return Object.keys(p).length;
  },
  getWeekData() {
    const d = this.get().practice || {};
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const dt = new Date();
      dt.setDate(dt.getDate() - i);
      const key = dateKey(dt);
      result.push({ key, hasData: !!(d[key] && Object.keys(d[key]).length > 0) });
    }
    return result;
  }
};

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function formatDate(str) {
  const [y, m, day] = str.split('-');
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const d = new Date(+y, +m-1, +day);
  const today = dateKey(new Date());
  if (str === today) return 'Today';
  const yest = new Date(); yest.setDate(yest.getDate()-1);
  if (str === dateKey(yest)) return 'Yesterday';
  return `${days[d.getDay()]}, ${names[+m-1]} ${+day}`;
}

// ── ROUTER ─────────────────────────────────────────────────
function navigate(tab) {
  State.currentTab = tab;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`screen-${tab}`)?.classList.add('active');
  document.querySelector(`.nav-item[data-tab="${tab}"]`)?.classList.add('active');

  const titles = {
    home: 'Carnatic Music',
    tracker: 'Practice Tracker',
    metronome: 'Metronome',
    quiz: 'Quiz'
  };
  setHeader(titles[tab] || 'Carnatic Music', false);

  if (tab === 'home')      renderHome();
  if (tab === 'tracker')   renderTracker();
  if (tab === 'metronome') renderMetronome();
  if (tab === 'quiz')      renderQuiz();
}

function setHeader(title, showBack) {
  document.getElementById('header-title').textContent = title;
  const back = document.getElementById('header-back');
  if (showBack) back.classList.add('visible');
  else          back.classList.remove('visible');
}

// ── HOME SCREEN ────────────────────────────────────────────
function renderHome() {
  const today = dateKey(new Date());
  const totalEx = CARNATIC_DATA.sarali.count + CARNATIC_DATA.janta.count +
                  CARNATIC_DATA.dhattu.count + CARNATIC_DATA.alankaram.count;
  const doneCounts = {
    sarali: CARNATIC_DATA.sarali.exercises.filter(e => Store.isDone(today, `sarali_${e.num}`)).length,
    janta:  CARNATIC_DATA.janta.exercises.filter(e => Store.isDone(today, `janta_${e.num}`)).length,
    dhattu: CARNATIC_DATA.dhattu.exercises.filter(e => Store.isDone(today, `dhattu_${e.num}`)).length,
    alankaram: CARNATIC_DATA.alankaram.exercises.filter(e => Store.isDone(today, `alankaram_${e.num}`)).length
  };

  document.getElementById('screen-home').innerHTML = `
    <div class="section-hero">
      <h2>Carnatic Music Practice</h2>
      <div class="hero-badge">Raga: Mayamalavagowla</div>
    </div>

    <div class="section-label">Practice Sections</div>
    <div class="section-cards">
      ${Object.values(CARNATIC_DATA).map(sec => `
        <div class="section-card" onclick="openSection('${sec.id}')">
          <div class="section-card-icon">${sec.icon}</div>
          <div class="section-card-title">${sec.titleEn}</div>
          <div class="section-card-count">${sec.count} exercises</div>
        </div>
      `).join('')}
    </div>

    <div class="section-label">Today's Progress</div>
    <div class="home-progress">
      <h4>Today — ${formatDate(today)}</h4>
      ${[
        ['Sarali', 'sarali', doneCounts.sarali, CARNATIC_DATA.sarali.count],
        ['Janta',  'janta',  doneCounts.janta,  CARNATIC_DATA.janta.count],
        ['Dhattu', 'dhattu', doneCounts.dhattu, CARNATIC_DATA.dhattu.count],
        ['Alankaram','alankaram', doneCounts.alankaram, CARNATIC_DATA.alankaram.count]
      ].map(([label, id, done, total]) => `
        <div class="progress-row">
          <div class="progress-label">${label}</div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width:${total?Math.round(done/total*100):0}%"></div>
          </div>
          <div class="progress-pct">${done}/${total}</div>
        </div>
      `).join('')}
    </div>

    <div class="info-banner">
      <div class="info-banner-icon">💡</div>
      <div>Practice in three speeds — Speed 1 (Slow), Speed 2 (Medium), Speed 3 (Fast)</div>
    </div>
  `;
}

// ── EXERCISES SCREEN ───────────────────────────────────────
function openSection(sectionId) {
  State.currentSection = sectionId;
  State.currentAlankaramTala = 'all';
  renderExercisesScreen();
  document.getElementById('screen-home').classList.remove('active');
  document.getElementById('screen-exercises').classList.add('active');
  const sec = CARNATIC_DATA[sectionId];
  setHeader(sec.titleEn, true);
  State.currentTab = 'exercises';
}

function renderExercisesScreen() {
  const sec = CARNATIC_DATA[State.currentSection];
  const today = dateKey(new Date());

  let listHTML = '';

  if (State.currentSection === 'alankaram') {
    // Tala filter + grouped list
    const talas = [{ id: 'all', nameEn: 'All' }, ...CARNATIC_DATA.alankaram.talas];
    const filtered = State.currentAlankaramTala === 'all'
      ? sec.exercises
      : sec.exercises.filter(e => e.tala.id === State.currentAlankaramTala);

    listHTML = `
      <div class="tala-filter">
        ${talas.map(t => `
          <button class="tala-filter-btn ${State.currentAlankaramTala === t.id ? 'active' : ''}"
            onclick="filterAlankaram('${t.id}')">${t.nameEn}</button>
        `).join('')}
      </div>
      <div class="exercise-list">
        ${filtered.map(ex => exerciseCard(ex, 'alankaram', today)).join('')}
      </div>
    `;
  } else {
    listHTML = `<div class="exercise-list">
      ${sec.exercises.map(ex => exerciseCard(ex, State.currentSection, today)).join('')}
    </div>`;
  }

  document.getElementById('screen-exercises').innerHTML = `
    <div class="section-hero" style="background:linear-gradient(135deg,#3a0000,${sec.color})">
      <h2>${sec.titleEn}</h2>
      <div class="hero-badge">${sec.raga} | ${sec.tala}</div>
    </div>
    ${listHTML}
  `;
}

function exerciseCard(ex, sectionId, today) {
  const id = `${sectionId}_${ex.num}`;
  const done = Store.isDone(today, id);
  return `
    <div class="ex-card" onclick="openDetail('${sectionId}', ${ex.num})">
      <div class="ex-num">${ex.num}</div>
      <div class="ex-info">
        <div class="ex-name-tamil">${ex.nameEn}</div>
      </div>
      <div class="ex-done ${done ? 'done' : ''}">${done ? '✓' : ''}</div>
      <div class="ex-chevron">›</div>
    </div>
  `;
}

function filterAlankaram(talaId) {
  State.currentAlankaramTala = talaId;
  renderExercisesScreen();
}

// ── DETAIL VIEW ────────────────────────────────────────────
function openDetail(sectionId, num) {
  const sec = CARNATIC_DATA[sectionId];
  const ex = sec.exercises.find(e => e.num === num);
  if (!ex) return;

  State.detailOpen = true;
  State.detailItem = ex;
  State.detailSectionId = sectionId;

  const today = dateKey(new Date());
  const exId = `${sectionId}_${num}`;
  const speeds = Store.getSpeedsDone(today, exId);
  const isDone = speeds.length > 0;

  const aroHTML   = formatSwaras(ex.aro,   ex.grouped);
  const avaroHTML = formatSwaras(ex.avaro, ex.grouped);

  const screen = document.getElementById('detail-screen');
  screen.innerHTML = `
    <div class="detail-hero">
      <div class="detail-num">${sec.titleEn} — #${num}</div>
      <div class="detail-name">${ex.nameEn}</div>
    </div>
    <div class="detail-body">

      <div class="swara-card">
        <div class="swara-card-header">Ascending (Arohanam)</div>
        <div class="swara-card-body">${aroHTML}</div>
        ${ex.note ? `<div class="octave-note">${ex.note}</div>` : ''}
      </div>

      <div class="swara-card">
        <div class="swara-card-header">Descending (Avarohanam)</div>
        <div class="swara-card-body">${avaroHTML}</div>
      </div>

      <div class="speed-card">
        <h4>Speed Practice</h4>
        <div class="speed-btns">
          ${['Speed 1\nSlow','Speed 2\nMedium','Speed 3\nFast'].map((label, i) => `
            <div class="speed-btn ${speeds.includes(i) ? 'done' : ''}"
              onclick="toggleSpeed('${sectionId}',${num},${i})" id="speed-${i}">
              ${label.split('\n').map((l,j) => j===0 ? `<b>${l}</b>` : `<br><small>${l}</small>`).join('')}
            </div>
          `).join('')}
        </div>
      </div>

      <button class="mark-btn ${isDone ? 'done' : ''}" id="mark-btn"
        onclick="toggleDone('${sectionId}',${num})">
        ${isDone ? '✓ Completed Today' : 'Mark as Done Today'}
      </button>
      ${renderTunerCard()}
    </div>
  `;

  screen.classList.add('open');
  setHeader(`${sec.titleEn} #${num}`, true);
}

function closeDetail() {
  if (State.tuner.active) { pitchDetector.stop(); State.tuner.active = false; }
  document.getElementById('detail-screen').classList.remove('open');
  State.detailOpen = false;
  if (State.currentTab === 'exercises') {
    renderExercisesScreen();
    setHeader(CARNATIC_DATA[State.currentSection].titleEn, true);
  } else {
    navigate(State.currentTab);
  }
}

function swarasToLatin(str) {
  return str
    .replace(/நி/g, 'Ni')
    .replace(/ரி/g, 'Ri')
    .replace(/ஸ/g, 'S')
    .replace(/க/g, 'Ga')
    .replace(/ம/g, 'Ma')
    .replace(/ப/g, 'Pa')
    .replace(/த/g, 'Da');
}

function formatSwaras(text, grouped) {
  text = swarasToLatin(text);
  if (!grouped) return text;
  // Replace [...] groups with styled spans
  return text.replace(/\[([^\]]+)\]/g, (_, inner) => `<span class="grp">${inner}</span>`);
}

function toggleSpeed(sectionId, num, speedIdx) {
  const today = dateKey(new Date());
  const exId = `${sectionId}_${num}`;
  let speeds = Store.getSpeedsDone(today, exId);
  if (speeds.includes(speedIdx)) {
    speeds = speeds.filter(s => s !== speedIdx);
  } else {
    speeds = [...new Set([...speeds, speedIdx])];
  }
  Store.setPractice(today, exId, speeds.length ? speeds : undefined);
  // Refresh speed buttons
  speeds = Store.getSpeedsDone(today, exId);
  document.querySelectorAll('.speed-btn').forEach((btn, i) => {
    btn.classList.toggle('done', speeds.includes(i));
  });
  // Update mark btn
  const isDone = speeds.length > 0;
  const markBtn = document.getElementById('mark-btn');
  if (markBtn) {
    markBtn.className = `mark-btn ${isDone ? 'done' : ''}`;
    markBtn.textContent = isDone
      ? '✓ Completed Today'
      : 'Mark as Done Today';
  }
}

function toggleDone(sectionId, num) {
  const today = dateKey(new Date());
  const exId = `${sectionId}_${num}`;
  const isDone = Store.isDone(today, exId);
  if (isDone) {
    Store.setPractice(today, exId, undefined);
    const d = Store.get();
    if (d.practice?.[today]?.[exId]) delete d.practice[today][exId];
    Store.set(d);
  } else {
    Store.setPractice(today, exId, [0, 1, 2]);
  }
  openDetail(sectionId, num); // re-render
  showToast(isDone ? 'Unmarked' : '✓ Practice Done!');
}

// ── TRACKER ────────────────────────────────────────────────
function renderTracker() {
  const dateStr = State.trackerDate;
  const today = dateKey(new Date());
  const week = Store.getWeekData();
  const days = ['S','M','T','W','T','F','S'];

  const sections = [
    { id: 'sarali',    label: 'Sarali Varisai', exercises: CARNATIC_DATA.sarali.exercises },
    { id: 'janta',     label: 'Janta Varisai',  exercises: CARNATIC_DATA.janta.exercises },
    { id: 'dhattu',    label: 'Dhattu Varisai', exercises: CARNATIC_DATA.dhattu.exercises },
    { id: 'alankaram', label: 'Alankaram',       exercises: CARNATIC_DATA.alankaram.exercises }
  ];

  const totalDone = sections.reduce((sum, s) =>
    sum + s.exercises.filter(e => Store.isDone(dateStr, `${s.id}_${e.num}`)).length, 0);
  const totalEx = sections.reduce((sum, s) => sum + s.exercises.length, 0);
  const streak = Store.getStreak();

  document.getElementById('screen-tracker').innerHTML = `
    <div class="section-hero">
      <h2>Practice Tracker</h2>
    </div>

    <div class="tracker-summary">
      <div><div class="tracker-stat-val">${totalDone}</div><div class="tracker-stat-lbl">Done Today</div></div>
      <div><div class="tracker-stat-val">${totalEx}</div><div class="tracker-stat-lbl">Total</div></div>
      <div><div class="tracker-stat-val">${streak}</div><div class="tracker-stat-lbl">Day Streak</div></div>
    </div>

    <div class="streak-bar">
      <h4>This Week</h4>
      <div class="week-dots">
        ${week.map((w, i) => {
          const d = new Date(w.key);
          return `<div class="week-dot">
            <div class="week-dot-circle ${w.hasData ? 'active' : ''} ${w.key === today ? 'today' : ''}"></div>
            <div class="week-dot-label">${days[d.getDay()]}</div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="tracker-date">
      <button class="tracker-date-btn" onclick="changeTrackerDate(-1)">‹</button>
      <div class="tracker-date-label">${formatDate(dateStr)}</div>
      <button class="tracker-date-btn" onclick="changeTrackerDate(1)" ${dateStr >= today ? 'disabled style="opacity:0.3"' : ''}>›</button>
    </div>

    ${sections.map(sec => {
      const done = sec.exercises.filter(e => Store.isDone(dateStr, `${sec.id}_${e.num}`)).length;
      return `
        <div class="tracker-section">
          <div class="tracker-section-header">
            <span>${sec.label}</span>
            <span style="color:var(--text3)">${done}/${sec.exercises.length}</span>
          </div>
          <div class="tracker-grid">
            ${sec.exercises.map(ex => {
              const id = `${sec.id}_${ex.num}`;
              const isDone = Store.isDone(dateStr, id);
              return `
                <div class="tracker-cell ${isDone ? 'done' : ''}"
                  onclick="trackerToggle('${sec.id}', ${ex.num}, '${dateStr}')">
                  <div class="tracker-cell-num">${ex.num}</div>
                  <div class="tracker-cell-lbl">${ex.nameEn}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('')}
  `;
}

function changeTrackerDate(delta) {
  const d = new Date(State.trackerDate);
  d.setDate(d.getDate() + delta);
  const today = new Date();
  if (d > today) return;
  State.trackerDate = dateKey(d);
  renderTracker();
}

function trackerToggle(sectionId, num, dateStr) {
  const exId = `${sectionId}_${num}`;
  const isDone = Store.isDone(dateStr, exId);
  if (isDone) {
    const d = Store.get();
    if (d.practice?.[dateStr]?.[exId]) {
      delete d.practice[dateStr][exId];
      Store.set(d);
    }
  } else {
    Store.setPractice(dateStr, exId, [0]);
  }
  renderTracker();
}

// ── METRONOME ──────────────────────────────────────────────
let audioCtx = null;
let metroTimer = null;
let currentBeat = 0;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playClick(time, isAccent) {
  const ctx = getAudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = isAccent ? 1200 : 800;
  gain.gain.setValueAtTime(isAccent ? 0.8 : 0.4, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
  osc.start(time);
  osc.stop(time + 0.1);
}

function startMetronome() {
  const ctx = getAudioCtx();
  if (ctx.state === 'suspended') ctx.resume();

  const tala = TALAM_PATTERNS[State.metro.tala];
  currentBeat = 0;
  State.metro.playing = true;

  function schedule() {
    const now = ctx.currentTime;
    const interval = 60 / State.metro.bpm;
    const isAccent = tala.accents.includes(currentBeat);
    playClick(now, isAccent);
    highlightBeat(currentBeat, tala.beats, isAccent);
    currentBeat = (currentBeat + 1) % tala.beats;
    metroTimer = setTimeout(schedule, interval * 1000 - 10);
  }

  schedule();
  document.getElementById('metro-play-btn').classList.add('playing');
  document.getElementById('metro-play-btn').innerHTML = '⏸';
}

function stopMetronome() {
  clearTimeout(metroTimer);
  State.metro.playing = false;
  document.querySelectorAll('.beat-dot').forEach(d => d.classList.remove('active'));
  document.getElementById('metro-play-btn').classList.remove('playing');
  document.getElementById('metro-play-btn').innerHTML = '▶';
}

function highlightBeat(beat, totalBeats, isAccent) {
  document.querySelectorAll('.beat-dot').forEach((d, i) => {
    d.classList.toggle('active', i === beat);
  });
}

function renderMetronome() {
  const tala = TALAM_PATTERNS[State.metro.tala];
  document.getElementById('screen-metronome').innerHTML = `
    <div class="section-hero">
      <h2>Metronome</h2>
      <div class="sub">Talam & BPM</div>
    </div>

    <div class="metro-display">
      <div class="metro-bpm" id="metro-bpm-display">${State.metro.bpm}</div>
      <div class="metro-bpm-label">BPM</div>
    </div>

    <div class="metro-slider-wrap">
      <button class="metro-slider-btn" onclick="changeBPM(-5)">−</button>
      <input type="range" min="30" max="200" value="${State.metro.bpm}" id="bpm-slider"
        oninput="setBPM(+this.value)">
      <button class="metro-slider-btn" onclick="changeBPM(+5)">+</button>
    </div>

    <div class="metro-preset-label">Common Tempos</div>
    <div class="metro-presets">
      ${[40,60,80,100,120].map(b => `
        <button class="preset-btn" onclick="setBPM(${b})">${b}</button>
      `).join('')}
    </div>

    <div class="section-label">Select Talam</div>
    <div class="tala-selector">
      ${Object.entries(TALAM_PATTERNS).map(([id, t]) => `
        <button class="tala-btn ${State.metro.tala === id ? 'active' : ''}"
          onclick="setTala('${id}')">
          <b>${t.nameEn}</b><br>
          <small style="color:var(--text3)">${t.beats} beats</small>
        </button>
      `).join('')}
    </div>

    <div class="beat-visual" id="beat-visual">
      ${Array.from({length: tala.beats}, (_, i) => `
        <div class="beat-dot ${tala.accents.includes(i) ? 'accent' : ''}"></div>
      `).join('')}
    </div>

    <button class="metro-play-btn ${State.metro.playing ? 'playing' : ''}"
      id="metro-play-btn" onclick="toggleMetro()">
      ${State.metro.playing ? '⏸' : '▶'}
    </button>
  `;
}

function toggleMetro() {
  if (State.metro.playing) stopMetronome();
  else startMetronome();
}

function setBPM(val) {
  State.metro.bpm = Math.max(30, Math.min(200, val));
  document.getElementById('metro-bpm-display').textContent = State.metro.bpm;
  const slider = document.getElementById('bpm-slider');
  if (slider) slider.value = State.metro.bpm;
  if (State.metro.playing) { stopMetronome(); startMetronome(); }
}

function changeBPM(delta) {
  setBPM(State.metro.bpm + delta);
}

function setTala(talaId) {
  State.metro.tala = talaId;
  if (State.metro.playing) stopMetronome();
  renderMetronome();
}

// ── QUIZ ───────────────────────────────────────────────────
function renderQuiz() {
  document.getElementById('screen-quiz').innerHTML = `
    <div class="section-hero">
      <h2>Quiz</h2>
      <div class="sub">Music Quiz</div>
    </div>

    <div class="quiz-score-bar">
      <div><div class="quiz-stat-val" id="q-score">${State.quiz.score}</div><div class="quiz-stat-lbl">Correct</div></div>
      <div><div class="quiz-stat-val" id="q-total">${State.quiz.total}</div><div class="quiz-stat-lbl">Total</div></div>
      <div><div class="quiz-stat-val" id="q-streak">${State.quiz.streak}</div><div class="quiz-stat-lbl">Streak</div></div>
    </div>

    <div class="section-label">Select Section</div>
    <div class="quiz-mode-selector">
      ${[
        ['sarali',    'Sarali Varisai'],
        ['janta',     'Janta Varisai'],
        ['dhattu',    'Dhattu Varisai'],
        ['mixed',     'Mixed']
      ].map(([id, label]) => `
        <button class="quiz-mode-btn ${State.quiz.mode === id ? 'active' : ''}"
          onclick="setQuizMode('${id}')">${label}</button>
      `).join('')}
    </div>

    <div id="quiz-card-container"></div>
  `;

  nextQuestion();
}

function setQuizMode(mode) {
  State.quiz.mode = mode;
  State.quiz.score = 0;
  State.quiz.total = 0;
  State.quiz.streak = 0;
  renderQuiz();
}

function getQuizPool() {
  const mode = State.quiz.mode;
  let pool = [];
  if (mode === 'mixed' || mode === 'sarali')  pool.push(...CARNATIC_DATA.sarali.exercises.map(e => ({...e, section: 'sarali', sectionLabel: 'Sarali Varisai'})));
  if (mode === 'mixed' || mode === 'janta')   pool.push(...CARNATIC_DATA.janta.exercises.map(e => ({...e, section: 'janta',  sectionLabel: 'Janta Varisai'})));
  if (mode === 'mixed' || mode === 'dhattu')  pool.push(...CARNATIC_DATA.dhattu.exercises.map(e => ({...e, section: 'dhattu',sectionLabel: 'Dhattu Varisai'})));
  return pool;
}

function nextQuestion() {
  const pool = getQuizPool();
  if (pool.length < 4) return;

  // Pick random exercise
  const idx = Math.floor(Math.random() * pool.length);
  const correct = pool[idx];

  // Pick 3 wrong answers (same section or different)
  const wrong = pool.filter((_, i) => i !== idx)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const options = [correct, ...wrong].sort(() => Math.random() - 0.5);

  State.quiz.currentQ = { correct, options };
  State.quiz.answered = false;

  const container = document.getElementById('quiz-card-container');
  if (!container) return;

  // Randomly pick question type
  const qType = Math.random() < 0.5 ? 'name' : 'pattern';

  let questionText, patternText;
  if (qType === 'name') {
    questionText = `Which exercise has this ascending pattern?`;
    patternText = swarasToLatin(stripHTML(correct.aro));
    container.innerHTML = buildQuizCard(questionText, patternText, options, correct, 'nameEn');
  } else {
    questionText = `Which pattern belongs to "${correct.nameEn}"?`;
    patternText = `Exercise ${correct.num} — ${correct.nameEn}`;
    container.innerHTML = buildQuizCard(questionText, patternText, options.map(o => ({...o, _label: `${o.nameEn}`})), correct, '_label', true);
  }
}

function stripHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || html;
}

function buildQuizCard(question, pattern, options, correct, answerField, isNameQuiz = false) {
  return `
    <div class="quiz-card">
      <div class="quiz-card-header">Exercise ${correct.num} — ${correct.sectionLabel || 'Sarali Varisai'}</div>
      <div class="quiz-question">${question}</div>
      <div class="quiz-pattern">${pattern}</div>
      <div class="quiz-options">
        ${options.map((opt, i) => {
          const label = isNameQuiz ? opt.nameEn : (opt[answerField] || opt.nameEn);
          return `<button class="quiz-option" onclick="answerQuiz(${i})" id="qopt-${i}">
            ${label}
          </button>`;
        }).join('')}
      </div>
      <div class="quiz-result" id="quiz-result">
        <div class="quiz-result-icon" id="quiz-result-icon"></div>
        <div class="quiz-result-text" id="quiz-result-text"></div>
        <button class="quiz-next-btn" onclick="nextQuestion()">Next →</button>
      </div>
    </div>
  `;
}

function answerQuiz(selectedIdx) {
  if (State.quiz.answered) return;
  State.quiz.answered = true;
  State.quiz.total++;
  document.getElementById('q-total').textContent = State.quiz.total;

  const { correct, options } = State.quiz.currentQ;
  const selected = options[selectedIdx];
  const isCorrect = selected.num === correct.num && selected.section === correct.section;

  options.forEach((opt, i) => {
    const btn = document.getElementById(`qopt-${i}`);
    if (!btn) return;
    const isCor = opt.num === correct.num && opt.section === correct.section;
    if (isCor) btn.classList.add('correct');
    else if (i === selectedIdx) btn.classList.add('wrong');
  });

  const result = document.getElementById('quiz-result');
  const icon = document.getElementById('quiz-result-icon');
  const text = document.getElementById('quiz-result-text');

  if (isCorrect) {
    State.quiz.score++;
    State.quiz.streak++;
    icon.textContent = '🎉';
    text.textContent = 'Correct!';
    document.getElementById('q-score').textContent = State.quiz.score;
    document.getElementById('q-streak').textContent = State.quiz.streak;
  } else {
    State.quiz.streak = 0;
    icon.textContent = '❌';
    text.innerHTML = `Wrong! Correct answer: <b>${correct.nameEn}</b>`;
    document.getElementById('q-streak').textContent = 0;
  }

  result.classList.add('show');
}

// ── SWARA TUNER ────────────────────────────────────────
function renderTunerCard() {
  const opts = SHRUTI_LIST.map(s =>
    `<option value="${s.hz}"${s.hz === State.tuner.shrutiHz ? ' selected' : ''}>${s.note} (${Math.round(s.hz)} Hz)</option>`
  ).join('');
  return `
    <div class="tuner-card" id="tuner-card">
      <div class="tuner-header">
        <div class="tuner-title">&#127908; Swara Tuner</div>
        <div class="tuner-sub">Live Swara Validation</div>
      </div>
      <div class="tuner-shruti-row">
        <span>Shruti (Sa):</span>
        <select id="tuner-shruti" onchange="setTunerShruti(+this.value)">${opts}</select>
      </div>
      <div class="tuner-display" id="tuner-display">
        <div class="tuner-swara-name" id="tuner-swara-name">&#8212;</div>
        <div class="tuner-cents" id="tuner-cents">&#8212;</div>
        <div class="tuner-meter">
          <div class="tuner-meter-track">
            <div class="tuner-meter-needle" id="tuner-needle" style="left:50%"></div>
          </div>
          <div class="tuner-meter-labels"><span>-50&#162;</span><span>0</span><span>+50&#162;</span></div>
        </div>
        <div class="tuner-status" id="tuner-status">Silence</div>
      </div>
      <div class="tuner-btns">
        <button class="tuner-btn-hear" onclick="playTunerSa()">&#9834; Hear Sa</button>
        <button class="tuner-btn-mic" id="tuner-mic-btn" onclick="toggleTunerMic()">&#127908; Start</button>
      </div>
    </div>
  `;
}

function updateTunerDisplay(result) {
  const nameEl   = document.getElementById('tuner-swara-name');
  const centsEl  = document.getElementById('tuner-cents');
  const needle   = document.getElementById('tuner-needle');
  const statusEl = document.getElementById('tuner-status');
  const display  = document.getElementById('tuner-display');
  if (!nameEl) return;

  if (!result) {
    nameEl.textContent   = '\u2014';
    centsEl.textContent  = '\u2014';
    needle.style.left    = '50%';
    statusEl.textContent = 'Silence';
    display.className    = 'tuner-display';
    return;
  }

  nameEl.textContent  = result.swara;
  centsEl.textContent = `${result.cents >= 0 ? '+' : ''}${result.cents}\u00a2`;

  const pos = Math.max(2, Math.min(98, 50 + (result.cents / 50) * 50));
  needle.style.left = `${pos}%`;

  if (!result.inRaga) {
    statusEl.textContent = '\u26a0\ufe0f Not in Raga';
    display.className    = 'tuner-display tuner-warn';
  } else if (result.inTune) {
    statusEl.textContent = '\u2713 In Tune!';
    display.className    = 'tuner-display tuner-good';
  } else {
    statusEl.textContent = result.cents > 0 ? '\u2191 Sharp' : '\u2193 Flat';
    display.className    = 'tuner-display tuner-off';
  }
}

async function toggleTunerMic() {
  const btn = document.getElementById('tuner-mic-btn');
  if (State.tuner.active) {
    pitchDetector.stop();
    State.tuner.active = false;
    if (btn) { btn.textContent = '\ud83c\udf99\ufe0f Start'; btn.classList.remove('active'); }
    updateTunerDisplay(null);
  } else {
    try {
      pitchDetector.setShruti(State.tuner.shrutiHz);
      await pitchDetector.start(updateTunerDisplay);
      State.tuner.active = true;
      if (btn) { btn.textContent = '\u23f9 Stop'; btn.classList.add('active'); }
    } catch {
      showToast('Mic access needed');
    }
  }
}

function setTunerShruti(hz) {
  State.tuner.shrutiHz = hz;
  pitchDetector.setShruti(hz);
}

function playTunerSa() {
  pitchDetector.setShruti(State.tuner.shrutiHz);
  pitchDetector.playSwaraTone(0); // 0 = Sa
}

// ── TOAST ──────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── BACK BUTTON ────────────────────────────────────────────
function handleBack() {
  if (State.detailOpen) {
    closeDetail();
    return;
  }
  if (State.currentTab === 'exercises') {
    navigate('home');
  }
}

// ── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Bottom nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (State.metro.playing && item.dataset.tab !== 'metronome') stopMetronome();
      navigate(item.dataset.tab);
    });
  });

  // Header back
  document.getElementById('header-back').addEventListener('click', handleBack);

  // Android back button (PWA)
  window.addEventListener('popstate', handleBack);
  history.pushState({}, '');

  // Initial render
  navigate('home');
});
