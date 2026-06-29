// ============================================================
// CARNATIC MUSIC APP — DATA
// All exercise data: Sarali, Janta, Dhattu, Alankaram
// ============================================================

const T = {
  S: 'ஸ', R: 'ரி', G: 'க', M: 'ம', P: 'ப', D: 'த', N: 'நி',
  Su: '<span class="tara">Ṡ</span>',   // upper Sa
  Ru: '<span class="tara">Ṙ</span>',
  Gu: '<span class="tara">Ġ</span>',
  Mu: '<span class="tara">Ṁ</span>',
  Pu: '<span class="tara">Ṗ</span>',
  Du: '<span class="tara">Ḋ</span>',
  Nu: '<span class="tara">Ṅ</span>',
  Suu: '<span class="tara">Ṡṡ</span>', // highest Sa
  Nl: '<span class="mandra">ṇ</span>', // lower Ni
  Sl: '<span class="mandra">Ṣ</span>'  // lower Sa
};

// ============================================================
// SARALI VARISAI — 16 exercises
// ============================================================
const SARALI = [
  {
    num: 1,
    nameTamil: 'அடிப்படை வரிசை',
    nameEn: 'Basic Scale',
    aro: `ஸ  ரி  க  ம  ப  த  நி  ${T.Su}`,
    avaro: `${T.Su}  நி  த  ப  ம  க  ரி  ஸ`
  },
  {
    num: 2,
    nameTamil: 'இரட்டை சுரம்',
    nameEn: 'Double Notes',
    aro: `ஸஸ  ரிரி  கக  மம  பப  தத  நிநி  ${T.Su}${T.Su}`,
    avaro: `${T.Su}${T.Su}  நிநி  தத  பப  மம  கக  ரிரி  ஸஸ`
  },
  {
    num: 3,
    nameTamil: 'ஒன்று திரும்பி',
    nameEn: 'Alternating — Back 1',
    aro: `ஸரி ஸரி  |  கம கம  |  பத பத  |  நி${T.Su} நி${T.Su}`,
    avaro: `${T.Su}நி ${T.Su}நி  |  தப தப  |  மக மக  |  ரிஸ ரிஸ`
  },
  {
    num: 4,
    nameTamil: 'இரண்டு திரும்பி',
    nameEn: 'Back 2',
    aro: `ஸரிக ரி  |  ஸரிக ம  |  பதநி த  |  பதநி ${T.Su}`,
    avaro: `${T.Su}நித நி  |  பதநி ம  |  கரிஸ ரி  |  கரிஸ ஸ`
  },
  {
    num: 5,
    nameTamil: 'மூன்று திரும்பி',
    nameEn: 'Back 3',
    aro: `ஸரிகம கரி  |  ஸரிகம பமகரி  |  கமபத நி${T.Su}`,
    avaro: `${T.Su}நிதப மதப  |  மகரிஸ ரிக  |  ரிஸ`
  },
  {
    num: 6,
    nameTamil: 'மூன்றாம் இடைவெளி',
    nameEn: '3rd Intervals',
    aro: `ஸக  ரிம  கப  மத  பநி  த${T.Su}`,
    avaro: `${T.Su}த  நிப  தம  பக  மரி  கஸ`
  },
  {
    num: 7,
    nameTamil: 'நான்காம் இடைவெளி',
    nameEn: '4th Intervals',
    aro: `ஸம  ரிப  கத  மநி  ப${T.Su}`,
    avaro: `${T.Su}ப  நிம  தக  பரி  மஸ`
  },
  {
    num: 8,
    nameTamil: 'நான்கு சுர தொகுப்பு',
    nameEn: 'Rolling Groups of 4',
    aro: `[ஸரிகம] [ரிகமப] [கமபத] [மபதநி] [பதநி${T.Su}]`,
    avaro: `[${T.Su}நிதப] [நிதபம] [தபமக] [பமகரி] [மகரிஸ]`,
    grouped: true
  },
  {
    num: 9,
    nameTamil: 'ஐந்து சுர தொகுப்பு',
    nameEn: 'Rolling Groups of 5',
    aro: `[ஸரிகமப] [ரிகமபத] [கமபதநி] [மபதநி${T.Su}]`,
    avaro: `[${T.Su}நிதபம] [நிதபமக] [தபமகரி] [பமகரிஸ]`,
    grouped: true
  },
  {
    num: 10,
    nameTamil: 'ஆறு சுர தொகுப்பு',
    nameEn: 'Rolling Groups of 6',
    aro: `[ஸரிகமபத] [ரிகமபதநி] [கமபதநி${T.Su}]`,
    avaro: `[${T.Su}நிதபமக] [நிதபமகரி] [தபமகரிஸ]`,
    grouped: true
  },
  {
    num: 11,
    nameTamil: 'இரட்டை + அடுத்த சுரம்',
    nameEn: 'Double + Next Note',
    aro: `ஸஸரி  |  ரிரிக  |  ககம  |  மமப  |  பபத  |  தத நி  |  நிநி${T.Su}`,
    avaro: `${T.Su}${T.Su}நி  |  நிநித  |  தத ப  |  பபம  |  மமக  |  ககரி  |  ரிரிஸ`
  },
  {
    num: 12,
    nameTamil: 'ஏழு சுர தொகுப்பு',
    nameEn: 'Rolling Groups of 7',
    aro: `[ஸரிகமபதநி] [ரிகமபதநி${T.Su}]`,
    avaro: `[${T.Su}நிதபமகரி] [நிதபமகரிஸ]`,
    grouped: true
  },
  {
    num: 13,
    nameTamil: 'ஐந்தாம் இடைவெளி',
    nameEn: '5th Intervals',
    aro: `ஸப  ரித  கநி  ம${T.Su}`,
    avaro: `${T.Su}ம  நிக  தரி  பஸ`
  },
  {
    num: 14,
    nameTamil: 'மந்த்ர ஸ்தாயி இணைப்பு',
    nameEn: 'Lower Octave Connection',
    aro: `${T.Nl}  ஸ  ரி  க  ம  ப  த  நி  ${T.Su}`,
    avaro: `${T.Su}  நி  த  ப  ம  க  ரி  ஸ  ${T.Nl}`,
    note: 'ṇ = Lower octave Ni (Mandra Sthayi Nishadam)'
  },
  {
    num: 15,
    nameTamil: 'இரண்டு ஸ்தாயி வரிசை',
    nameEn: 'Two Octave Run',
    aro: `ஸ ரி க ம ப த நி ${T.Su}  |  ${T.Su} ${T.Ru} ${T.Gu} ${T.Mu} ${T.Pu} ${T.Du} ${T.Nu} ${T.Suu}`,
    avaro: `${T.Suu} ${T.Nu} ${T.Du} ${T.Pu} ${T.Mu} ${T.Gu} ${T.Ru} ${T.Su}  |  ${T.Su} நி த ப ம க ரி ஸ`,
    note: 'Ṙ Ġ Ṁ Ṗ Ḋ Ṅ = Upper octave notes (Tara Sthayi)'
  },
  {
    num: 16,
    nameTamil: 'மூன்று ஸ்தாயி — முழு வரிசை',
    nameEn: 'Three Octave Comprehensive',
    aro: `${T.Sl} ${T.Nl}  ஸ ரி க ம ப த நி  ${T.Su} ${T.Ru} ${T.Gu} ${T.Mu} ${T.Pu} ${T.Du} ${T.Nu} ${T.Suu}`,
    avaro: `${T.Suu} ${T.Nu} ${T.Du} ${T.Pu} ${T.Mu} ${T.Gu} ${T.Ru} ${T.Su}  நி த ப ம க ரி ஸ  ${T.Nl} ${T.Sl}`,
    note: 'Ṣ = Lower Sa | Madhya = S to Ni | Tara = Ṡ onwards'
  }
];

// ============================================================
// JANTA VARISAI — 7 exercises
// ============================================================
const JANTA = [
  {
    num: 1,
    nameTamil: 'அடிப்படை ஜந்த',
    nameEn: 'Basic Janta',
    aro: `ஸஸ ரிரி கக மம பப தத நிநி ${T.Su}${T.Su}`,
    avaro: `${T.Su}${T.Su} நிநி தத பப மம கக ரிரி ஸஸ`
  },
  {
    num: 2,
    nameTamil: 'மாறி மாறி ஜந்த',
    nameEn: 'Alternating Janta',
    aro: `ஸரி ஸரி  |  கம கம  |  பத பத  |  நி${T.Su} நி${T.Su}`,
    avaro: `${T.Su}நி ${T.Su}நி  |  தப தப  |  மக மக  |  ரிஸ ரிஸ`
  },
  {
    num: 3,
    nameTamil: 'மூன்று ஜந்த',
    nameEn: 'Triple Janta',
    aro: `ஸஸரி ரிரிக கக ம மம ப பப த தத நி நிநி ${T.Su}`,
    avaro: `${T.Su}${T.Su}நி நிநித தத ப பப ம மம க கக ரி ரிரிஸ`
  },
  {
    num: 4,
    nameTamil: 'நாலு ஜந்த',
    nameEn: 'Four-Count Janta',
    aro: `ஸஸஸஸ ரிரிரிரி கககக மமமம பபப ப தததத நிநிநிநி ${T.Su}${T.Su}${T.Su}${T.Su}`,
    avaro: `${T.Su}${T.Su}${T.Su}${T.Su} நிநிநிநி தததத பபப ப மமமம கககக ரிரிரிரி ஸஸஸஸ`
  },
  {
    num: 5,
    nameTamil: 'ஜந்த + அடுத்த சுரம்',
    nameEn: 'Janta + Skip',
    aro: `ஸஸரி ரிரிக கக ம மமப பப த ததநி நிநி${T.Su}`,
    avaro: `${T.Su}${T.Su}நி நிநித தத ப பபம மம க ககரி ரிரிஸ`
  },
  {
    num: 6,
    nameTamil: 'கலவை ஜந்த',
    nameEn: 'Mixed Janta',
    aro: `ஸஸ ரி ரிரி க கக ம மம ப பப த தத நி நிநி ${T.Su}`,
    avaro: `${T.Su}${T.Su} நி நிநி த தத ப பப ம மம க கக ரி ரிரி ஸ`
  },
  {
    num: 7,
    nameTamil: 'முழு ஜந்த வரிசை',
    nameEn: 'Full Janta Run',
    aro: `[ஸஸரிரி] [கக மம] [பப தத] [நிநி ${T.Su}${T.Su}]`,
    avaro: `[${T.Su}${T.Su}நிநி] [தத பப] [மம கக] [ரிரி ஸஸ]`,
    grouped: true
  }
];

// ============================================================
// DHATTU VARISAI — 7 exercises
// ============================================================
const DHATTU = [
  {
    num: 1,
    nameTamil: 'மூன்றாம் தாட்டு',
    nameEn: '3rd Leap',
    aro: `ஸக  ரிம  கப  மத  பநி  த${T.Su}`,
    avaro: `${T.Su}த  நிப  தம  பக  மரி  கஸ`
  },
  {
    num: 2,
    nameTamil: 'நான்காம் தாட்டு',
    nameEn: '4th Leap',
    aro: `ஸம  ரிப  கத  மநி  ப${T.Su}`,
    avaro: `${T.Su}ப  நிம  தக  பரி  மஸ`
  },
  {
    num: 3,
    nameTamil: 'ஐந்தாம் தாட்டு',
    nameEn: '5th Leap',
    aro: `ஸப  ரித  கநி  ம${T.Su}`,
    avaro: `${T.Su}ம  நிக  தரி  பஸ`
  },
  {
    num: 4,
    nameTamil: 'இரட்டை தாட்டு',
    nameEn: 'Double Leap',
    aro: `ஸக ரிம  ரிம கப  கப மத  மத பநி  பநி த${T.Su}`,
    avaro: `${T.Su}த நிப  நிப தம  தம பக  பக மரி  மரி கஸ`
  },
  {
    num: 5,
    nameTamil: 'மூன்று + திரும்பி தாட்டு',
    nameEn: '3rd Leap with Return',
    aro: `ஸக ஸரி  ரிம ரிக  கப கம  மத மப  பநி பத  த${T.Su} தநி`,
    avaro: `${T.Su}த ${T.Su}நி  நிப நிதத  தம தப  பக பம  மரி மக  கஸ கரி`
  },
  {
    num: 6,
    nameTamil: 'கலவை தாட்டு',
    nameEn: 'Mixed Leaps',
    aro: `ஸம கப  ரிப மத  கத பநி  மநி த${T.Su}`,
    avaro: `${T.Su}ப நிம  நிக தப  தரி பம  பஸ மக`
  },
  {
    num: 7,
    nameTamil: 'முழு தாட்டு வரிசை',
    nameEn: 'Full Dhattu Run',
    aro: `ஸக ரிம கப மத பநி த${T.Su}  ரிம கப மத பநி த${T.Su} ${T.Su}${T.Ru}`,
    avaro: `${T.Su}த நிப தம பக மரி கஸ  நிப தம பக மரி கஸ ஸ${T.Nl}`
  }
];

// ============================================================
// ALANKARAMS — 7 talas × 5 patterns = 35
// ============================================================

// The 5 base swara patterns (in Adi tala notation)
// Pattern repeated in all 7 talas
const ALANKARAM_PATTERNS = [
  {
    patternNum: 1,
    nameTamil: 'முதல் அலங்காரம்',
    nameEn: 'Alankaram 1',
    desc: 'ஏறு படி (Ascending steps)',
    aro: `ஸ | ஸரி | ஸரிக | ஸரிகம | ஸரிகமப | ஸரிகமபத | ஸரிகமபதநி | ஸரிகமபதநி${T.Su}`,
    avaro: `${T.Su} | ${T.Su}நி | ${T.Su}நித | ${T.Su}நிதப | ${T.Su}நிதபம | ${T.Su}நிதபமக | ${T.Su}நிதபமகரி | ${T.Su}நிதபமகரிஸ`
  },
  {
    patternNum: 2,
    nameTamil: 'இரண்டாம் அலங்காரம்',
    nameEn: 'Alankaram 2',
    desc: 'இரட்டை நடை (Double steps)',
    aro: `ஸரி கம பத நி${T.Su}  |  ஸரி கம பத நி${T.Su}`,
    avaro: `${T.Su}நி தப மக ரிஸ  |  ${T.Su}நி தப மக ரிஸ`
  },
  {
    patternNum: 3,
    nameTamil: 'மூன்றாம் அலங்காரம்',
    nameEn: 'Alankaram 3',
    desc: 'திரும்பு நடை (Turn pattern)',
    aro: `ஸரிஸ ரிகரி கமக மபம பதப தநித நி${T.Su}நி`,
    avaro: `${T.Su}நி${T.Su} நிதநி தபத பமப மகம கரிக ரிஸரி`
  },
  {
    patternNum: 4,
    nameTamil: 'நான்காம் அலங்காரம்',
    nameEn: 'Alankaram 4',
    desc: 'குழு நடை (Group pattern)',
    aro: `[ஸரிக] [ரிகம] [கமப] [மபத] [பதநி] [தநி${T.Su}]`,
    avaro: `[${T.Su}நித] [நிதப] [தபம] [பமக] [மகரி] [கரிஸ]`,
    grouped: true
  },
  {
    patternNum: 5,
    nameTamil: 'ஐந்தாம் அலங்காரம்',
    nameEn: 'Alankaram 5',
    desc: 'கலவை நடை (Mixed pattern)',
    aro: `ஸஸரி ரிரிக கக ம  |  ململ ப பப த தத நி  |  நிநி${T.Su}`,
    avaro: `${T.Su}${T.Su}நி நிநித தத ப  |  பப ம மம க கக ரி  |  ரிரிஸ`
  }
];

const TALAS = [
  { id: 'dhruva',   nameTamil: 'த்ருவ தாளம்',   nameEn: 'Dhruva Talam',   beats: 14, pattern: '| x oo | oo | oo | oo |' },
  { id: 'mathya',   nameTamil: 'மத்ய தாளம்',    nameEn: 'Mathya Talam',   beats: 8,  pattern: '| x oo | o | oo |' },
  { id: 'rupaka',   nameTamil: 'ரூபக தாளம்',    nameEn: 'Rupaka Talam',   beats: 6,  pattern: '| 0 | oo |' },
  { id: 'jhampa',   nameTamil: 'ஜம்பை தாளம்',   nameEn: 'Jhampa Talam',   beats: 10, pattern: '| x oo | o | x |' },
  { id: 'triputa',  nameTamil: 'திரிபுட தாளம்', nameEn: 'Triputa Talam',  beats: 7,  pattern: '| x oo | o | o |' },
  { id: 'ata',      nameTamil: 'அட தாளம்',      nameEn: 'Ata Talam',      beats: 14, pattern: '| x oooo | x oooo | o | o |' },
  { id: 'eka',      nameTamil: 'ஏக தாளம்',      nameEn: 'Eka Talam',      beats: 4,  pattern: '| x ooo |' }
];

// Build 35 alankarams (7 talas × 5 patterns)
const ALANKARAMS = [];
TALAS.forEach((tala, ti) => {
  ALANKARAM_PATTERNS.forEach((pat, pi) => {
    ALANKARAMS.push({
      id: `a${ti + 1}_${pi + 1}`,
      num: ti * 5 + pi + 1,
      tala: tala,
      pattern: pat,
      nameTamil: `${tala.nameTamil} — ${pat.nameTamil}`,
      nameEn: `${tala.nameEn} — ${pat.nameEn}`,
      aro: pat.aro,
      avaro: pat.avaro,
      grouped: pat.grouped || false
    });
  });
});

// ============================================================
// QUIZ DATA — generated from exercises
// ============================================================
function buildQuizQuestions() {
  const questions = [];

  SARALI.forEach(ex => {
    questions.push({
      type: 'identify',
      section: 'sarali',
      question: `இந்த வரிசையின் பெயர் என்ன? (Varisai ${ex.num})`,
      pattern: ex.aro,
      answer: ex.nameTamil,
      options: null // generated at runtime
    });
  });

  JANTA.forEach(ex => {
    questions.push({
      type: 'identify',
      section: 'janta',
      question: `இந்த ஜந்த வரிசை எது?`,
      pattern: ex.aro,
      answer: ex.nameTamil,
      options: null
    });
  });

  return questions;
}

// ============================================================
// METRONOME TALAM PATTERNS
// ============================================================
const TALAM_PATTERNS = {
  adi: {
    name: 'ஆதி தாளம்',
    nameEn: 'Adi Talam',
    beats: 8,
    accents: [0, 4],       // beat indices that get strong accent
    pattern: ['clap', 'tap', 'tap', 'tap', 'wave', 'tap', 'tap', 'tap']
  },
  rupaka: {
    name: 'ரூபக தாளம்',
    nameEn: 'Rupaka Talam',
    beats: 6,
    accents: [0, 3],
    pattern: ['wave', 'tap', 'tap', 'clap', 'tap', 'tap']
  },
  misra_chapu: {
    name: 'மிஸ்ர சாபு',
    nameEn: 'Misra Chapu',
    beats: 7,
    accents: [0, 3, 5],
    pattern: ['clap', 'tap', 'tap', 'wave', 'tap', 'wave', 'tap']
  },
  khanda_chapu: {
    name: 'கண்ட சாபு',
    nameEn: 'Khanda Chapu',
    beats: 5,
    accents: [0, 2],
    pattern: ['clap', 'tap', 'clap', 'tap', 'tap']
  }
};

// ============================================================
// EXPORT
// ============================================================
const CARNATIC_DATA = {
  sarali: {
    id: 'sarali',
    titleTamil: 'சரளி வரிசை',
    titleEn: 'Sarali Varisai',
    raga: 'Mayamalavagowla',
    tala: 'Adi Talam',
    icon: '1️⃣',
    color: '#8B1A1A',
    count: SARALI.length,
    exercises: SARALI
  },
  janta: {
    id: 'janta',
    titleTamil: 'ஜந்த வரிசை',
    titleEn: 'Janta Varisai',
    raga: 'Mayamalavagowla',
    tala: 'Adi Talam',
    icon: '2️⃣',
    color: '#1A4A8B',
    count: JANTA.length,
    exercises: JANTA
  },
  dhattu: {
    id: 'dhattu',
    titleTamil: 'தட்டு வரிசை',
    titleEn: 'Dhattu Varisai',
    raga: 'Mayamalavagowla',
    tala: 'Adi Talam',
    icon: '3️⃣',
    color: '#1A6B3C',
    count: DHATTU.length,
    exercises: DHATTU
  },
  alankaram: {
    id: 'alankaram',
    titleTamil: 'அலங்காரம்',
    titleEn: 'Alankaram',
    raga: 'Mayamalavagowla',
    tala: 'Sapta Talams',
    icon: '🎶',
    color: '#6B1A6B',
    count: ALANKARAMS.length,
    exercises: ALANKARAMS,
    talas: TALAS,
    patterns: ALANKARAM_PATTERNS
  }
};
