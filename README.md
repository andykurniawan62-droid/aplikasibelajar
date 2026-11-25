# Ruang Belajar Matematika (Kelas 4 SD)

Aplikasi belajar mandiri berbasis website untuk siswa kelas 4.
Dibuat oleh **Andy Kurniawan, S.Pd.SD** - SDN SP 3 Prode.
🎉 Selamat Hari Guru Nasional 🎉

## Isi aplikasi
- 8 materi: Bilangan Cacah, Penjumlahan dan Pengurangan, Perkalian dan Pembagian, Faktor/KPK/FPB, Pecahan, Pengukuran, Keliling dan Luas, Pengolahan Data.
- Materi ringkas, contoh soal dengan langkah bertahap.
- Bank soal 40 nomor per materi. Soal dan pilihan jawaban diacak tiap sesi.
- Pilihan 10, 20, atau 30 soal. Koreksi dan nilai otomatis, lalu pembahasan.
- Fitur mengulang soal yang salah.
- Progres belajar tersimpan di perangkat siswa (localStorage).
- Responsif untuk HP, tablet, dan komputer. Tanpa API Key dan tanpa biaya layanan AI.

## Cara memakai
Buka `index.html` di peramban. Tidak perlu server atau internet.

## Publikasi lewat GitHub Pages
1. Buat repository baru di GitHub.
2. Unggah `index.html`, `style.css`, `app.js`, `data.js` (dan README ini) ke cabang `main`.
3. Buka **Settings → Pages**, pada *Build and deployment* pilih **Deploy from a branch**, cabang `main`, folder `/ (root)`, lalu **Save**.
4. Tunggu beberapa menit. Alamat aplikasi: `https://<nama-akun>.github.io/<nama-repository>/`.

## Mengubah isi
- Materi dan contoh soal: `data.js` (bagian `TOPICS`).
- Tampilan: `style.css`. Logika: `app.js`.
