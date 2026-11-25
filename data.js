/* Ruang Belajar Matematika - data materi & generator bank soal
   Dibuat oleh Andy Kurniawan, S.Pd.SD - SDN SP 3 Prode */
(function () {
  'use strict';

  /* ---------- utilitas ---------- */
  function R(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));
  const pick = (r, a) => a[Math.floor(r() * a.length)];
  function shuf(r, arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  const f = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const pad = n => String(n).padStart(2, '0');
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const lcm = (a, b) => a / gcd(a, b) * b;
  const nn = (a, ds) => ds.map(d => a + d).filter(x => x >= 0 && x !== a);
  const NAMA = ['Ani', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fajar', 'Gita', 'Hadi', 'Indah', 'Joko', 'Lia', 'Made', 'Putu', 'Wayan', 'Kadek', 'Nyoman', 'Rina', 'Sari', 'Tono', 'Yuni'];
  const NM = ['Budi', 'Eko', 'Hadi', 'Joko', 'Made', 'Putu', 'Wayan', 'Kadek', 'Nyoman', 'Tono', 'Fajar'];

  /* membuat satu soal: 1 jawaban benar + 3 pengecoh unik */
  function mk(r, q, ans, wr, exp) {
    ans = String(ans);
    const set = [];
    wr.forEach(w => {
      w = String(w);
      if (w === ans || set.includes(w) || /^-|NaN|undefined|Infinity/.test(w)) return;
      set.push(w);
    });
    if (set.length < 3) return null;
    return { q: q, ans: ans, wrong: shuf(r, set).slice(0, 3), exp: exp };
  }

  /* terbilang 1.000 - 99.999 */
  const SAT = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
  function tri(n) {
    const h = Math.floor(n / 100), t = n % 100; let s = '';
    if (h === 1) s += 'seratus '; else if (h > 1) s += SAT[h] + ' ratus ';
    if (t < 10) s += SAT[t];
    else if (t === 10) s += 'sepuluh';
    else if (t === 11) s += 'sebelas';
    else if (t < 20) s += SAT[t - 10] + ' belas';
    else s += SAT[Math.floor(t / 10)] + ' puluh ' + SAT[t % 10];
    return s.trim().replace(/\s+/g, ' ');
  }
  function say(n) {
    const th = Math.floor(n / 1000), rest = n % 1000; let s = '';
    if (th === 1) s = 'seribu'; else if (th > 1) s = tri(th) + ' ribu';
    if (rest) s += (s ? ' ' : '') + tri(rest);
    return s;
  }

  /* ======================================================
     1. BILANGAN CACAH
     ====================================================== */
  const TEMPAT = ['satuan', 'puluhan', 'ratusan', 'ribuan', 'puluh ribuan'];
  const expand = n => {
    const s = String(n), L = s.length, p = [];
    for (let i = 0; i < L; i++) { const d = +s[i]; if (d) p.push(f(d * Math.pow(10, L - 1 - i))); }
    return p.join(' + ');
  };
  const G1 = [
    r => { // nilai tempat
      const dg = shuf(r, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5);
      const n = +dg.join(''); const i = ri(r, 0, 4), pw = 4 - i, d = dg[i];
      const ans = d * Math.pow(10, pw);
      const w = [1, 2, 3, 4].map(k => d * Math.pow(10, (pw + k) % 5));
      return mk(r, 'Pada bilangan ' + f(n) + ', angka ' + d + ' bernilai ....', f(ans), w.map(f),
        'Angka ' + d + ' pada bilangan ' + f(n) + ' berada di tempat ' + TEMPAT[pw] + '. Jadi nilainya ' + d + ' × ' + f(Math.pow(10, pw)) + ' = ' + f(ans) + '.');
    },
    r => { // bentuk panjang
      const n = ri(r, 20000, 89999);
      return mk(r, 'Bentuk panjang dari ' + f(n) + ' adalah ....', expand(n),
        [n + 10, n - 1000, n + 100, n + 10000, n - 10].map(expand),
        'Uraikan setiap angka sesuai nilai tempatnya, lalu jumlahkan: ' + f(n) + ' = ' + expand(n) + '.');
    },
    r => { // terbesar / terkecil
      const s = new Set(); while (s.size < 4) s.add(ri(r, 10000, 99999));
      const a = Array.from(s); const big = r() < 0.5;
      const ans = big ? Math.max.apply(null, a) : Math.min.apply(null, a);
      return mk(r, 'Bilangan ' + (big ? 'terbesar' : 'terkecil') + ' di antara ' + a.map(f).join('; ') + ' adalah ....', f(ans),
        a.filter(x => x !== ans).map(f),
        'Bandingkan angka dari tempat paling kiri (puluh ribuan), lalu ribuan, ratusan, dan seterusnya. Bilangan ' + (big ? 'terbesar' : 'terkecil') + ' adalah ' + f(ans) + '.');
    },
    r => { // pembulatan
      const k = pick(r, [1, 2, 3]); const unit = Math.pow(10, k);
      const un = ['puluhan', 'ratusan', 'ribuan'][k - 1];
      const cek = ['satuan', 'puluhan', 'ratusan'][k - 1];
      const n = ri(r, 1200, 98999); const rem = n % unit; const down = n - rem; const up = down + unit;
      const naik = rem >= unit / 2; const ans = naik ? up : down;
      const dg = Math.floor(rem / (unit / 10));
      const big = n - (n % (unit * 10));
      return mk(r, 'Hasil pembulatan ' + f(n) + ' ke ' + un + ' terdekat adalah ....', f(ans),
        [down, up, big, big + unit * 10, n].map(f),
        'Lihat angka di tempat ' + cek + ', yaitu ' + dg + '. Karena ' + dg + (naik ? ' lima atau lebih' : ' kurang dari lima') + ', bilangan dibulatkan ke ' + (naik ? 'atas' : 'bawah') + '. Hasilnya ' + f(ans) + '.');
    },
    r => { // lebih besar / lebih kecil
      const st = pick(r, [1, 10, 100, 1000]); const up = r() < 0.5; const n = ri(r, 12000, 88000);
      const ans = up ? n + st : n - st;
      return mk(r, 'Bilangan yang ' + f(st) + ' ' + (up ? 'lebih besar' : 'lebih kecil') + ' dari ' + f(n) + ' adalah ....', f(ans),
        nn(ans, [st, -st, st * 10, -st * 10, 2 * st, -2 * st]).map(f),
        (up ? 'Tambahkan ' : 'Kurangkan ') + f(st) + ': ' + f(n) + (up ? ' + ' : ' − ') + f(st) + ' = ' + f(ans) + '.');
    },
    r => { // pola
      const d = pick(r, [2, 3, 5, 10, 25, 50, 100, 250, 500, 1000]); const inc = r() < 0.7;
      const a = inc ? ri(r, 1, 20) * d : ri(r, 12, 40) * d;
      const seq = [0, 1, 2, 3].map(i => inc ? a + i * d : a - i * d);
      const ans = inc ? a + 4 * d : a - 4 * d;
      return mk(r, 'Lanjutan pola bilangan ' + seq.map(f).join(', ') + ', .... adalah ....', f(ans),
        nn(ans, [d, -d, 2 * d, -2 * d, 10, -10, 100]).map(f),
        'Pola ini ' + (inc ? 'bertambah ' : 'berkurang ') + f(d) + ' setiap suku. Suku berikutnya: ' + f(seq[3]) + (inc ? ' + ' : ' − ') + f(d) + ' = ' + f(ans) + '.');
    },
    r => { // di antara
      const a = ri(r, 100, 800) * 10; const gap = ri(r, 2, 9) * 100; const b = a + gap;
      const ans = a + ri(r, 1, gap - 1);
      const w = [a - ri(r, 1, 150), b + ri(r, 1, 150), b + ri(r, 151, 400), a - ri(r, 151, 400)];
      return mk(r, 'Bilangan yang terletak di antara ' + f(a) + ' dan ' + f(b) + ' adalah ....', f(ans), w.map(f),
        'Bilangan di antara ' + f(a) + ' dan ' + f(b) + ' harus lebih besar dari ' + f(a) + ' dan lebih kecil dari ' + f(b) + '. Yang memenuhi: ' + f(ans) + '.');
    },
    r => { // terbilang
      const n = ri(r, 10, 99) * 1000 + ri(r, 0, 9) * 100 + ri(r, 0, 9) * 10;
      if (r() < 0.5) {
        return mk(r, 'Bilangan "' + say(n) + '" ditulis dengan angka ....', f(n),
          [n + 100, n - 1000, n + 10, n - 100, n + 1000].map(f),
          '"' + say(n) + '" ditulis ' + f(n) + '. Gunakan titik untuk memisahkan kelompok ribuan.');
      }
      return mk(r, 'Cara membaca bilangan ' + f(n) + ' adalah ....', say(n),
        [n + 100, n - 1000, n + 10, n + 1000].map(say),
        f(n) + ' dibaca "' + say(n) + '".');
    }
  ];

  /* ======================================================
     2. PENJUMLAHAN & PENGURANGAN
     ====================================================== */
  const addStory = (r, a, b) => {
    const n = pick(r, NAMA), m = pick(r, NM);
    return pick(r, [
      'Pada hari Sabtu, toko Bu ' + n + ' menjual ' + f(a) + ' butir telur. Hari Minggu terjual ' + f(b) + ' butir. Berapa butir telur yang terjual selama dua hari?',
      'Pak ' + m + ' memanen ' + f(a) + ' kg mangga pada musim pertama dan ' + f(b) + ' kg pada musim kedua. Berapa kg seluruh hasil panennya?',
      'Perpustakaan SD memiliki ' + f(a) + ' buku cerita dan ' + f(b) + ' buku pelajaran. Berapa jumlah seluruh buku?',
      n + ' mengumpulkan ' + f(a) + ' keping uang logam, lalu menambah ' + f(b) + ' keping lagi. Berapa keping uang logam ' + n + ' sekarang?'
    ]);
  };
  const subStory = (r, a, b) => {
    const n = pick(r, NAMA), m = pick(r, NM);
    return pick(r, [
      'Pak ' + m + ' memiliki ' + f(a) + ' butir telur. Sebanyak ' + f(b) + ' butir terjual. Berapa butir telur yang tersisa?',
      'Sebuah pabrik membuat ' + f(a) + ' botol air minum. Sebanyak ' + f(b) + ' botol sudah dikirim. Berapa botol yang belum dikirim?',
      'Penonton pertunjukan tari ada ' + f(a) + ' orang. ' + f(b) + ' orang di antaranya anak-anak. Berapa banyak orang dewasa?',
      n + ' memiliki tabungan Rp' + f(a) + '. Ia membeli sepatu seharga Rp' + f(b) + '. Berapa sisa tabungan ' + n + '?'
    ]);
  };
  const rd1000 = x => Math.floor((x + 500) / 1000) * 1000;
  const G2 = [
    r => { const a = ri(r, 1000, 59999), b = ri(r, 1000, Math.min(40000, 99999 - a)), ans = a + b;
      return mk(r, f(a) + ' + ' + f(b) + ' = ....', f(ans), nn(ans, [10, -10, 100, -100, 1000, -1000]).map(f),
        'Susun ke bawah, jumlahkan mulai dari satuan ke kiri, dan ingat menyimpan jika hasilnya 10 atau lebih. Hasil: ' + f(ans) + '. Cek dengan penaksiran: ' + f(rd1000(a)) + ' + ' + f(rd1000(b)) + ' = ' + f(rd1000(a) + rd1000(b)) + ' (hasilnya berdekatan).'); },
    r => { const a = ri(r, 5000, 99999), b = ri(r, 1000, a - 1000), ans = a - b;
      return mk(r, f(a) + ' − ' + f(b) + ' = ....', f(ans), nn(ans, [10, -10, 100, -100, 1000, -1000]).map(f),
        'Susun ke bawah, kurangkan mulai dari satuan; jika angka atas lebih kecil, pinjam dari tempat di sebelah kirinya. Hasil: ' + f(ans) + '. Cek: ' + f(ans) + ' + ' + f(b) + ' = ' + f(a) + '.'); },
    r => { const x = ri(r, 1000, 40000), y = ri(r, 1000, 40000);
      if (r() < 0.5) { const t = x + y; return mk(r, f(x) + ' + .... = ' + f(t), f(y), nn(y, [10, -10, 100, -100, 1000, -1000]).map(f),
        'Cari bilangan yang hilang dengan pengurangan: ' + f(t) + ' − ' + f(x) + ' = ' + f(y) + '.'); }
      const t = x + y; return mk(r, '.... − ' + f(x) + ' = ' + f(y), f(t), nn(t, [10, -10, 100, -100, 1000, -1000]).map(f),
        'Bilangan yang hilang dicari dengan penjumlahan: ' + f(y) + ' + ' + f(x) + ' = ' + f(t) + '.'); },
    r => { const a = ri(r, 1000, 50000), b = ri(r, 1000, 40000), ans = a + b;
      return mk(r, addStory(r, a, b), f(ans), nn(ans, [10, -10, 100, -100, 1000, -1000]).map(f),
        'Diketahui dua banyak: ' + f(a) + ' dan ' + f(b) + '. Ditanya jumlah seluruhnya, maka dijumlahkan: ' + f(a) + ' + ' + f(b) + ' = ' + f(ans) + '.'); },
    r => { const a = ri(r, 8000, 90000), b = ri(r, 1000, a - 2000), ans = a - b;
      return mk(r, subStory(r, a, b), f(ans), nn(ans, [10, -10, 100, -100, 1000, -1000]).map(f),
        'Diketahui banyaknya ' + f(a) + ' dan yang berkurang ' + f(b) + '. Ditanya sisanya, maka dikurangkan: ' + f(a) + ' − ' + f(b) + ' = ' + f(ans) + '.'); },
    r => { const a = ri(r, 2000, 30000), b = ri(r, 1000, 20000), c = ri(r, 500, a + b - 500), ans = a + b - c, m = pick(r, NM);
      return mk(r, 'Pak ' + m + ' memiliki ' + f(a) + ' ekor ayam. Ia membeli ' + f(b) + ' ekor lagi, kemudian menjual ' + f(c) + ' ekor. Berapa ekor ayam Pak ' + m + ' sekarang?',
        f(ans), nn(ans, [10, -10, 100, 1000, -1000]).concat([a + b + c, a + b]).map(f),
        'Langkah 1: ' + f(a) + ' + ' + f(b) + ' = ' + f(a + b) + '. Langkah 2: ' + f(a + b) + ' − ' + f(c) + ' = ' + f(ans) + '.'); },
    r => { const a = ri(r, 1000, 30000), b = ri(r, 1000, 30000), c = ri(r, 1000, 30000), ans = a + b + c;
      return mk(r, f(a) + ' + ' + f(b) + ' + ' + f(c) + ' = ....', f(ans), nn(ans, [10, -10, 100, -100, 1000, -1000]).map(f),
        'Jumlahkan dua bilangan dulu: ' + f(a) + ' + ' + f(b) + ' = ' + f(a + b) + '. Lalu tambahkan ' + f(c) + ': ' + f(a + b) + ' + ' + f(c) + ' = ' + f(ans) + '.'); },
    r => { const a = ri(r, 1100, 9899), b = ri(r, 1100, 9899), ans = rd1000(a) + rd1000(b);
      return mk(r, 'Hasil penaksiran ' + f(a) + ' + ' + f(b) + ' dengan pembulatan ke ribuan terdekat adalah ....', f(ans),
        nn(ans, [1000, -1000, 2000]).concat([a + b]).map(f),
        'Bulatkan dulu: ' + f(a) + ' menjadi ' + f(rd1000(a)) + ' dan ' + f(b) + ' menjadi ' + f(rd1000(b)) + '. Lalu jumlahkan: ' + f(ans) + '.'); }
  ];

  /* ======================================================
     3. PERKALIAN & PEMBAGIAN
     ====================================================== */
  const G3 = [
    r => { const a = ri(r, 12, 99), b = ri(r, 3, 9), ans = a * b;
      return mk(r, a + ' × ' + b + ' = ....', f(ans), nn(ans, [10, -10, b, -b, 100, -100]).map(f),
        'Uraikan: ' + a + ' × ' + b + ' = (' + (a - a % 10) + ' × ' + b + ') + (' + (a % 10) + ' × ' + b + ') = ' + (a - a % 10) * b + ' + ' + (a % 10) * b + ' = ' + f(ans) + '.'); },
    r => { const a = ri(r, 101, 999), b = ri(r, 3, 9), ans = a * b;
      return mk(r, f(a) + ' × ' + b + ' = ....', f(ans), nn(ans, [10, -10, 100, -100, 1000, -b * 10]).map(f),
        'Kalikan setiap angka mulai dari satuan, lalu simpan jika perlu. ' + f(a) + ' × ' + b + ' = ' + f(ans) + '.'); },
    r => { const a = ri(r, 11, 99), b = ri(r, 11, 60), ans = a * b;
      return mk(r, a + ' × ' + b + ' = ....', f(ans), nn(ans, [10, -10, 100, -100, a, -b]).map(f),
        'Kalikan ' + a + ' dengan satuan ' + (b % 10) + ' = ' + a * (b % 10) + ', lalu dengan puluhan ' + (b - b % 10) + ' = ' + a * (b - b % 10) + '. Jumlahkan: ' + f(ans) + '.'); },
    r => { const d = ri(r, 2, 9), q = ri(r, 12, 120), n = d * q;
      return mk(r, f(n) + ' ÷ ' + d + ' = ....', f(q), nn(q, [1, -1, 10, -10, 100]).map(f),
        'Pembagian dapat diperiksa dengan perkalian: ' + q + ' × ' + d + ' = ' + f(n) + ', jadi ' + f(n) + ' ÷ ' + d + ' = ' + q + '.'); },
    r => { const d = ri(r, 4, 9), q = ri(r, 5, 40), s = ri(r, 1, d - 1), n = d * q + s;
      const other = []; for (let i = 1; i < d; i++) if (i !== s) other.push(i);
      const s2 = pick(r, other);
      return mk(r, 'Hasil bagi dan sisa dari ' + n + ' ÷ ' + d + ' adalah ....', q + ' sisa ' + s,
        [(q + 1) + ' sisa ' + s, (q - 1) + ' sisa ' + s, q + ' sisa ' + s2, (q + 1) + ' sisa ' + s2],
        d + ' × ' + q + ' = ' + (d * q) + '. Sisanya ' + n + ' − ' + (d * q) + ' = ' + s + ' (sisa harus lebih kecil dari pembagi ' + d + '). Jadi hasilnya ' + q + ' sisa ' + s + '.'); },
    r => { const a = ri(r, 3, 12), p = ri(r, 3, 12), ans = a * p, side = r() < 0.5;
      return mk(r, side ? '.... × ' + p + ' = ' + ans : a + ' × .... = ' + ans, side ? a : p, nn(side ? a : p, [1, -1, 2, -2, 10]),
        'Gunakan pembagian: ' + f(ans) + ' ÷ ' + (side ? p : a) + ' = ' + (side ? a : p) + '.'); },
    r => { const a = ri(r, 12, 48), b = ri(r, 12, 60), ans = a * b, m = pick(r, NAMA);
      return mk(r, pick(r, [
        'Ada ' + a + ' kotak kelereng. Setiap kotak berisi ' + b + ' kelereng. Berapa banyak kelereng seluruhnya?',
        'Bu ' + m + ' membuat ' + a + ' bungkus kue. Setiap bungkus berisi ' + b + ' potong. Berapa potong kue seluruhnya?',
        'Sebuah gedung memiliki ' + a + ' ruang kelas. Setiap kelas memuat ' + b + ' kursi. Berapa kursi di gedung itu?']),
        f(ans), nn(ans, [10, -10, 100, -100, a, b]).map(f),
        'Banyak kelompok × isi tiap kelompok: ' + a + ' × ' + b + ' = ' + f(ans) + '.'); },
    r => { const d = ri(r, 3, 12), q = ri(r, 12, 90), n = d * q;
      return mk(r, pick(r, [
        f(n) + ' permen dibagikan sama banyak kepada ' + d + ' anak. Berapa permen yang diterima setiap anak?',
        'Sebanyak ' + f(n) + ' buku disusun ke dalam ' + d + ' rak sama banyak. Berapa buku di tiap rak?']),
        f(q), nn(q, [1, -1, 10, -10, d]).map(f),
        'Dibagi sama banyak berarti pembagian: ' + f(n) + ' ÷ ' + d + ' = ' + f(q) + '.'); },
    r => { const t = ri(r, 0, 3); let a, b, c, q, ans, w, exp;
      if (t === 0) { a = ri(r, 10, 90); b = ri(r, 2, 9); c = ri(r, 2, 9); ans = a + b * c; q = a + ' + ' + b + ' × ' + c + ' = ....'; w = [(a + b) * c, a * b + c, ans + b, ans - c]; exp = 'Perkalian dikerjakan lebih dulu: ' + b + ' × ' + c + ' = ' + b * c + '. Lalu ' + a + ' + ' + b * c + ' = ' + ans + '.'; }
      else if (t === 1) { a = ri(r, 3, 9); b = ri(r, 10, 60); c = ri(r, 2, Math.min(30, a * b - 1)); ans = a * b - c; q = a + ' × ' + b + ' − ' + c + ' = ....'; w = [a * b + c, ans + 10, ans - 10, Math.abs(a * (b - c))]; exp = 'Perkalian dulu: ' + a + ' × ' + b + ' = ' + a * b + '. Lalu ' + a * b + ' − ' + c + ' = ' + ans + '.'; }
      else if (t === 2) { c = ri(r, 2, 9); const k = ri(r, 2, 12); b = c * k; a = ri(r, b + 1, b + 60); ans = a - k; q = a + ' − ' + b + ' ÷ ' + c + ' = ....'; w = nn(ans, [c, -c, k, 2 * k, 10, -10]); exp = 'Pembagian dulu: ' + b + ' ÷ ' + c + ' = ' + k + '. Lalu ' + a + ' − ' + k + ' = ' + ans + '.'; }
      else { a = ri(r, 3, 30); b = ri(r, 2, 20); c = ri(r, 2, 9); ans = (a + b) * c; q = '(' + a + ' + ' + b + ') × ' + c + ' = ....'; w = [a + b * c, ans + c, ans - c, a * c + b]; exp = 'Yang di dalam kurung dikerjakan lebih dulu: ' + a + ' + ' + b + ' = ' + (a + b) + '. Lalu ' + (a + b) + ' × ' + c + ' = ' + ans + '.'; }
      return mk(r, q, ans, w, exp); }
  ];

  /* ======================================================
     4. FAKTOR & KELIPATAN
     ====================================================== */
  const divs = n => { const d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; };
  const isPrime = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  const pfac = n => { const p = []; let x = n; for (let d = 2; d <= x; d++) while (x % d === 0) { p.push(d); x /= d; } return p; };
  const listMult = (a, upto) => { const l = []; for (let i = a; i <= upto; i += a) l.push(i); return l; };
  const NF = [12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 60, 72];
  const G4 = [
    r => { const n = pick(r, NF), d = divs(n);
      if (r() < 0.5) return mk(r, 'Banyak faktor dari ' + n + ' adalah ....', d.length, nn(d.length, [1, -1, 2, -2, 3]),
        'Faktor dari ' + n + ': ' + d.join(', ') + '. Banyaknya ada ' + d.length + '.');
      const ans = d.join(', ');
      const mid = d.slice(); mid.splice(ri(r, 1, d.length - 2), 1);
      let extra = ri(r, 5, n - 1); while (n % extra === 0 || d.includes(extra)) extra = extra + 1 >= n ? 5 : extra + 1;
      const add = d.concat([extra]).sort((a, b) => a - b);
      const rep = d.slice(); rep[ri(r, 1, d.length - 2)] += 1;
      return mk(r, 'Semua faktor dari ' + n + ' adalah ....', ans, [mid.join(', '), add.join(', '), rep.join(', ')],
        'Faktor adalah bilangan yang membagi habis ' + n + '. Cari semua pasangan perkalian yang hasilnya ' + n + ': ' + ans + '.'); },
    r => { const m = ri(r, 3, 12), c = ri(r, 3, 12), ans = m * c;
      return mk(r, 'Kelipatan ' + m + ' yang terletak di antara ' + (ans - ri(r, 1, m - 1)) + ' dan ' + (ans + ri(r, 1, m - 1)) + ' adalah ....', ans,
        [ans + 1, ans - 1, ans + m, ans - m, ans + 2],
        'Kelipatan ' + m + ': ..., ' + (ans - m) + ', ' + ans + ', ' + (ans + m) + ', .... Yang berada di antara kedua bilangan itu adalah ' + ans + '.'); },
    r => { let a = ri(r, 2, 12), b = ri(r, 2, 12); while (a === b) b = ri(r, 2, 12);
      const L = lcm(a, b), g = gcd(a, b);
      return mk(r, 'KPK dari ' + a + ' dan ' + b + ' adalah ....', L, [a * b, g, L * 2, L + a, L - 1, L + b],
        'Kelipatan ' + a + ': ' + listMult(a, L).join(', ') + '. Kelipatan ' + b + ': ' + listMult(b, L).join(', ') + '. Kelipatan persekutuan terkecilnya adalah ' + L + '.'); },
    r => { const g = ri(r, 2, 9), pr = [[2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [2, 7], [3, 7], [5, 6], [4, 7], [5, 7], [3, 8], [5, 8]];
      const p = pick(r, pr), a = g * p[0], b = g * p[1], G = gcd(a, b);
      return mk(r, 'FPB dari ' + a + ' dan ' + b + ' adalah ....', G, [G * 2, G + 1, lcm(a, b), Math.max(1, G - 1), 1, G + 2],
        'Faktor ' + a + ': ' + divs(a).join(', ') + '. Faktor ' + b + ': ' + divs(b).join(', ') + '. Faktor persekutuan terbesarnya adalah ' + G + '.'); },
    r => { const P = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
      const p = pick(r, P); const comp = []; while (comp.length < 3) { const c = ri(r, 4, 99); if (!isPrime(c) && !comp.includes(c)) comp.push(c); }
      return mk(r, 'Di antara bilangan berikut, yang merupakan bilangan prima adalah ....', p, comp,
        p + ' hanya punya dua faktor, yaitu 1 dan ' + p + ' sendiri, sehingga prima. ' + comp.map(c => c + ' juga habis dibagi ' + divs(c)[1]).join('; ') + ', jadi bukan prima.'); },
    r => { const n = pick(r, [12, 18, 20, 24, 28, 30, 36, 40, 45, 48, 50, 60, 72, 75, 84, 90]), p = pfac(n), ans = p.join(' × ');
      const w = [p.slice(0, -1).join(' × '), p.concat([2]).join(' × '), [p[0] * p[1]].concat(p.slice(2)).join(' × '), p.slice(0, -1).concat([p[p.length - 1] + 2]).join(' × ')];
      return mk(r, 'Faktorisasi prima dari ' + n + ' adalah ....', ans, w,
        'Bagi ' + n + ' dengan bilangan prima terkecil secara berulang (pohon faktor) sampai hasilnya 1. Diperoleh ' + n + ' = ' + ans + '.'); },
    r => { let a = ri(r, 2, 9), b = ri(r, 2, 9); while (a === b) b = ri(r, 2, 9);
      const L = lcm(a, b);
      return mk(r, 'Lampu merah menyala setiap ' + a + ' detik dan lampu hijau setiap ' + b + ' detik. Jika keduanya menyala bersamaan pada detik ke-0, keduanya akan menyala bersamaan lagi pada detik ke-....', L,
        [a * b, L * 2, L + a, L - 1, a + b], 'Soal ini dicari dengan KPK dari ' + a + ' dan ' + b + ', yaitu ' + L + '. Jadi keduanya menyala bersamaan lagi pada detik ke-' + L + '.'); },
    r => { const g = ri(r, 3, 9), pr = pick(r, [[2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [5, 6]]), a = g * pr[0] * 2, b = g * pr[1] * 2, G = gcd(a, b);
      return mk(r, 'Ada ' + a + ' permen cokelat dan ' + b + ' permen stroberi. Semuanya dimasukkan ke dalam kantong dengan isi jenis permen yang sama banyak di tiap kantong, tanpa sisa. Paling banyak ada ... kantong.', G,
        [G * 2, G + 1, G - 1 > 0 ? G - 1 : G + 3, lcm(a, b), 2],
        'Banyak kantong terbanyak dicari dengan FPB dari ' + a + ' dan ' + b + ', yaitu ' + G + '.'); }
  ];

  /* ======================================================
     5. PECAHAN
     ====================================================== */
  const COP = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6], [2, 7], [3, 7], [3, 8], [5, 8], [7, 8], [3, 10], [7, 10], [5, 12], [7, 12]];
  const G5 = [
    r => { const b = pick(r, [2, 3, 4, 5, 6, 8, 10]), a = ri(r, 1, b - 1), k = ri(r, 2, 6);
      return mk(r, 'Pecahan yang senilai dengan ' + a + '/' + b + ' adalah ....', (a * k) + '/' + (b * k),
        [(a + k) + '/' + (b + k), (a * k + 1) + '/' + (b * k), a + '/' + (b * k), (a * k) + '/' + b],
        'Pecahan senilai diperoleh dengan mengalikan pembilang dan penyebut dengan bilangan yang sama. ' + a + '/' + b + ' = (' + a + ' × ' + k + ')/(' + b + ' × ' + k + ') = ' + (a * k) + '/' + (b * k) + '.'); },
    r => { const p = pick(r, COP), g = ri(r, 2, 6), a = p[0] * g, b = p[1] * g;
      return mk(r, 'Bentuk paling sederhana dari ' + a + '/' + b + ' adalah ....', p[0] + '/' + p[1],
        [p[1] + '/' + p[0], p[0] + '/' + (p[1] + 1), (p[0] + 1) + '/' + (p[1] + 1), a + '/' + b],
        'Bagi pembilang dan penyebut dengan FPB-nya, yaitu ' + g + '. ' + a + '/' + b + ' = (' + a + ' ÷ ' + g + ')/(' + b + ' ÷ ' + g + ') = ' + p[0] + '/' + p[1] + '.'); },
    r => { const big = r() < 0.5, same = r() < 0.5; let list;
      if (same) { const d = ri(r, 6, 12); list = shuf(r, Array.from({ length: d - 1 }, (_, i) => i + 1)).slice(0, 4).map(n => [n, d]); }
      else { const n = ri(r, 1, 5); list = shuf(r, [n + 1, n + 2, n + 3, n + 4, n + 5, n + 6, n + 7, n + 8]).slice(0, 4).map(d => [n, d]); }
      const val = x => x[0] / x[1];
      const ans = list.slice().sort((x, y) => big ? val(y) - val(x) : val(x) - val(y))[0];
      const txt = x => x[0] + '/' + x[1];
      return mk(r, 'Pecahan ' + (big ? 'terbesar' : 'terkecil') + ' di antara ' + list.map(txt).join(', ') + ' adalah ....', txt(ans), list.filter(x => x !== ans).map(txt),
        same ? 'Penyebutnya sama, jadi bandingkan pembilangnya. Pembilang ' + (big ? 'terbesar' : 'terkecil') + ' adalah ' + ans[0] + ', yaitu ' + txt(ans) + '.'
             : 'Pembilangnya sama, jadi semakin besar penyebut, semakin kecil nilai pecahan. Pecahan ' + (big ? 'terbesar' : 'terkecil') + ' adalah ' + txt(ans) + '.'); },
    r => { const d = ri(r, 5, 12), a = ri(r, 1, d - 2), b = ri(r, 1, d - 1 - a), s = a + b;
      return mk(r, a + '/' + d + ' + ' + b + '/' + d + ' = ....', s + '/' + d, [s + '/' + (2 * d), (s + 1) + '/' + d, (s - 1) + '/' + d, Math.abs(a - b) + '/' + d, a + '/' + (d + d)],
        'Penyebut sama, jadi cukup jumlahkan pembilangnya dan penyebut tetap: (' + a + ' + ' + b + ')/' + d + ' = ' + s + '/' + d + '.'); },
    r => { const d = ri(r, 5, 12), a = ri(r, 3, d - 1), b = ri(r, 1, a - 1), s = a - b;
      return mk(r, a + '/' + d + ' − ' + b + '/' + d + ' = ....', s + '/' + d, [(a + b) + '/' + d, s + '/' + (2 * d), (s + 1) + '/' + d, s + '/' + (d - b), (s + 2) + '/' + d],
        'Penyebut sama, jadi kurangkan pembilangnya dan penyebut tetap: (' + a + ' − ' + b + ')/' + d + ' = ' + s + '/' + d + '.'); },
    r => { const d = pick(r, [2, 3, 4, 5, 6, 8, 10]), a = ri(r, 1, d - 1), k = ri(r, 2, 12), n = d * k, ans = a * k;
      return mk(r, a + '/' + d + ' dari ' + n + ' adalah ....', ans, [k, n - ans, a + k, ans + a, ans + k],
        'Bagi ' + n + ' menjadi ' + d + ' bagian sama besar: ' + n + ' ÷ ' + d + ' = ' + k + '. Ambil ' + a + ' bagian: ' + a + ' × ' + k + ' = ' + ans + '.'); },
    r => { const d = pick(r, [2, 3, 4, 5, 6, 8]), a = ri(r, 1, d - 1), w = ri(r, 1, 6), ans = (w * d + a) + '/' + d;
      return mk(r, 'Pecahan campuran ' + w + ' ' + a + '/' + d + ' jika diubah menjadi pecahan biasa adalah ....', ans,
        [(w * d + a + 1) + '/' + d, (w + a) + '/' + d, (w * a + d) + '/' + d, (w * d + a) + '/' + (d + 1)],
        'Kalikan bilangan bulat dengan penyebut, lalu tambahkan pembilang: (' + w + ' × ' + d + ' + ' + a + ')/' + d + ' = ' + ans + '.'); },
    r => { const d = ri(r, 6, 12), a = ri(r, 1, 3), b = ri(r, 1, 3), n = pick(r, ['pizza', 'kue', 'semangka']), tot = a + b, nm = pick(r, NAMA);
      return mk(r, 'Sebuah ' + n + ' dipotong menjadi ' + d + ' bagian sama besar. ' + nm + ' memakan ' + a + '/' + d + ' bagian dan adiknya memakan ' + b + '/' + d + ' bagian. Sisa ' + n + ' adalah ....',
        (d - tot) + '/' + d, [tot + '/' + d, (d - tot + 1) + '/' + d, (d - a) + '/' + d, (d - tot) + '/' + (2 * d)],
        'Yang dimakan: ' + a + '/' + d + ' + ' + b + '/' + d + ' = ' + tot + '/' + d + '. Sisa = ' + d + '/' + d + ' − ' + tot + '/' + d + ' = ' + (d - tot) + '/' + d + '.'); },
    r => { const d = ri(r, 4, 12), a = Math.floor(d / 2) + ri(r, 1, Math.max(1, d - 1 - Math.floor(d / 2)));
      if (2 * a <= d || a >= d) return null;
      const w = []; while (w.length < 4) { const dd = ri(r, 4, 12), aa = ri(r, 1, Math.floor((dd - 1) / 2)), t = aa + '/' + dd; if (!w.includes(t)) w.push(t); }
      return mk(r, 'Pecahan yang nilainya lebih besar dari 1/2 adalah ....', a + '/' + d, w,
        'Pecahan lebih dari 1/2 jika pembilangnya lebih dari setengah penyebut. ' + a + ' lebih dari setengah ' + d + ' (yaitu ' + (d / 2) + '), jadi ' + a + '/' + d + ' lebih dari 1/2.'); }
  ];

  /* ======================================================
     6. PENGUKURAN
     ====================================================== */
  const dur = m => { const h = Math.floor(m / 60), mi = m % 60; return (h ? h + ' jam' : '') + (h && mi ? ' ' : '') + (mi ? mi + ' menit' : ''); };
  const tm = m => pad(Math.floor(m / 60)) + '.' + pad(m % 60);
  const G6 = [
    r => { const t = pick(r, [['km', 'm', 1000], ['m', 'cm', 100], ['cm', 'mm', 10], ['kg', 'g', 1000], ['ton', 'kg', 1000]]);
      const big = r() < 0.5, k = ri(r, 2, 30), F = t[2];
      const from = big ? t[0] : t[1], to = big ? t[1] : t[0];
      const val = big ? k : k * F, ans = big ? k * F : k;
      const w = [ans * 10, ans * 100, ans * 1000, ans % 10 === 0 ? ans / 10 : ans + 10, ans % 100 === 0 ? ans / 100 : ans + 100].map(x => f(x) + ' ' + to);
      return mk(r, f(val) + ' ' + from + ' = .... ' + to, f(ans) + ' ' + to, w,
        '1 ' + t[0] + ' = ' + f(F) + ' ' + t[1] + '. ' + (big ? 'Dari satuan besar ke kecil, kalikan ' + f(F) + ': ' + k + ' × ' + f(F) : 'Dari satuan kecil ke besar, bagi ' + f(F) + ': ' + f(val) + ' ÷ ' + f(F)) + ' = ' + f(ans) + '.'); },
    r => { const t = pick(r, [['jam', 'menit', 60], ['menit', 'detik', 60], ['hari', 'jam', 24]]), F = t[2], k = ri(r, 2, 9), big = r() < 0.6;
      const val = big ? k : k * F, ans = big ? k * F : k, from = big ? t[0] : t[1], to = big ? t[1] : t[0];
      return mk(r, val + ' ' + from + ' = .... ' + to, f(ans) + ' ' + to,
        [ans * 10, ans + 10, ans + F, big ? k * 100 : k * 10, ans * 6].map(x => f(x) + ' ' + to),
        '1 ' + t[0] + ' = ' + F + ' ' + t[1] + '. ' + (big ? k + ' × ' + F : val + ' ÷ ' + F) + ' = ' + ans + '.'); },
    r => { const t = pick(r, [['km', 'm', 1000], ['kg', 'g', 1000], ['jam', 'menit', 60], ['menit', 'detik', 60], ['m', 'cm', 100]]), F = t[2];
      const a = ri(r, 1, 9), b = F === 60 ? ri(r, 1, 11) * 5 : F === 100 ? ri(r, 1, 19) * 5 : ri(r, 1, 19) * 50, ans = a * F + b;
      return mk(r, a + ' ' + t[0] + ' ' + b + ' ' + t[1] + ' = .... ' + t[1], f(ans) + ' ' + t[1],
        [a * F + b * 10, a * F * 10 + b, a + b, a * F - b, a * 100 + b].map(x => f(x) + ' ' + t[1]),
        'Ubah satuan besar dulu: ' + a + ' ' + t[0] + ' = ' + f(a * F) + ' ' + t[1] + '. Lalu tambahkan ' + b + ': ' + f(a * F) + ' + ' + b + ' = ' + f(ans) + ' ' + t[1] + '.'); },
    r => { const S = ri(r, 72, 192) * 5, D = ri(r, 6, 60) * 5, nm = pick(r, NAMA);
      return mk(r, nm + ' berangkat dari rumah pukul ' + tm(S) + ' dan tiba di tujuan pukul ' + tm(S + D) + '. Lama perjalanan ' + nm + ' adalah ....', dur(D),
        [D + 15, D - 15, D + 30, D + 60, D - 30].filter(x => x > 0).map(dur),
        'Hitung selisih waktu: ' + tm(S + D) + ' − ' + tm(S) + ' = ' + dur(D) + '.'); },
    r => { const S = ri(r, 72, 192) * 5, D = ri(r, 6, 48) * 5;
      return mk(r, 'Kegiatan belajar kelompok dimulai pukul ' + tm(S) + ' dan berlangsung selama ' + dur(D) + '. Kegiatan itu selesai pukul ....', tm(S + D),
        [S + D + 10, S + D - 10, S + D + 60, S + D - 60, S + D + 30].map(tm),
        'Tambahkan lama kegiatan ke waktu mulai: ' + tm(S) + ' + ' + dur(D) + ' = ' + tm(S + D) + '.'); },
    r => { const h = ri(r, 13, 23), m = pick(r, [0, 10, 15, 20, 25, 30, 35, 40, 45, 50]);
      const part = x => x <= 14 ? 'siang' : x <= 17 ? 'sore' : 'malam';
      const ans = pad(h - 12) + '.' + pad(m) + ' ' + part(h);
      const oh = h - 12;
      return mk(r, 'Pukul ' + pad(h) + '.' + pad(m) + ' jika ditulis dengan sistem 12 jam adalah pukul ....', ans,
        [pad(oh) + '.' + pad(m) + ' pagi', pad(oh + 1 > 12 ? 1 : oh + 1) + '.' + pad(m) + ' ' + part(h), pad(oh) + '.' + pad((m + 30) % 60) + ' ' + part(h), pad(h) + '.' + pad(m) + ' pagi'],
        'Untuk jam 13 sampai 23, kurangi 12: ' + h + ' − 12 = ' + (h - 12) + '. Waktunya ' + part(h) + ', jadi pukul ' + ans + '.'); },
    r => { const a = ri(r, 1, 5), b = ri(r, 1, 18) * 50, it = pick(r, ['tepung terigu', 'gula pasir', 'beras', 'jagung']), ans = a * 1000 + b;
      return mk(r, 'Ibu membeli ' + a + ' kg ' + it + ' dan ' + b + ' gram garam. Berat belanjaan Ibu seluruhnya adalah .... gram.', f(ans),
        [a + b, a * 100 + b, a * 10000 + b, ans + 100, ans - 100].map(f),
        'Ubah dulu ke gram: ' + a + ' kg = ' + f(a * 1000) + ' gram. Lalu ' + f(a * 1000) + ' + ' + b + ' = ' + f(ans) + ' gram.'); },
    r => { const a = ri(r, 2, 9), b = ri(r, 4, a * 20 - 1) * 5, ans = a * 100 - b;
      if (b >= a * 100) return null;
      return mk(r, 'Sebuah tali panjangnya ' + a + ' m. Tali itu dipotong ' + b + ' cm. Sisa tali adalah .... cm.', f(ans),
        [a - b, a * 10 - b, a * 1000 - b, ans + 10, ans + 100].filter(x => x >= 0).map(f),
        'Samakan satuan: ' + a + ' m = ' + a * 100 + ' cm. Lalu ' + a * 100 + ' − ' + b + ' = ' + f(ans) + ' cm.'); }
  ];

  /* ======================================================
     7. KELILING & LUAS
     ====================================================== */
  const G7 = [
    r => { const s = ri(r, 4, 60), u = pick(r, ['cm', 'm']), ans = 4 * s;
      return mk(r, 'Sebuah persegi memiliki panjang sisi ' + s + ' ' + u + '. Keliling persegi tersebut adalah ....', f(ans) + ' ' + u, [s * s, 2 * s, 3 * s, 4 + s, ans + 4].map(x => f(x) + ' ' + u),
        'Keliling persegi = 4 × sisi = 4 × ' + s + ' = ' + f(ans) + ' ' + u + '.'); },
    r => { const s = ri(r, 4, 40), u = pick(r, ['cm', 'm']), ans = s * s;
      return mk(r, 'Luas sebuah persegi dengan panjang sisi ' + s + ' ' + u + ' adalah ....', f(ans) + ' ' + u + '²', [4 * s, 2 * s, ans + s, ans - s, 2 * ans].map(x => f(x) + ' ' + u + '²'),
        'Luas persegi = sisi × sisi = ' + s + ' × ' + s + ' = ' + f(ans) + ' ' + u + '².'); },
    r => { const l = ri(r, 3, 30), p = ri(r, l + 1, 45), u = pick(r, ['cm', 'm']), ans = 2 * (p + l);
      return mk(r, 'Persegi panjang berukuran panjang ' + p + ' ' + u + ' dan lebar ' + l + ' ' + u + '. Kelilingnya adalah ....', f(ans) + ' ' + u, [p * l, p + l, 2 * p + l, p + 2 * l, ans + 2].map(x => f(x) + ' ' + u),
        'Keliling = 2 × (p + l) = 2 × (' + p + ' + ' + l + ') = 2 × ' + (p + l) + ' = ' + f(ans) + ' ' + u + '.'); },
    r => { const l = ri(r, 3, 30), p = ri(r, l + 1, 45), u = pick(r, ['cm', 'm']), ans = p * l;
      return mk(r, 'Luas persegi panjang dengan panjang ' + p + ' ' + u + ' dan lebar ' + l + ' ' + u + ' adalah ....', f(ans) + ' ' + u + '²', [2 * (p + l), p + l, ans + p, ans - l, 2 * ans].map(x => f(x) + ' ' + u + '²'),
        'Luas = panjang × lebar = ' + p + ' × ' + l + ' = ' + f(ans) + ' ' + u + '².'); },
    r => { const s = ri(r, 4, 40), K = 4 * s;
      return mk(r, 'Keliling sebuah persegi adalah ' + K + ' cm. Panjang sisi persegi tersebut adalah ....', s + ' cm', [K / 2, K - 4, s * s, s + 4, s * 2 + 2].map(x => f(x) + ' cm'),
        'Keliling = 4 × sisi, maka sisi = keliling ÷ 4 = ' + K + ' ÷ 4 = ' + s + ' cm.'); },
    r => { const l = ri(r, 3, 25), p = ri(r, l + 1, 40), L = p * l;
      return mk(r, 'Luas sebuah persegi panjang adalah ' + L + ' cm². Jika panjangnya ' + p + ' cm, maka lebarnya adalah ....', l + ' cm', [p - l, p + l, L - p, l + 1, l * 2].map(x => f(x) + ' cm'),
        'Luas = panjang × lebar, maka lebar = luas ÷ panjang = ' + L + ' ÷ ' + p + ' = ' + l + ' cm.'); },
    r => { const l = ri(r, 6, 40), p = ri(r, l + 1, 60), ans = 2 * (p + l);
      return mk(r, 'Kebun berbentuk persegi panjang dengan panjang ' + p + ' m dan lebar ' + l + ' m. Di sekeliling kebun akan dipasang pagar. Panjang pagar yang diperlukan adalah ....', f(ans) + ' m',
        [p * l, p + l, 2 * p + l, 2 * p * l, ans + 4].map(x => f(x) + ' m'),
        'Panjang pagar sama dengan keliling kebun: 2 × (' + p + ' + ' + l + ') = ' + f(ans) + ' m.'); },
    r => { const p = ri(r, 2, 10) * 2, l = ri(r, 2, 8) * 2, ans = (p / 2) * (l / 2);
      return mk(r, 'Lantai ruangan berukuran ' + p + ' m × ' + l + ' m akan dipasang ubin persegi dengan sisi 2 m. Banyak ubin yang diperlukan adalah ....', f(ans) + ' buah',
        [p * l, (p * l) / 2, p / 2 + l / 2, ans + 2, ans - 2].filter(x => x > 0).map(x => f(x) + ' buah'),
        'Ubin yang muat sepanjang ruangan: ' + p + ' ÷ 2 = ' + p / 2 + '. Ubin yang muat selebar ruangan: ' + l + ' ÷ 2 = ' + l / 2 + '. Banyak ubin = ' + p / 2 + ' × ' + l / 2 + ' = ' + f(ans) + ' buah.'); },
    r => { let a = ri(r, 5, 30), b = ri(r, 5, 30), c = ri(r, Math.abs(a - b) + 1, a + b - 1), eq = r() < 0.3; if (eq) { b = a; c = a; }
      const ans = a + b + c;
      return mk(r, eq ? 'Sebuah segitiga sama sisi memiliki panjang sisi ' + a + ' cm. Kelilingnya adalah ....' : 'Sebuah segitiga memiliki panjang sisi ' + a + ' cm, ' + b + ' cm, dan ' + c + ' cm. Kelilingnya adalah ....', f(ans) + ' cm',
        [a + b, a + c, b + c, 2 * ans, ans + 3].map(x => f(x) + ' cm'),
        'Keliling segitiga = jumlah ketiga sisinya = ' + a + ' + ' + b + ' + ' + c + ' = ' + f(ans) + ' cm.'); },
    r => { const s = ri(r, 4, 25), K = 4 * s;
      return mk(r, 'Sebuah persegi memiliki keliling ' + K + ' cm. Luas persegi tersebut adalah ....', f(s * s) + ' cm²', [K, s, 2 * s * s, K * 2, s * s + s].map(x => f(x) + ' cm²'),
        'Sisi = ' + K + ' ÷ 4 = ' + s + ' cm. Luas = ' + s + ' × ' + s + ' = ' + (s * s) + ' cm².'); }
  ];

  /* ======================================================
     8. PENGOLAHAN DATA
     ====================================================== */
  const CAT = [
    { t: 'hobi siswa kelas 4', it: ['Membaca', 'Menggambar', 'Bermain bola', 'Menyanyi', 'Menari'], u: 'siswa' },
    { t: 'buah yang terjual di kantin', it: ['Apel', 'Jeruk', 'Mangga', 'Pisang', 'Semangka'], u: 'buah' },
    { t: 'hewan peliharaan siswa', it: ['Kucing', 'Ayam', 'Kelinci', 'Burung', 'Ikan'], u: 'ekor' },
    { t: 'penjualan es krim selama seminggu', it: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'], u: 'cup' },
    { t: 'siswa yang hadir menurut kelas', it: ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5'], u: 'siswa' }
  ];
  function tabel(r) {
    const c = pick(r, CAT), items = shuf(r, c.it).slice(0, 4), vals = shuf(r, Array.from({ length: 36 }, (_, i) => i + 5)).slice(0, 4);
    const pairs = items.map((n, i) => [n, vals[i]]);
    return { pairs: pairs, u: c.u, text: 'Data ' + c.t + ': ' + pairs.map(p => p[0] + ' (' + p[1] + ')').join(', ') + '.' };
  }
  const G8 = [
    r => { const T = tabel(r), big = r() < 0.5, s = T.pairs.slice().sort((a, b) => big ? b[1] - a[1] : a[1] - b[1]), ans = s[0];
      return mk(r, T.text + ' Data yang ' + (big ? 'paling banyak' : 'paling sedikit') + ' adalah ....', ans[0], T.pairs.filter(p => p !== ans).map(p => p[0]).concat(['Tidak ada']),
        'Bandingkan semua angka. Nilai ' + (big ? 'terbesar' : 'terkecil') + ' adalah ' + ans[1] + ', yaitu ' + ans[0] + '.'); },
    r => { const T = tabel(r), sum = T.pairs.reduce((a, p) => a + p[1], 0);
      return mk(r, T.text + ' Jumlah seluruh data adalah ....', sum + ' ' + T.u, nn(sum, [1, -1, 10, -10, 5, -5]).map(x => f(x) + ' ' + T.u),
        'Jumlahkan semua: ' + T.pairs.map(p => p[1]).join(' + ') + ' = ' + sum + '.'); },
    r => { const T = tabel(r), v = T.pairs.map(p => p[1]), ans = Math.max.apply(null, v) - Math.min.apply(null, v);
      return mk(r, T.text + ' Selisih data terbanyak dan data tersedikit adalah ....', f(ans) + ' ' + T.u, nn(ans, [1, -1, 2, -2, 10, 5]).map(x => f(x) + ' ' + T.u),
        'Selisih = terbesar − terkecil = ' + Math.max.apply(null, v) + ' − ' + Math.min.apply(null, v) + ' = ' + ans + '.'); },
    r => { const T = tabel(r), p = shuf(r, T.pairs).slice(0, 2), ans = p[0][1] + p[1][1];
      return mk(r, T.text + ' Jumlah ' + p[0][0] + ' dan ' + p[1][0] + ' adalah ....', f(ans) + ' ' + T.u, nn(ans, [1, -1, 10, -10, 5, -5]).map(x => f(x) + ' ' + T.u).concat([Math.abs(p[0][1] - p[1][1]) + ' ' + T.u]),
        p[0][0] + ' = ' + p[0][1] + ' dan ' + p[1][0] + ' = ' + p[1][1] + '. Jumlahnya ' + p[0][1] + ' + ' + p[1][1] + ' = ' + ans + '.'); },
    r => { const T = tabel(r), p = shuf(r, T.pairs).slice(0, 2).sort((a, b) => b[1] - a[1]), ans = p[0][1] - p[1][1];
      return mk(r, T.text + ' ' + p[0][0] + ' lebih banyak berapa dibandingkan ' + p[1][0] + '?', f(ans) + ' ' + T.u, nn(ans, [1, -1, 2, -2, 10]).map(x => f(x) + ' ' + T.u).concat([(p[0][1] + p[1][1]) + ' ' + T.u]),
        'Selisih = ' + p[0][1] + ' − ' + p[1][1] + ' = ' + ans + '.'); },
    r => { const m = ri(r, 12, 20) * 5, others = shuf(r, [60, 65, 70, 75, 80, 85, 90, 95, 100].filter(x => x !== m)).slice(0, 5);
      const list = shuf(r, [m, m, m].concat(others).concat([others[0]]));
      return mk(r, 'Nilai ulangan sembilan siswa: ' + list.join(', ') + '. Modus (nilai yang paling sering muncul) data tersebut adalah ....', m, others.slice(0, 4),
        'Hitung kemunculan tiap nilai. Nilai ' + m + ' muncul 3 kali, paling banyak dari yang lain. Jadi modusnya ' + m + '.'); },
    r => { const v = shuf(r, Array.from({ length: 31 }, (_, i) => i + 120)).slice(0, 6), mx = Math.max.apply(null, v), mn = Math.min.apply(null, v);
      return mk(r, 'Tinggi badan enam siswa (cm): ' + v.join(', ') + '. Selisih tinggi badan tertinggi dan terendah adalah ....', (mx - mn) + ' cm', [mx + ' cm', mn + ' cm', (mx - mn + 1) + ' cm', (mx - mn - 1) + ' cm', (mx - mn + 5) + ' cm'],
        'Tertinggi ' + mx + ' cm dan terendah ' + mn + ' cm. Selisihnya ' + mx + ' − ' + mn + ' = ' + (mx - mn) + ' cm.'); },
    r => { const g = ri(r, 1, 5), rm = ri(r, 1, 4), ans = 5 * g + rm, tally = Array(g).fill('||||/').join(' ') + ' ' + Array(rm).fill('|').join('');
      return mk(r, 'Pada tabel turus, tanda ||||/ menyatakan 5. Tanda turus ' + tally + ' menyatakan banyak data sebesar ....', ans, [g + rm, ans + 1, ans - 1, 4 * g + rm, ans + 5],
        'Tiap kelompok ||||/ bernilai 5. Ada ' + g + ' kelompok: ' + g + ' × 5 = ' + 5 * g + '. Ditambah ' + rm + ' garis tunggal = ' + ans + '.'); }
  ];

  /* ======================================================
     MATERI, CONTOH SOAL & DAFTAR TOPIK
     ====================================================== */
  const TOPICS = [
    {
      id: 'bilangan', nama: 'Bilangan Cacah sampai 100.000', ikon: '🔢', warna: '#3b82f6',
      desc: 'Nilai tempat, membaca, membandingkan, membulatkan, dan pola bilangan.',
      gens: G1,
      materi: [
        { h: 'Nilai Tempat', b: '<p>Setiap angka dalam bilangan punya <b>nilai tempat</b>. Bilangan <b>45.382</b>:</p><table class="tbl"><tr><th>Puluh ribuan</th><th>Ribuan</th><th>Ratusan</th><th>Puluhan</th><th>Satuan</th></tr><tr><td>4</td><td>5</td><td>3</td><td>8</td><td>2</td></tr><tr><td>40.000</td><td>5.000</td><td>300</td><td>80</td><td>2</td></tr></table><p><b>Bentuk panjang:</b> 45.382 = 40.000 + 5.000 + 300 + 80 + 2.</p>' },
        { h: 'Membaca dan Menulis Bilangan', b: '<p>Bilangan <b>32.500</b> dibaca <i>tiga puluh dua ribu lima ratus</i>.</p><div class="tip">💡 Titik dipakai untuk memisahkan kelompok tiga angka dari kanan (satuan, puluhan, ratusan | ribuan).</div>' },
        { h: 'Membandingkan dan Mengurutkan', b: '<p>Bandingkan angka dari <b>tempat paling kiri</b>. Jika sama, lanjut ke tempat berikutnya.</p><ul><li>Tanda <b>&gt;</b> berarti lebih besar, <b>&lt;</b> berarti lebih kecil, <b>=</b> berarti sama.</li><li>Contoh: 45.210 &gt; 45.120 karena ratusan 2 lebih besar dari 1.</li></ul>' },
        { h: 'Pembulatan', b: '<p>Lihat angka <b>tepat di kanan</b> tempat yang dibulatkan.</p><ul><li>Angka 5, 6, 7, 8, 9 → dibulatkan <b>ke atas</b>.</li><li>Angka 0, 1, 2, 3, 4 → dibulatkan <b>ke bawah</b>.</li></ul><p>Contoh: 3.460 ke ratusan terdekat = 3.500 (angka puluhan 6, naik). Ke ribuan terdekat = 3.000 (angka ratusan 4, turun).</p>' },
        { h: 'Pola Bilangan', b: '<p>Pola bilangan punya aturan tetap, misalnya selalu bertambah atau berkurang dengan beda yang sama. Cari <b>selisih dua suku yang berurutan</b> untuk menemukan aturannya.</p>' }
      ],
      contoh: [
        { s: 'Berapa nilai angka 7 pada bilangan 37.405?', l: ['Tentukan tempat angka 7: 37.405 → angka 3 (puluh ribuan), 7 (ribuan), 4 (ratusan), 0 (puluhan), 5 (satuan).', 'Angka 7 berada di tempat ribuan.', 'Nilainya 7 × 1.000 = 7.000.'], j: '7.000' },
        { s: 'Bulatkan 6.472 ke ratusan terdekat.', l: ['Tempat ratusan adalah angka 4.', 'Lihat angka di kanannya (puluhan): 7.', 'Karena 7 lebih dari 5, angka ratusan naik menjadi 5 dan angka sesudahnya menjadi 0.'], j: '6.500' },
        { s: 'Lanjutkan pola: 2.000, 2.500, 3.000, 3.500, ....', l: ['Cari selisih: 2.500 − 2.000 = 500; 3.000 − 2.500 = 500.', 'Polanya bertambah 500.', 'Suku berikutnya: 3.500 + 500 = 4.000.'], j: '4.000' }
      ]
    },
    {
      id: 'tambahkurang', nama: 'Penjumlahan dan Pengurangan', ikon: '➕', warna: '#10b981',
      desc: 'Hitung bersusun, penaksiran, dan soal cerita penjumlahan-pengurangan.',
      gens: G2,
      materi: [
        { h: 'Penjumlahan Bersusun', b: '<p>Tulis bilangan ke bawah dengan tempat yang sejajar. Jumlahkan mulai dari <b>satuan</b> ke kiri. Jika hasil 10 atau lebih, <b>simpan</b> angka puluhannya ke tempat berikutnya.</p>' },
        { h: 'Pengurangan Bersusun', b: '<p>Kurangkan mulai dari satuan. Jika angka atas lebih kecil dari angka bawah, <b>pinjam</b> 1 dari tempat di sebelah kirinya (bernilai 10 di tempat ini).</p>' },
        { h: 'Sifat dan Cara Memeriksa', b: '<ul><li>Penjumlahan bersifat <b>pertukaran</b>: 25 + 17 = 17 + 25.</li><li>Pengurangan <b>tidak</b> bersifat pertukaran: 9 − 4 ≠ 4 − 9.</li><li>Periksa hasil: jika a − b = c, maka c + b = a.</li></ul>' },
        { h: 'Penaksiran', b: '<p>Bulatkan dulu bilangannya, lalu hitung. Hasil penaksiran dipakai untuk memastikan jawaban masuk akal.</p>' },
        { h: 'Soal Cerita', b: '<ol><li>Tulis yang <b>diketahui</b>.</li><li>Tulis yang <b>ditanya</b>.</li><li>Tentukan operasi (menambah, menggabung → +; mengurangi, sisa, selisih → −).</li><li>Hitung dan tulis jawaban lengkap dengan satuannya.</li></ol>' }
      ],
      contoh: [
        { s: '4.375 + 2.658 = ....', l: ['Satuan: 5 + 8 = 13 → tulis 3, simpan 1.', 'Puluhan: 7 + 5 + 1 = 13 → tulis 3, simpan 1.', 'Ratusan: 3 + 6 + 1 = 10 → tulis 0, simpan 1.', 'Ribuan: 4 + 2 + 1 = 7.'], j: '7.033' },
        { s: '8.000 − 3.456 = ....', l: ['Satuan: 0 kurang dari 6, pinjam sehingga 10 − 6 = 4.', 'Puluhan: setelah dipinjam, 9 − 5 = 4.', 'Ratusan: 9 − 4 = 5.', 'Ribuan: 7 − 3 = 4.'], j: '4.544' },
        { s: 'Pak Made punya 2.500 ekor bebek. Ia membeli 850 ekor lagi, lalu menjual 1.200 ekor. Berapa ekor bebek sekarang?', l: ['Setelah membeli: 2.500 + 850 = 3.350.', 'Setelah menjual: 3.350 − 1.200 = 2.150.'], j: '2.150 ekor' }
      ]
    },
    {
      id: 'kalibagi', nama: 'Perkalian dan Pembagian', ikon: '✖️', warna: '#f59e0b',
      desc: 'Perkalian bersusun, pembagian dengan sisa, dan urutan operasi hitung.',
      gens: G3,
      materi: [
        { h: 'Perkalian', b: '<p>Perkalian adalah penjumlahan berulang: 4 × 3 = 3 + 3 + 3 + 3. Untuk bilangan besar, uraikan dulu:</p><p>36 × 24 = (36 × 20) + (36 × 4) = 720 + 144 = 864.</p><div class="tip">💡 Mengalikan dengan 10, 100, 1.000 cukup menambah nol di belakang.</div>' },
        { h: 'Pembagian', b: '<p>Pembagian adalah kebalikan perkalian dan sama dengan pengurangan berulang. Pada pembagian bersusun (porogapit) bagi angka dari kiri.</p><p>Jika tidak habis dibagi, ada <b>sisa</b>. Sisa harus <b>lebih kecil</b> dari pembagi.</p>' },
        { h: 'Hubungan Kali dan Bagi', b: '<p>Satu keluarga fakta: 6 × 7 = 42, 7 × 6 = 42, 42 ÷ 6 = 7, 42 ÷ 7 = 6. Gunakan perkalian untuk memeriksa pembagian.</p>' },
        { h: 'Urutan Operasi Hitung', b: '<ol><li>Kerjakan yang ada di dalam <b>kurung ( )</b> lebih dulu.</li><li>Lalu <b>× dan ÷</b> dari kiri ke kanan.</li><li>Terakhir <b>+ dan −</b> dari kiri ke kanan.</li></ol>' }
      ],
      contoh: [
        { s: '36 × 24 = ....', l: ['36 × 4 = 144.', '36 × 20 = 720.', 'Jumlahkan: 144 + 720 = 864.'], j: '864' },
        { s: '875 ÷ 6 = .... sisa ....', l: ['87 ÷ 6 = 14 (6 × 14 = 84), sisa 3.', 'Turunkan angka 5 menjadi 35. 35 ÷ 6 = 5 (6 × 5 = 30), sisa 5.', 'Hasil bagi 145 dan sisa 5. Cek: 6 × 145 + 5 = 875.'], j: '145 sisa 5' },
        { s: '12 + 8 × 5 = .... dan (12 + 8) × 5 = ....', l: ['12 + 8 × 5: perkalian dulu, 8 × 5 = 40, lalu 12 + 40 = 52.', '(12 + 8) × 5: kurung dulu, 12 + 8 = 20, lalu 20 × 5 = 100.'], j: '52 dan 100' }
      ]
    },
    {
      id: 'faktor', nama: 'Faktor, Kelipatan, KPK dan FPB', ikon: '🧩', warna: '#8b5cf6',
      desc: 'Faktor, kelipatan, bilangan prima, faktorisasi prima, KPK, dan FPB.',
      gens: G4,
      materi: [
        { h: 'Faktor dan Kelipatan', b: '<ul><li><b>Faktor</b> suatu bilangan adalah bilangan yang membagi habis bilangan itu. Faktor 12 = 1, 2, 3, 4, 6, 12.</li><li><b>Kelipatan</b> diperoleh dengan mengalikan bilangan dengan 1, 2, 3, .... Kelipatan 4 = 4, 8, 12, 16, ....</li></ul>' },
        { h: 'Bilangan Prima', b: '<p>Bilangan prima hanya punya <b>dua faktor</b>: 1 dan dirinya sendiri. Contoh: 2, 3, 5, 7, 11, 13, 17, 19, 23. Angka 1 bukan bilangan prima.</p>' },
        { h: 'Faktorisasi Prima', b: '<p>Menyatakan bilangan sebagai perkalian bilangan prima, memakai <b>pohon faktor</b>. Contoh: 60 → 2 × 30 → 2 × 2 × 15 → 2 × 2 × 3 × 5.</p>' },
        { h: 'KPK dan FPB', b: '<ul><li><b>KPK</b> (Kelipatan Persekutuan Terkecil): kelipatan yang sama dan paling kecil dari dua bilangan.</li><li><b>FPB</b> (Faktor Persekutuan Terbesar): faktor yang sama dan paling besar dari dua bilangan.</li></ul><div class="tip">💡 Soal tentang kejadian yang <i>terulang bersamaan</i> memakai KPK. Soal tentang <i>membagi sama banyak</i> memakai FPB.</div>' }
      ],
      contoh: [
        { s: 'Tentukan KPK dari 6 dan 8.', l: ['Kelipatan 6: 6, 12, 18, 24, 30.', 'Kelipatan 8: 8, 16, 24, 32.', 'Kelipatan yang sama dan terkecil adalah 24.'], j: '24' },
        { s: 'Tentukan FPB dari 12 dan 18.', l: ['Faktor 12: 1, 2, 3, 4, 6, 12.', 'Faktor 18: 1, 2, 3, 6, 9, 18.', 'Faktor yang sama: 1, 2, 3, 6. Terbesar adalah 6.'], j: '6' },
        { s: 'Bu Ani punya 24 apel dan 36 jeruk. Buah dibagi ke keranjang dengan isi sama banyak. Paling banyak berapa keranjang?', l: ['Soal membagi sama banyak, gunakan FPB.', 'Faktor 24: 1, 2, 3, 4, 6, 8, 12, 24. Faktor 36: 1, 2, 3, 4, 6, 9, 12, 18, 36.', 'FPB-nya 12.'], j: '12 keranjang' }
      ]
    },
    {
      id: 'pecahan', nama: 'Pecahan', ikon: '🍕', warna: '#ef4444',
      desc: 'Pecahan senilai, menyederhanakan, membandingkan, menjumlah, dan mengurang.',
      gens: G5,
      materi: [
        { h: 'Arti Pecahan', b: '<p>Pecahan 3/4 berarti <b>3 bagian</b> dari <b>4 bagian</b> yang sama besar. Angka atas disebut <b>pembilang</b>, angka bawah <b>penyebut</b>.</p>' },
        { h: 'Pecahan Senilai dan Menyederhanakan', b: '<ul><li>Pecahan senilai: kalikan pembilang dan penyebut dengan bilangan yang sama. 1/2 = 2/4 = 3/6.</li><li>Menyederhanakan: bagi pembilang dan penyebut dengan FPB-nya. 12/18 = 2/3.</li></ul>' },
        { h: 'Membandingkan Pecahan', b: '<ul><li>Penyebut sama: pembilang lebih besar, pecahan lebih besar. 5/8 &gt; 3/8.</li><li>Pembilang sama: penyebut lebih besar, pecahan lebih <b>kecil</b>. 1/3 &gt; 1/5.</li></ul>' },
        { h: 'Menjumlah dan Mengurang', b: '<p>Jika penyebut sama, jumlahkan atau kurangkan <b>pembilangnya saja</b>. Penyebut tidak berubah.</p><p>3/8 + 2/8 = 5/8 dan 5/6 − 2/6 = 3/6 = 1/2.</p>' },
        { h: 'Pecahan Campuran dan Pecahan dari Bilangan', b: '<ul><li>2 1/3 = (2 × 3 + 1)/3 = 7/3.</li><li>3/4 dari 20: bagi 20 menjadi 4 bagian (5), ambil 3 bagian = 15.</li></ul>' }
      ],
      contoh: [
        { s: 'Tentukan pecahan senilai dengan 2/3 yang penyebutnya 12.', l: ['Penyebut 3 menjadi 12, dikali 4 (3 × 4 = 12).', 'Pembilang juga dikali 4: 2 × 4 = 8.'], j: '8/12' },
        { s: 'Hitung 3/8 + 2/8.', l: ['Penyebut sama (8), jumlahkan pembilang: 3 + 2 = 5.', 'Penyebut tetap 8.'], j: '5/8' },
        { s: 'Berapa 3/4 dari 20?', l: ['Bagi 20 menjadi 4 bagian: 20 ÷ 4 = 5.', 'Ambil 3 bagian: 3 × 5 = 15.'], j: '15' }
      ]
    },
    {
      id: 'ukuran', nama: 'Pengukuran: Panjang, Berat, Waktu', ikon: '📏', warna: '#0ea5e9',
      desc: 'Mengubah satuan panjang, berat, dan waktu serta menghitung durasi.',
      gens: G6,
      materi: [
        { h: 'Satuan Panjang', b: '<p>Tangga satuan panjang: km → hm → dam → m → dm → cm → mm. Turun satu tangga dikali 10, naik satu tangga dibagi 10.</p><ul><li>1 km = 1.000 m</li><li>1 m = 100 cm</li><li>1 cm = 10 mm</li></ul>' },
        { h: 'Satuan Berat', b: '<ul><li>1 ton = 1.000 kg</li><li>1 kuintal = 100 kg</li><li>1 kg = 1.000 gram</li><li>1 ons = 100 gram</li></ul>' },
        { h: 'Satuan Waktu', b: '<ul><li>1 jam = 60 menit</li><li>1 menit = 60 detik</li><li>1 hari = 24 jam</li><li>1 minggu = 7 hari</li></ul>' },
        { h: 'Pukul dan Lama Waktu', b: '<ul><li>Sistem 24 jam → 12 jam: kurangi 12 untuk jam 13 sampai 23. Pukul 16.30 = pukul 04.30 sore.</li><li>Lama waktu = waktu selesai − waktu mulai. Pukul 09.45 − 07.15 = 2 jam 30 menit.</li><li>Waktu selesai = waktu mulai + lama kegiatan.</li></ul>' }
      ],
      contoh: [
        { s: '4 km 300 m = .... m', l: ['4 km = 4 × 1.000 = 4.000 m.', 'Tambahkan 300 m: 4.000 + 300 = 4.300 m.'], j: '4.300 m' },
        { s: 'Budi berangkat pukul 07.15 dan tiba pukul 09.45. Berapa lama perjalanannya?', l: ['Dari 07.15 ke 08.15 = 1 jam.', 'Dari 08.15 ke 09.15 = 1 jam lagi (total 2 jam).', 'Dari 09.15 ke 09.45 = 30 menit.'], j: '2 jam 30 menit' },
        { s: 'Pukul 16.30 ditulis dengan sistem 12 jam menjadi ....', l: ['Jam 16 lebih dari 12, kurangi 12: 16 − 12 = 4.', 'Pukul 16.30 berada pada waktu sore.'], j: 'Pukul 04.30 sore' }
      ]
    },
    {
      id: 'bangun', nama: 'Keliling dan Luas Bangun Datar', ikon: '📐', warna: '#14b8a6',
      desc: 'Keliling dan luas persegi, persegi panjang, serta keliling segitiga.',
      gens: G7,
      materi: [
        { h: 'Persegi', b: '<p>Persegi punya 4 sisi sama panjang (s).</p><ul><li><b>Keliling</b> = 4 × s</li><li><b>Luas</b> = s × s</li></ul>' },
        { h: 'Persegi Panjang', b: '<p>Persegi panjang punya panjang (p) dan lebar (l).</p><ul><li><b>Keliling</b> = 2 × (p + l)</li><li><b>Luas</b> = p × l</li></ul>' },
        { h: 'Segitiga', b: '<p>Keliling segitiga = jumlah ketiga sisinya.</p>' },
        { h: 'Satuan', b: '<p>Keliling memakai satuan panjang (cm, m). Luas memakai satuan persegi (cm², m²).</p><div class="tip">💡 Keliling = panjang pagar di sekeliling. Luas = banyak ubin yang menutupi permukaan.</div>' }
      ],
      contoh: [
        { s: 'Persegi dengan sisi 12 cm. Berapa keliling dan luasnya?', l: ['Keliling = 4 × 12 = 48 cm.', 'Luas = 12 × 12 = 144 cm².'], j: 'Keliling 48 cm, luas 144 cm²' },
        { s: 'Persegi panjang berukuran 15 cm × 8 cm. Berapa keliling dan luasnya?', l: ['Keliling = 2 × (15 + 8) = 2 × 23 = 46 cm.', 'Luas = 15 × 8 = 120 cm².'], j: 'Keliling 46 cm, luas 120 cm²' },
        { s: 'Luas persegi panjang 96 cm² dan panjangnya 12 cm. Berapa lebarnya?', l: ['Luas = p × l, maka l = luas ÷ p.', 'l = 96 ÷ 12 = 8.'], j: '8 cm' }
      ]
    },
    {
      id: 'data', nama: 'Pengolahan Data', ikon: '📊', warna: '#ec4899',
      desc: 'Membaca tabel dan turus, mencari data terbanyak, modus, dan selisih.',
      gens: G8,
      materi: [
        { h: 'Membaca Tabel', b: '<p>Tabel menyajikan data dalam baris dan kolom sehingga mudah dibaca. Perhatikan judul data dan satuannya.</p>' },
        { h: 'Tabel Turus', b: '<p>Turus dipakai untuk menghitung. Tiap lima turus ditulis <b>||||/</b> yang berarti 5. Contoh: ||||/ ||||/ ||| = 5 + 5 + 3 = 13.</p>' },
        { h: 'Modus', b: '<p><b>Modus</b> adalah data yang paling sering muncul. Contoh: 7, 8, 8, 9, 8, 6 → modusnya 8 (muncul 3 kali).</p>' },
        { h: 'Data Terbesar, Terkecil, dan Selisih', b: '<ul><li>Data terbesar = nilai paling tinggi, data terkecil = nilai paling rendah.</li><li>Selisih terbesar dan terkecil = terbesar − terkecil.</li></ul>' }
      ],
      contoh: [
        { s: 'Data buah terjual: Apel (12), Jeruk (20), Mangga (8), Pisang (15). Buah apa yang paling banyak terjual dan berapa jumlah seluruhnya?', l: ['Bandingkan angka: 20 paling besar, yaitu Jeruk.', 'Jumlah: 12 + 20 + 8 + 15 = 55.'], j: 'Jeruk; 55 buah' },
        { s: 'Nilai: 80, 75, 90, 80, 85, 80, 70. Tentukan modusnya.', l: ['Hitung kemunculan: 80 muncul 3 kali, nilai lain 1 kali.', 'Modus adalah yang paling sering muncul.'], j: '80' },
        { s: 'Tanda turus ||||/ ||||/ |||| menyatakan berapa?', l: ['Ada dua kelompok ||||/ → 2 × 5 = 10.', 'Ditambah 4 garis tunggal → 10 + 4 = 14.'], j: '14' }
      ]
    }
  ];

  /* ---------- membangun bank soal (minimal 30, dibuat 40 per materi) ---------- */
  TOPICS.forEach(function (t) {
    const r = R(hash(t.id)); const out = []; const seen = {}; let tries = 0;
    while (out.length < 40 && tries < 6000) {
      const g = t.gens[tries % t.gens.length]; tries++;
      const q = g(r);
      if (!q || seen[q.q]) continue;
      seen[q.q] = 1; q.id = t.id + '-' + (out.length + 1); out.push(q);
    }
    t.bank = out; delete t.gens;
  });

  window.TOPICS = TOPICS;
})();
