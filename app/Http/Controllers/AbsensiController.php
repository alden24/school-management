<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\JadwalPelajaran;
use App\Models\Siswa;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

class AbsensiController extends Controller
{
    /**
     * Menampilkan halaman untuk mengambil absensi.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $today = Carbon::now()->locale('id')->dayName; // Mengambil nama hari ini dalam Bahasa Indonesia (Senin, Selasa, dst.)

        // Ambil jadwal mengajar guru yang login pada hari ini
        $jadwals = JadwalPelajaran::where('guru_id', $user->guru->id)
            ->where('hari', $today)
            ->with('kelas', 'mataPelajaran')
            ->orderBy('jam_mulai')
            ->get();

        $selectedJadwal = null;
        $students = [];

        // Jika ada jadwal yang dipilih dari form
        if ($request->has('jadwal_id')) {
            $selectedJadwal = JadwalPelajaran::with('kelas.siswas')->find($request->jadwal_id);
            if ($selectedJadwal) {
                $students = $selectedJadwal->kelas->siswas;
            }
        }

        return Inertia::render('Absensi/Index', [
            'jadwals' => $jadwals,
            'selectedJadwal' => $selectedJadwal,
            'students' => $students,
            'tanggal' => Carbon::now()->format('Y-m-d'),
        ]);
    }

    public function laporan(Request $request)
{
    $request->validate(['jadwal_id' => 'required|exists:jadwal_pelajarans,id']);

    $jadwal = JadwalPelajaran::with(['kelas.siswas', 'mataPelajaran'])->findOrFail($request->jadwal_id);
    
    // Ambil semua tanggal unik di mana absensi pernah diambil untuk jadwal ini
    $tanggalAbsensi = Absensi::where('jadwal_pelajaran_id', $jadwal->id)
        ->distinct()
        ->orderBy('tanggal', 'asc')
        ->pluck('tanggal');

    // Ambil semua data absensi untuk jadwal ini
    $absensiRecords = Absensi::where('jadwal_pelajaran_id', $jadwal->id)
        ->get()
        ->groupBy('siswa_id');

    // Siapkan data untuk ditampilkan di view
    $laporanData = $jadwal->kelas->siswas->map(function ($siswa) use ($absensiRecords, $tanggalAbsensi) {
        $kehadiranSiswa = [];
        foreach ($tanggalAbsensi as $tanggal) {
            $record = $absensiRecords->get($siswa->id, collect())->firstWhere('tanggal', $tanggal);
            $kehadiranSiswa[$tanggal] = $record ? $record->status : '-';
        }
        return [
            'id' => $siswa->id,
            'nama_lengkap' => $siswa->nama_lengkap,
            'kehadiran' => $kehadiranSiswa,
        ];
    });

    return Inertia::render('Absensi/Laporan', [
        'jadwal' => $jadwal,
        'tanggalAbsensi' => $tanggalAbsensi,
        'laporanData' => $laporanData,
    ]);
}
    /**
     * Menyimpan data absensi ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'jadwal_id' => 'required|exists:jadwal_pelajarans,id',
            'tanggal' => 'required|date',
            'absensi' => 'required|array',
            'absensi.*.siswa_id' => 'required|exists:siswas,id',
            'absensi.*.status' => 'required|in:Hadir,Izin,Sakit,Alfa',
        ]);

        foreach ($request->absensi as $data) {
            Absensi::updateOrCreate(
                [
                    'siswa_id' => $data['siswa_id'],
                    'jadwal_pelajaran_id' => $request->jadwal_id,
                    'tanggal' => $request->tanggal,
                ],
                [
                    'status' => $data['status'],
                    'keterangan' => $data['keterangan'] ?? null,
                ]
            );
        }

        return redirect()->route('absensi.index')->with('message', 'Absensi berhasil disimpan.');
    }
}
