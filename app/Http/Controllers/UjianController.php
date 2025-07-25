<?php

namespace App\Http\Controllers;

use App\Models\Ujian;
use App\Models\JadwalPelajaran;
use App\Models\JawabanSiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UjianController extends Controller
{
    /**
     * Menampilkan daftar semua ujian yang dibuat oleh guru atau semua ujian jika admin.
     */
    public function index()
    {
        $user = Auth::user();
        
        $query = Ujian::with(['jadwalPelajaran.kelas', 'jadwalPelajaran.mataPelajaran', 'jadwalPelajaran.guru']);

        if ($user->role === 'guru') {
            if (!$user->guru) {
                return redirect()->back()->withErrors(['error' => 'Akun Anda tidak terhubung dengan data guru.']);
            }
            $jadwalIds = JadwalPelajaran::where('guru_id', $user->guru->id)->pluck('id');
            $query->whereIn('jadwal_pelajaran_id', $jadwalIds);
        }

        // Menghitung jumlah soal secara dinamis untuk setiap ujian
        $ujians = $query->withCount('soals')->latest()->get();

        return Inertia::render('Ujian/Index', [
            'ujians' => $ujians,
        ]);
    }

    /**
     * Menampilkan form untuk membuat ujian baru.
     */
    public function create()
    {
        $user = Auth::user();
        if (!$user->guru) {
            return redirect()->back()->withErrors(['error' => 'Akun Anda tidak terhubung dengan data guru.']);
        }
        return Inertia::render('Ujian/Create', [
            'jadwals' => JadwalPelajaran::where('guru_id', $user->guru->id)
                ->with(['kelas', 'mataPelajaran'])
                ->get(),
        ]);
    }

    /**
     * Menyimpan ujian baru ke database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'jadwal_pelajaran_id' => 'required|exists:jadwal_pelajarans,id',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'waktu_mulai' => 'required|date',
            'waktu_selesai' => 'required|date|after:waktu_mulai',
            'tipe' => 'required|in:Ujian,Kuis,Latihan',
        ]);

        Ujian::create($validated);

        return redirect()->route('ujian.index')->with('message', 'Ujian berhasil dibuat.');
    }

    /**
     * Menampilkan halaman detail ujian (Bank Soal).
     */
    public function show(Ujian $ujian)
    {
        $ujian->load(['soals.pilihanJawabans', 'jadwalPelajaran.kelas', 'jadwalPelajaran.mataPelajaran']);
        return Inertia::render('Ujian/Show', [
            'ujian' => $ujian,
        ]);
    }

    /**
     * Menampilkan form untuk mengedit ujian.
     */
    public function edit(Ujian $ujian)
    {
        $user = Auth::user();
        if (!$user->guru) {
            return redirect()->back()->withErrors(['error' => 'Akun Anda tidak terhubung dengan data guru.']);
        }
        return Inertia::render('Ujian/Edit', [
            'ujian' => $ujian,
            'jadwals' => JadwalPelajaran::where('guru_id', $user->guru->id)
                ->with(['kelas', 'mataPelajaran'])
                ->get(),
        ]);
    }

    /**
     * Memperbarui ujian di database.
     */
    public function update(Request $request, Ujian $ujian)
    {
        $validated = $request->validate([
            'jadwal_pelajaran_id' => 'required|exists:jadwal_pelajarans,id',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'waktu_mulai' => 'required|date',
            'waktu_selesai' => 'required|date|after:waktu_mulai',
            'tipe' => 'required|in:Ujian,Kuis,Latihan',
        ]);

        $ujian->update($validated);

        return redirect()->route('ujian.index')->with('message', 'Ujian berhasil diperbarui.');
    }

    /**
     * Menghapus ujian dari database.
     */
    public function destroy(Ujian $ujian)
    {
        $ujian->delete();
        return redirect()->route('ujian.index')->with('message', 'Ujian berhasil dihapus.');
    }

    /**
     * Menampilkan halaman hasil ujian untuk guru.
     */
    public function hasil(Ujian $ujian)
    {
        $ujian->load(['jadwalPelajaran.kelas.siswas', 'jadwalPelajaran.mataPelajaran', 'soals.pilihanJawabans']);

        $kunciJawaban = $ujian->soals->mapWithKeys(function ($soal) {
            return [$soal->id => $soal->pilihanJawabans->where('is_benar', true)->first()->id ?? null];
        });

        $siswasDiKelas = $ujian->jadwalPelajaran->kelas->siswas;
        $jumlahSoal = $ujian->soals->count();

        $hasilUjian = $siswasDiKelas->map(function ($siswa) use ($ujian, $kunciJawaban, $jumlahSoal) {
            $jawabanSiswa = JawabanSiswa::where('ujian_id', $ujian->id)
                ->where('siswa_id', $siswa->id)
                ->pluck('pilihan_jawaban_id', 'soal_id');

            $jumlahBenar = 0;
            foreach ($kunciJawaban as $soalId => $pilihanBenarId) {
                if (isset($jawabanSiswa[$soalId]) && $jawabanSiswa[$soalId] == $pilihanBenarId) {
                    $jumlahBenar++;
                }
            }

            $nilaiAkhir = ($jumlahSoal > 0) ? ($jumlahBenar / $jumlahSoal) * 100 : 0;

            return [
                'id' => $siswa->id,
                'nama_lengkap' => $siswa->nama_lengkap,
                'jumlah_benar' => $jumlahBenar,
                'nilai_akhir' => round($nilaiAkhir, 2),
            ];
        });

        return Inertia::render('Ujian/Hasil', [
            'ujian' => $ujian,
            'hasilUjian' => $hasilUjian,
            'jumlahSoal' => $jumlahSoal,
        ]);
    }
}
