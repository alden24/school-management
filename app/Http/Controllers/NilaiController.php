<?php

namespace App\Http\Controllers;

use App\Models\Nilai;
use App\Models\JadwalPelajaran;
use App\Models\Semester;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NilaiController extends Controller
{
    /**
     * Menampilkan halaman untuk input nilai.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $guru = $user->guru; // Asumsi user yang login adalah guru

        // Ambil semester yang sedang aktif
        $activeSemester = Semester::where('is_active', true)->first();
        if (!$activeSemester) {
            // Handle jika tidak ada semester aktif
            return redirect()->back()->withErrors(['error' => 'Tidak ada semester yang aktif. Silakan atur terlebih dahulu.']);
        }

        // Ambil semua jadwal mengajar guru yang login pada semester aktif
        $jadwals = JadwalPelajaran::where('guru_id', $guru->id)
            ->where('semester_id', $activeSemester->id)
            ->with(['kelas', 'mataPelajaran'])
            ->get();

        $selectedJadwal = null;
        $students = [];
        $existingNilai = [];

        // Jika ada jadwal yang dipilih dari form
        if ($request->filled('jadwal_id')) {
            $selectedJadwal = JadwalPelajaran::with('kelas.siswas')->find($request->jadwal_id);
            if ($selectedJadwal) {
                $students = $selectedJadwal->kelas->siswas;

                // Ambil nilai yang sudah ada untuk siswa di kelas ini
                $existingNilai = Nilai::where('jadwal_pelajaran_id', $selectedJadwal->id)
                    ->where('semester_id', $activeSemester->id)
                    ->whereIn('siswa_id', $students->pluck('id'))
                    ->get()
                    ->keyBy('siswa_id'); // Jadikan siswa_id sebagai key untuk mudah diakses
            }
        }

        return Inertia::render('Nilai/Index', [
            'jadwals' => $jadwals,
            'selectedJadwal' => $selectedJadwal,
            'students' => $students,
            'existingNilai' => $existingNilai,
            'activeSemester' => $activeSemester,
        ]);
    }

    /**
     * Menyimpan data nilai ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'jadwal_id' => 'required|exists:jadwal_pelajarans,id',
            'semester_id' => 'required|exists:semesters,id',
            'nilai' => 'required|array',
            'nilai.*.siswa_id' => 'required|exists:siswas,id',
            'nilai.*.nilai_tugas' => 'nullable|numeric|min:0|max:100',
            'nilai.*.nilai_uts' => 'nullable|numeric|min:0|max:100',
            'nilai.*.nilai_uas' => 'nullable|numeric|min:0|max:100',
        ]);

        foreach ($request->nilai as $data) {
            Nilai::updateOrCreate(
                [
                    'siswa_id' => $data['siswa_id'],
                    'jadwal_pelajaran_id' => $request->jadwal_id,
                    'semester_id' => $request->semester_id,
                ],
                [
                    'nilai_tugas' => $data['nilai_tugas'] ?? null,
                    'nilai_uts' => $data['nilai_uts'] ?? null,
                    'nilai_uas' => $data['nilai_uas'] ?? null,
                    // Anda bisa menambahkan logika untuk menghitung nilai akhir di sini
                ]
            );
        }

        return redirect()->route('nilai.index', ['jadwal_id' => $request->jadwal_id])->with('message', 'Nilai berhasil disimpan.');
    }
}
