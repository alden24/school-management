<?php

namespace App\Http\Controllers;

use App\Models\Prakerin;
use App\Models\PresensiPrakerin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LaporanPrakerinController extends Controller
{
    /**
     * Menampilkan halaman laporan presensi untuk guru pembimbing.
     */
    public function index()
    {
        $guru = Auth::user()->guru;
        if (!$guru) {
            return redirect()->route('dashboard')->withErrors(['error' => 'Akun Anda tidak terhubung dengan data guru.']);
        }

        // Ambil semua data prakerin dari siswa bimbingan
        // dan muat relasi yang dibutuhkan, termasuk semua entri presensi
        $prakerins = Prakerin::where('guru_pembimbing_id', $guru->id)
            ->with(['siswa', 'dudi', 'presensiPrakerins']) // Muat semua presensi
            ->get();


        // Olah data untuk membuat rekapitulasi
        $laporanData = $prakerins->map(function ($prakerin) {
            // Hitung jumlah setiap status presensi untuk siswa ini
            $summary = PresensiPrakerin::where('prakerin_id', $prakerin->id)
                ->select('status', DB::raw('count(*) as total'))
                ->groupBy('status')
                ->get()
                ->pluck('total', 'status');

            return [
                'prakerin_id' => $prakerin->id,
                'siswa_nama' => $prakerin->siswa->nama_lengkap,
                'dudi_nama' => $prakerin->dudi->nama_perusahaan,
                'summary' => [
                    'Hadir' => $summary->get('Hadir', 0),
                    'Izin' => $summary->get('Izin', 0),
                    'Sakit' => $summary->get('Sakit', 0),
                ],
            ];
        });

        return Inertia::render('Laporan/PresensiPrakerin', [
            'prakerins' => $prakerins,
        ]);
    }
}
