<?php

namespace App\Http\Controllers;

use App\Models\JadwalPelajaran;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JadwalSiswaController extends Controller
{
    /**
     * Menampilkan jadwal pelajaran untuk siswa yang sedang login.
     */
    public function index()
    {
        $user = Auth::user();
        $siswa = $user->siswa; // Mengambil data siswa yang terhubung dengan user

        $jadwalPerHari = [];

        // Pastikan user ini adalah seorang siswa dan memiliki kelas
        if ($siswa && $siswa->class_id) {
            // Ambil semester yang sedang aktif
            $semesterAktif = Semester::where('is_active', true)->first();

            if ($semesterAktif) {
                // Ambil semua jadwal untuk kelas siswa tersebut di semester aktif
                $jadwals = JadwalPelajaran::where('kelas_id', $siswa->class_id)
                    ->where('semester_id', $semesterAktif->id)
                    ->with(['mataPelajaran', 'guru']) // Ambil juga data relasinya
                    ->orderBy('jam_mulai')
                    ->get()
                    ->groupBy('hari'); // Kelompokkan berdasarkan hari

                // Urutkan hari agar sesuai (Senin, Selasa, dst.)
                $urutanHari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                foreach ($urutanHari as $hari) {
                    if (isset($jadwals[$hari])) {
                        $jadwalPerHari[$hari] = $jadwals[$hari];
                    }
                }
            }
        }

        return Inertia::render('JadwalSiswa/Index', [
            'jadwalPerHari' => $jadwalPerHari,
        ]);
    }
}
