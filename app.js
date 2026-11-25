/* Ruang Belajar Matematika - logika aplikasi
   Dibuat oleh Andy Kurniawan, S.Pd.SD - SDN SP 3 Prode */
(function () {
  'use strict';

  var TOP = window.TOPICS;
  var $app = document.getElementById('app');
  var KEY = 'rbm_progress_v1';
  var KKM = 75;

  /* ---------- penyimpanan ---------- */
  var store = load();
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.topics) return s; } catch (e) {}
    return { name: '', topics: {} };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }
  function empty() { return { attempts: 0, best: null, last: null, history: [], wrong: [], read: false }; }
  function st(id) { return store.topics[id] || empty(); }
  function tp(id) { if (!store.topics[id]) store.topics[id] = empty(); return store.topics[id]; }

  /* ---------- utilitas ---------- */
  function byId(id) { for (var i = 0; i < TOP.length; i++) if (TOP[i].id === id) return TOP[i]; return null; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function math(s) { return String(s).replace(/(\d+)\/(\d+)/g, '<span class="frac"><span class="n">$1</span><span class="d">$2</span></span>'); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function go(h) { if (location.hash === h) route(); else location.hash = h; }
  function status(id) {
    var s = st(id);
    if (!s.attempts) return '<span class="chip">Belum mulai</span>';
    if (s.best >= KKM) return '<span class="chip ok">✅ Tuntas</span>';
    return '<span class="chip warn">Terus berlatih</span>';
  }

  var ui = { tab: 'materi', count: 10, filter: 'all' };
  var Q = null;   // sesi kuis
  var RES = null; // hasil terakhir

  /* ---------- router ---------- */
  function route() {
    var parts = location.hash.replace(/^#\/?/, '').split('/');
    var p = parts[0], arg = parts[1];
    window.scrollTo(0, 0);
    var links = document.querySelectorAll('[data-nav]');
    for (var i = 0; i < links.length; i++) links[i].classList.toggle('on', links[i].getAttribute('data-nav') === (p === 'progres' ? 'progres' : 'home'));
    if (p === 'materi') return viewMateri(arg);
    if (p === 'latihan') return viewSetup(arg);
    if (p === 'kuis') return viewQuiz();
    if (p === 'hasil') return viewResult();
    if (p === 'progres') return viewProgress();
    return viewHome();
  }
  window.addEventListener('hashchange', route);

  /* ---------- beranda ---------- */
  function viewHome() {
    var nm = store.name ? ', ' + esc(store.name) : '';
    var cards = TOP.map(function (t) {
      var s = st(t.id);
      return '<article class="card tcard" style="--c:' + t.warna + '">' +
        '<div class="row" style="justify-content:space-between"><div class="ic" aria-hidden="true">' + t.ikon + '</div>' + status(t.id) + '</div>' +
        '<h3>' + esc(t.nama) + '</h3><p>' + esc(t.desc) + '</p>' +
        '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + (s.best || 0) + '"><i style="width:' + (s.best || 0) + '%"></i></div>' +
        '<div class="stat"><span>Nilai terbaik: <b>' + (s.best == null ? '-' : s.best) + '</b></span><span>' + t.bank.length + ' soal</span></div>' +
        '<div class="row"><a class="btn sm" href="#/materi/' + t.id + '">📖 Belajar</a><a class="btn alt sm" href="#/latihan/' + t.id + '">✏️ Latihan</a></div>' +
        '</article>';
    }).join('');
    $app.innerHTML =
      '<section class="banner" aria-label="Ucapan Hari Guru Nasional">' +
        '<span class="deco" aria-hidden="true">🍎</span><span class="deco2" aria-hidden="true">📚</span>' +
        '<h2>🎉 Selamat Hari Guru Nasional 🎉</h2>' +
        '<p>Terima kasih, Bapak dan Ibu Guru, atas ilmu, kesabaran, dan ketulusan yang selalu membimbing kami belajar.</p>' +
        '<span class="by">Aplikasi ini dibuat oleh <b>Andy Kurniawan, S.Pd.SD</b> · SDN SP 3 Prode</span>' +
      '</section>' +
      '<section class="card hero">' +
        '<div><h1>Halo' + nm + '! 👋</h1><p class="muted">Selamat datang di <b>Ruang Belajar Matematika</b>. Pilih materi, pelajari, lalu uji kemampuanmu lewat latihan soal.</p></div>' +
        '<form class="name-box" data-form="name"><label for="nm" class="muted">Nama kamu:</label>' +
        '<input id="nm" type="text" maxlength="30" placeholder="Tulis namamu di sini" value="' + esc(store.name) + '" autocomplete="off">' +
        '<button class="btn sm" type="submit">Simpan</button></form>' +
      '</section>' +
      '<h2>Pilih Materi</h2><div class="grid">' + cards + '</div>';
  }

  /* ---------- materi ---------- */
  function viewMateri(id) {
    var t = byId(id); if (!t) return go('#/home');
    tp(id).read = true; save();
    if (ui.tid !== id) { ui.tid = id; ui.tab = 'materi'; }
    var body;
    if (ui.tab === 'contoh') {
      body = t.contoh.map(function (c, i) {
        return '<article class="card ex sec"><h3>Contoh ' + (i + 1) + '</h3><p class="soal">' + math(c.s) + '</p><ol>' +
          c.l.map(function (x) { return '<li>' + math(x) + '</li>'; }).join('') + '</ol>' +
          '<div class="jawab">Jawaban: ' + math(c.j) + '</div></article>';
      }).join('');
    } else {
      body = t.materi.map(function (m, i) {
        return '<article class="card sec"><h3><span class="n">' + (i + 1) + '</span>' + esc(m.h) + '</h3>' + math(m.b) + '</article>';
      }).join('');
    }
    $app.innerHTML =
      '<div style="--c:' + t.warna + '"><a class="back" href="#/home">← Beranda</a>' +
      '<div class="pagehead"><div class="ic" aria-hidden="true">' + t.ikon + '</div><h1>' + esc(t.nama) + '</h1></div>' +
      '<div class="tabs" role="tablist">' +
        '<button role="tab" data-act="tab" data-v="materi" class="' + (ui.tab === 'materi' ? 'on' : '') + '" aria-selected="' + (ui.tab === 'materi') + '">📖 Materi</button>' +
        '<button role="tab" data-act="tab" data-v="contoh" class="' + (ui.tab === 'contoh' ? 'on' : '') + '" aria-selected="' + (ui.tab === 'contoh') + '">🧮 Contoh Soal</button></div>' +
      body +
      '<div class="card center"><p><b>Sudah paham?</b> Coba latihan soal untuk mengujinya.</p><a class="btn alt" href="#/latihan/' + t.id + '">✏️ Mulai Latihan</a></div></div>';
  }

  /* ---------- pengaturan latihan ---------- */
  function viewSetup(id) {
    var t = byId(id); if (!t) return go('#/home');
    var s = st(id), nw = s.wrong.length;
    var ch = [10, 20, 30].map(function (n) {
      return '<button class="choice ' + (ui.count === n ? 'on' : '') + '" data-act="count" data-v="' + n + '" aria-pressed="' + (ui.count === n) + '">' + n + '<small>soal</small></button>';
    }).join('');
    $app.innerHTML =
      '<div style="--c:' + t.warna + '"><a class="back" href="#/materi/' + t.id + '">← Kembali ke materi</a>' +
      '<div class="pagehead"><div class="ic" aria-hidden="true">' + t.ikon + '</div><h1>Latihan: ' + esc(t.nama) + '</h1></div>' +
      '<div class="card"><h3>Pilih jumlah soal</h3>' +
      '<div class="choices">' + ch + '</div>' +
      '<div class="info">🔀 Soal dan pilihan jawaban diacak setiap sesi. Bank soal berisi <b>' + t.bank.length + '</b> soal. Jawaban dikoreksi dan pembahasan ditampilkan setelah kamu menyelesaikan latihan.</div>' +
      '<div class="row"><button class="btn alt" data-act="start" data-id="' + t.id + '">🚀 Mulai Latihan</button></div></div>' +
      '<div class="card" style="margin-top:14px"><h3>🔁 Ulangi soal yang salah</h3>' +
      (nw ? '<p>Ada <b>' + nw + '</b> soal yang pernah salah pada materi ini. Kerjakan lagi sampai benar semua!</p><button class="btn ok" data-act="retry" data-id="' + t.id + '">Ulangi ' + nw + ' Soal yang Salah</button>'
          : '<p class="muted">Belum ada soal yang salah tersimpan. Soal yang kamu jawab salah akan muncul di sini.</p>') +
      '</div></div>';
  }

  /* ---------- sesi kuis ---------- */
  function startIds(tid, ids, mode) {
    var t = byId(tid);
    var pool = t.bank.filter(function (b) { return ids.indexOf(b.id) >= 0; });
    var chosen = shuffle(pool).slice(0, 30);
    begin(t, chosen, mode);
  }
  function startNormal(tid, n) {
    var t = byId(tid);
    begin(t, shuffle(t.bank).slice(0, n), 'normal');
  }
  function begin(t, chosen, mode) {
    var qs = chosen.map(function (b) {
      var opts = shuffle([b.ans].concat(b.wrong));
      return { id: b.id, q: b.q, opts: opts, correct: opts.indexOf(b.ans), exp: b.exp };
    });
    Q = { tid: t.id, mode: mode, qs: qs, ans: qs.map(function () { return null; }), i: 0 };
    go('#/kuis');
  }

  function viewQuiz() {
    if (!Q) return go('#/home');
    var t = byId(Q.tid), q = Q.qs[Q.i], n = Q.qs.length;
    var done = Q.ans.filter(function (a) { return a !== null; }).length;
    var opts = q.opts.map(function (o, i) {
      return '<button class="opt ' + (Q.ans[Q.i] === i ? 'sel' : '') + '" data-act="pick" data-i="' + i + '" aria-pressed="' + (Q.ans[Q.i] === i) + '">' +
        '<span class="lt">' + 'ABCD'.charAt(i) + '</span><span>' + math(esc(o)) + '</span></button>';
    }).join('');
    var dots = Q.qs.map(function (_, i) {
      return '<button class="dot ' + (i === Q.i ? 'cur' : (Q.ans[i] !== null ? 'done' : '')) + '" data-act="goto" data-i="' + i + '" aria-label="Soal nomor ' + (i + 1) + '">' + (i + 1) + '</button>';
    }).join('');
    var last = Q.i === n - 1;
    $app.innerHTML =
      '<div style="--c:' + t.warna + '">' +
      '<div class="qhead"><span class="t">' + t.ikon + ' ' + esc(t.nama) + (Q.mode === 'retry' ? ' (ulang soal salah)' : '') + '</span><span>Soal ' + (Q.i + 1) + ' / ' + n + '</span></div>' +
      '<div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + done + '"><i style="width:' + (done / n * 100) + '%"></i></div>' +
      '<div class="card"><p class="qtext">' + (Q.i + 1) + '. ' + math(esc(q.q)) + '</p><div class="opts">' + opts + '</div></div>' +
      '<div class="qnav"><button class="btn ghost" data-act="prev" ' + (Q.i === 0 ? 'disabled' : '') + '>← Sebelumnya</button>' +
      (last ? '<button class="btn ok" data-act="finish">✅ Selesai</button>' : '<button class="btn" data-act="next">Berikutnya →</button>') + '</div>' +
      '<div class="dots" aria-label="Navigasi nomor soal">' + dots + '</div>' +
      '<p class="muted center" style="margin-top:14px">Terjawab ' + done + ' dari ' + n + '. ' + (done === n ? '<button class="btn sm ok" data-act="finish">Selesai &amp; Lihat Nilai</button>' : '') + '</p></div>';
  }

  function finish() {
    var n = Q.qs.length, unanswered = Q.ans.filter(function (a) { return a === null; }).length;
    if (unanswered && !window.confirm('Masih ada ' + unanswered + ' soal yang belum dijawab. Yakin ingin selesai?')) return;
    var ok = 0, okIds = [], wrongIds = [];
    Q.qs.forEach(function (q, i) { if (Q.ans[i] === q.correct) { ok++; okIds.push(q.id); } else wrongIds.push(q.id); });
    var nilai = Math.round(ok / n * 100);
    var s = tp(Q.tid);
    s.attempts++;
    if (Q.mode === 'normal') { s.last = nilai; if (s.best == null || nilai > s.best) s.best = nilai; }
    s.history.push({ d: Date.now(), n: n, ok: ok, nilai: nilai, m: Q.mode });
    if (s.history.length > 30) s.history.shift();
    s.wrong = s.wrong.filter(function (id) { return okIds.indexOf(id) < 0; });
    wrongIds.forEach(function (id) { if (s.wrong.indexOf(id) < 0) s.wrong.push(id); });
    save();
    RES = { tid: Q.tid, mode: Q.mode, qs: Q.qs, ans: Q.ans, ok: ok, n: n, nilai: nilai, wrongIds: wrongIds, empty: unanswered };
    Q = null; ui.filter = 'all';
    go('#/hasil');
  }

  /* ---------- hasil & pembahasan ---------- */
  function viewResult() {
    if (!RES) return go('#/home');
    var t = byId(RES.tid), r = RES;
    var msg = r.nilai >= 90 ? 'Luar biasa! Kamu hebat! 🌟' : r.nilai >= 75 ? 'Bagus sekali! Pertahankan ya! 👏' : r.nilai >= 60 ? 'Cukup baik. Ayo berlatih lagi! 💪' : 'Jangan menyerah! Pelajari materinya lalu coba lagi. 📖';
    var stars = r.nilai >= 90 ? '⭐⭐⭐' : r.nilai >= 75 ? '⭐⭐' : r.nilai >= 50 ? '⭐' : '🌱';
    var items = r.qs.map(function (q, i) {
      var a = r.ans[i], good = a === q.correct;
      if (ui.filter === 'wrong' && good) return '';
      return '<article class="card rv ' + (good ? 'ok' : 'no') + '"><div class="qn">' + (good ? '✅' : '❌') + ' Soal ' + (i + 1) + '</div>' +
        '<div>' + math(esc(q.q)) + '</div>' +
        (a === null ? '<div class="a none">Tidak dijawab</div>' : '<div class="a ' + (good ? 'good' : 'wrong') + '">Jawabanmu: ' + math(esc(q.opts[a])) + '</div>') +
        (good ? '' : '<div class="a good">Jawaban benar: ' + math(esc(q.opts[q.correct])) + '</div>') +
        '<div class="exp">💡 <b>Pembahasan:</b> ' + math(esc(q.exp)) + '</div></article>';
    }).join('');
    if (!items) items = '<div class="card center">🎉 Semua jawabanmu benar!</div>';
    var who = store.name ? esc(store.name) + ', ' : '';
    $app.innerHTML =
      '<div style="--c:' + t.warna + '">' +
      '<section class="score"><div>' + t.ikon + ' ' + esc(t.nama) + (r.mode === 'retry' ? ' (ulang soal salah)' : '') + '</div>' +
      '<div class="stars" aria-hidden="true">' + stars + '</div><div class="big">' + r.nilai + '</div>' +
      '<div class="msg">' + who + msg + '</div>' +
      '<div class="tri"><div><b>' + r.ok + '</b>Benar</div><div><b>' + (r.n - r.ok - r.empty) + '</b>Salah</div><div><b>' + r.empty + '</b>Kosong</div></div>' +
      '<small>Nilai = benar ÷ jumlah soal × 100</small></section>' +
      '<div class="row" style="margin-bottom:12px">' +
      (r.wrongIds.length ? '<button class="btn ok" data-act="retryres">🔁 Ulangi ' + r.wrongIds.length + ' Soal yang Salah</button>' : '') +
      '<a class="btn alt" href="#/latihan/' + t.id + '">✏️ Latihan Lagi</a>' +
      '<a class="btn ghost" href="#/materi/' + t.id + '">📖 Materi</a>' +
      '<a class="btn ghost" href="#/home">🏠 Beranda</a></div>' +
      '<h2>Pembahasan</h2>' +
      '<div class="filters"><button class="btn sm ' + (ui.filter === 'all' ? '' : 'ghost') + '" data-act="filter" data-v="all">Semua</button>' +
      '<button class="btn sm ' + (ui.filter === 'wrong' ? '' : 'ghost') + '" data-act="filter" data-v="wrong">Yang salah saja</button></div>' +
      items +
      '<p class="muted center">🎉 Selamat Hari Guru Nasional · Dibuat oleh Andy Kurniawan, S.Pd.SD - SDN SP 3 Prode</p></div>';
  }

  /* ---------- progres ---------- */
  function viewProgress() {
    var tot = 0, tuntas = 0, bests = [], wrongAll = 0, att = 0;
    TOP.forEach(function (t) {
      var s = st(t.id); att += s.attempts; wrongAll += s.wrong.length;
      if (s.best != null) { bests.push(s.best); if (s.best >= KKM) tuntas++; }
    });
    var avg = bests.length ? Math.round(bests.reduce(function (a, b) { return a + b; }, 0) / bests.length) : '-';
    var rows = TOP.map(function (t) {
      var s = st(t.id), h = s.history[s.history.length - 1];
      return '<tr><td>' + t.ikon + ' ' + esc(t.nama) + '</td><td>' + (s.read ? '✔️' : '-') + '</td><td>' + s.attempts + '</td><td>' + (s.last == null ? '-' : s.last) + '</td><td><b>' + (s.best == null ? '-' : s.best) + '</b></td><td>' + s.wrong.length + '</td><td>' + status(t.id) + '</td></tr>';
    }).join('');
    $app.innerHTML =
      '<a class="back" href="#/home">← Beranda</a><h1>📈 Progres Belajar' + (store.name ? ' ' + esc(store.name) : '') + '</h1>' +
      '<div class="sumgrid"><div class="sum"><b>' + tuntas + '/' + TOP.length + '</b>Materi tuntas (≥ ' + KKM + ')</div><div class="sum"><b>' + avg + '</b>Rata-rata nilai terbaik</div><div class="sum"><b>' + att + '</b>Sesi latihan</div><div class="sum"><b>' + wrongAll + '</b>Soal perlu diulang</div></div>' +
      '<div class="card scroll"><table class="ptable"><thead><tr><th>Materi</th><th>Dibaca</th><th>Sesi</th><th>Terakhir</th><th>Terbaik</th><th>Salah</th><th>Status</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="muted">Progres disimpan di perangkat ini (peramban). Jika memakai perangkat lain atau menghapus data peramban, progres tidak ikut terbawa.</p>' +
      '<button class="btn ghost sm" data-act="reset">🗑️ Hapus Semua Progres</button>';
  }

  /* ---------- event ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]'); if (!el) return;
    var a = el.getAttribute('data-act');
    if (a === 'tab') { ui.tab = el.getAttribute('data-v'); route(); }
    else if (a === 'count') { ui.count = +el.getAttribute('data-v'); route(); }
    else if (a === 'start') startNormal(el.getAttribute('data-id'), ui.count);
    else if (a === 'retry') startIds(el.getAttribute('data-id'), st(el.getAttribute('data-id')).wrong, 'retry');
    else if (a === 'retryres' && RES) startIds(RES.tid, RES.wrongIds, 'retry');
    else if (a === 'pick' && Q) { Q.ans[Q.i] = +el.getAttribute('data-i'); viewQuiz(); }
    else if (a === 'prev' && Q && Q.i > 0) { Q.i--; viewQuiz(); window.scrollTo(0, 0); }
    else if (a === 'next' && Q && Q.i < Q.qs.length - 1) { Q.i++; viewQuiz(); window.scrollTo(0, 0); }
    else if (a === 'goto' && Q) { Q.i = +el.getAttribute('data-i'); viewQuiz(); window.scrollTo(0, 0); }
    else if (a === 'finish' && Q) finish();
    else if (a === 'filter') { ui.filter = el.getAttribute('data-v'); viewResult(); }
    else if (a === 'reset') {
      if (window.confirm('Hapus semua progres belajar di perangkat ini? Tindakan ini tidak dapat dibatalkan.')) { store = { name: store.name, topics: {} }; save(); route(); }
    }
  });
  document.addEventListener('submit', function (e) {
    if (e.target.getAttribute('data-form') === 'name') {
      e.preventDefault();
      store.name = document.getElementById('nm').value.trim().slice(0, 30); save(); route();
    }
  });

  /* peringatan jika keluar saat kuis berjalan */
  window.addEventListener('beforeunload', function (e) { if (Q && Q.ans.some(function (a) { return a !== null; })) { e.preventDefault(); e.returnValue = ''; } });

  route();
})();
