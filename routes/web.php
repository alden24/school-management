<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GuruController; 
use App\Http\Controllers\KelasController; 
use App\Http\Controllers\OrangTuaController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\NilaiController;
use App\Http\Controllers\KategoriMataPelajaranController;
use App\Http\Controllers\MataPelajaranController; 
use App\Http\Controllers\KurikulumController; 
use App\Http\Controllers\JadwalPelajaranController;
use App\Http\Controllers\JadwalSiswaController;
use App\Http\Controllers\UjianController;
use App\Http\Controllers\SoalController;
use App\Http\Controllers\KenaikanKelasController;
use App\Http\Controllers\MutasiSiswaController;
use App\Http\Controllers\UjianSiswaController;
use App\Http\Controllers\PresensiGuruController;
use App\Http\Controllers\PengaturanSekolahController;
use App\Http\Controllers\LaporanPresensiController;
use App\Http\Controllers\KejuruanController;
use App\Http\Controllers\DudiController;
use App\Http\Controllers\PrakerinController;
use App\Http\Controllers\PembimbingDudiController;
use App\Http\Controllers\JurnalHarianController;
use App\Http\Controllers\ValidasiJurnalController;
use App\Http\Controllers\PenilaianPrakerinController;
use App\Http\Controllers\PresensiPrakerinController;
use App\Http\Controllers\LaporanPrakerinController;
use App\Http\Controllers\PembayaranController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Semester;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// PERBAIKAN: Hanya gunakan satu definisi rute untuk dashboard
Route::get('/dashboard', function () {
    // Ambil data statistik
    $totalSiswa = Siswa::count();
    $totalGuru = Guru::count();
    $totalKelas = Kelas::count();
    $activeSemester = Semester::where('is_active', true)->first();

    // Ambil 5 siswa terbaru yang ditambahkan
    $recentStudents = Siswa::with('kelas') // Muat relasi kelas
        ->latest() // Urutkan dari yang terbaru
        ->take(5) // Ambil 5 data teratas
        ->get();

    return Inertia::render('Dashboard', [
        'totalSiswa' => $totalSiswa,
        'totalGuru' => $totalGuru,
        'totalKelas' => $totalKelas,
        'activeSemester' => $activeSemester ? $activeSemester->nama : 'Belum Diatur',
        'recentStudents' => $recentStudents, // Kirim data siswa baru ke frontend
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// Rute duplikat di bawah ini telah dihapus

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('guru', GuruController::class)->except(['show']);
    Route::resource('kelas', KelasController::class);
    Route::resource('orangtua', OrangTuaController::class);
    Route::resource('siswa', SiswaController::class);
    Route::resource('semester', SemesterController::class);
    Route::resource('kategori-matapelajaran', KategoriMataPelajaranController::class);
    Route::resource('matapelajaran', MataPelajaranController::class);
    Route::resource('jadwal-pelajaran', JadwalPelajaranController::class);
    Route::post('/siswa/{siswa}/reset-password', [SiswaController::class, 'resetPassword'])->name('siswa.reset-password');
    Route::get('/jadwal-saya', [JadwalSiswaController::class, 'index'])->name('jadwal.siswa');
    Route::post('/guru/{guru}/reset-password', [GuruController::class, 'resetPassword'])->name('guru.reset-password');
    Route::get('/absensi', [AbsensiController::class, 'index'])->name('absensi.index');
    Route::post('/absensi', [AbsensiController::class, 'store'])->name('absensi.store');
    Route::get('/nilai', [NilaiController::class, 'index'])->name('nilai.index');
    Route::post('/nilai', [NilaiController::class, 'store'])->name('nilai.store');
    Route::get('/guru/jadwal-saya', [GuruController::class, 'jadwalSaya'])->name('guru.jadwalSaya');
    Route::get('/absensi/laporan', [AbsensiController::class, 'laporan'])->name('absensi.laporan');
    Route::resource('ujian', UjianController::class);
    Route::resource('soal', SoalController::class)->except(['index', 'create', 'edit', 'show']);
    Route::resource('kurikulum', KurikulumController::class);
    Route::get('/kenaikan-kelas', [KenaikanKelasController::class, 'index'])->name('kenaikan-kelas.index');
    Route::post('/kenaikan-kelas', [KenaikanKelasController::class, 'store'])->name('kenaikan-kelas.store');
    Route::get('/mutasi-siswa', [MutasiSiswaController::class, 'index'])->name('mutasi-siswa.index');
    Route::post('/mutasi-siswa', [MutasiSiswaController::class, 'store'])->name('mutasi-siswa.store');
    Route::get('/ujian-siswa', [UjianSiswaController::class, 'index'])->name('ujian.siswa.index');
    Route::get('/ujian-siswa/{ujian}', [UjianSiswaController::class, 'show'])->name('ujian.siswa.show');
    Route::post('/ujian-siswa/{ujian}/submit', [UjianSiswaController::class, 'submit'])->name('ujian.siswa.submit');
    Route::get('/ujian/{ujian}/hasil', [UjianController::class, 'hasil'])->name('ujian.hasil');
    Route::get('/presensi-guru', [PresensiGuruController::class, 'index'])->name('presensi.guru.index');
    Route::post('/presensi-guru/masuk', [PresensiGuruController::class, 'storeMasuk'])->name('presensi.guru.masuk');
    Route::post('/presensi-guru/pulang', [PresensiGuruController::class, 'storePulang'])->name('presensi.guru.pulang');
    Route::get('/pengaturan-sekolah', [PengaturanSekolahController::class, 'index'])->name('pengaturan.sekolah.index');
    Route::post('/pengaturan-sekolah', [PengaturanSekolahController::class, 'update'])->name('pengaturan.sekolah.update');
    Route::get('/laporan/presensi-guru', [LaporanPresensiController::class, 'index'])->name('laporan.presensi.guru.index');
    Route::get('/laporan/presensi-guru/export-excel', [LaporanPresensiController::class, 'exportExcel'])->name('laporan.presensi.guru.export.excel');
    Route::get('/laporan/presensi-guru/export-pdf', [LaporanPresensiController::class, 'exportPdf'])->name('laporan.presensi.guru.export.pdf');
    Route::post('/presensi-guru/keterangan', [PresensiGuruController::class, 'storeKeterangan'])->name('presensi.guru.keterangan');
    Route::resource('kejuruan', KejuruanController::class);
    Route::resource('dudi', DudiController::class);
    Route::resource('pembimbing-dudi', PembimbingDudiController::class);
    Route::resource('penempatan-prakerin', PrakerinController::class);
    Route::get('/penempatan-prakerin/dudi/{dudi}/generate-surat', [PrakerinController::class, 'generateSuratKolektif'])->name('prakerin.generateSuratKolektif');
    Route::resource('jurnal-harian', JurnalHarianController::class)->only(['index', 'store']);
    Route::get('/validasi-jurnal', [ValidasiJurnalController::class, 'index'])->name('validasi.jurnal.index');
    Route::put('/validasi-jurnal/{jurnal}', [ValidasiJurnalController::class, 'update'])->name('validasi.jurnal.update');
    Route::post('/penempatan-prakerin/dudi/{dudi}/update-status', [PrakerinController::class, 'updateStatusDudi'])->name('prakerin.updateStatusDudi');
    Route::get('/penilaian-prakerin', [PenilaianPrakerinController::class, 'index'])->name('penilaian.prakerin.index');
    Route::post('/penilaian-prakerin', [PenilaianPrakerinController::class, 'store'])->name('penilaian.prakerin.store');
    Route::get('/presensi-prakerin', [PresensiPrakerinController::class, 'index'])->name('presensi.prakerin.index');
    Route::post('/presensi-prakerin/masuk', [PresensiPrakerinController::class, 'storeMasuk'])->name('presensi.prakerin.masuk');
    Route::post('/presensi-prakerin/pulang', [PresensiPrakerinController::class, 'storePulang'])->name('presensi.prakerin.pulang');
    Route::post('/presensi-prakerin/keterangan', [PresensiPrakerinController::class, 'storeKeterangan'])->name('presensi.prakerin.keterangan');
    Route::get('/laporan/presensi-prakerin', [LaporanPrakerinController::class, 'index'])->name('laporan.prakerin.index');
    Route::get('/siswa/{siswa}/kartu-pelajar', [SiswaController::class, 'cetakKartuPelajar'])->name('siswa.kartu-pelajar');
    Route::get('/pembayaran-spp', [PembayaranController::class, 'index'])->name('pembayaran.index');
    Route::post('/pembayaran-spp', [PembayaranController::class, 'createTransaction'])->name('pembayaran.create');
    Route::get('/pembayaran-spp/{siswa}', [PembayaranController::class, 'show'])->name('pembayaran.show');
    Route::post('/pembayaran-spp/buat-tagihan', [PembayaranController::class, 'storeTagihan'])->name('pembayaran.storeTagihan');
    Route::post('/pembayaran-spp/buat-tagihan-massal', [PembayaranController::class, 'storeBulkTagihan'])->name('pembayaran.storeBulkTagihan');

});
// Rute untuk notifikasi dari Midtrans (tanpa middleware auth)
Route::post('/midtrans/notification', [PembayaranController::class, 'notificationHandler'])->name('midtrans.notification');

require __DIR__.'/auth.php';
