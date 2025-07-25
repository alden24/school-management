<?php
namespace App\Http\Controllers;

use App\Models\Ujian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\JawabanSiswa;
use Carbon\Carbon;


class UjianSiswaController extends Controller
{
    public function index()
    {
        $siswa = Auth::user()->siswa;
        if (!$siswa) {
            return redirect()->route('dashboard')->withErrors(['error' => 'Akun Anda tidak terhubung dengan data siswa.']);
        }

        $jadwalIds = $siswa->kelas->jadwalPelajarans()->pluck('id');

        $ujians = Ujian::whereIn('jadwal_pelajaran_id', $jadwalIds)
            ->with('jadwalPelajaran.mataPelajaran', 'jadwalPelajaran.guru')
            ->get();

        // 1. Ambil ID semua ujian yang sudah dikerjakan oleh siswa
        $completedUjianIds = JawabanSiswa::where('siswa_id', $siswa->id)
            ->distinct()
            ->pluck('ujian_id')
            ->toArray();

        // 2. Tambahkan status 'is_completed' ke setiap objek ujian
        $ujians->each(function ($ujian) use ($completedUjianIds) {
            $ujian->is_completed = in_array($ujian->id, $completedUjianIds);
        });

        return Inertia::render('UjianSiswa/Index', [
            'ujians' => $ujians,
        ]);
    }

    public function show(Ujian $ujian)
    {
        $siswa = Auth::user()->siswa;

        // 3. Tambahkan validasi di sini untuk mencegah akses langsung
        $isCompleted = JawabanSiswa::where('ujian_id', $ujian->id)
            ->where('siswa_id', $siswa->id)
            ->exists();

        if ($isCompleted) {
            return redirect()->route('ujian.siswa.index')->withErrors(['error' => 'Anda sudah mengerjakan ujian ini.']);
        }

        // Validasi waktu
        if (now()->isBefore($ujian->waktu_mulai)) {
            return redirect()->route('ujian.siswa.index')->withErrors(['error' => 'Ujian ini belum dimulai.']);
        }
        if (now()->isAfter($ujian->waktu_selesai)) {
            return redirect()->route('ujian.siswa.index')->withErrors(['error' => 'Waktu untuk ujian ini sudah berakhir.']);
        }

        $ujian->load(['soals.pilihanJawabans' => function ($query) {
            $query->select('id', 'soal_id', 'pilihan');
        }]);

        return Inertia::render('UjianSiswa/Show', [
            'ujian' => $ujian,
        ]);
    }

    public function submit(Request $request, Ujian $ujian)
    {
        // PERBAIKAN: Logika validasi waktu yang lebih andal
        if (now()->isAfter($ujian->waktu_selesai)) {
            return redirect()->route('dashboard')->withErrors(['error' => 'Waktu pengerjaan telah habis. Jawaban Anda tidak dapat dikirim.']);
        }

        $request->validate([
            'answers' => 'required|array',
            'answers.*.soal_id' => 'required|exists:soals,id',
            'answers.*.jawaban' => 'required',
        ]);

        $siswa = Auth::user()->siswa;

        foreach ($request->answers as $answer) {
            JawabanSiswa::updateOrCreate(
                [
                    'ujian_id' => $ujian->id,
                    'soal_id' => $answer['soal_id'],
                    'siswa_id' => $siswa->id,
                ],
                [
                    'pilihan_jawaban_id' => $answer['jawaban'],
                    'jawaban_esai' => null,
                ]
            );
        }

        return redirect()->route('dashboard')->with('message', 'Selamat! Jawaban Anda telah berhasil dikirim.');
    }
}
