<?php

namespace App\Http\Controllers;

use App\Models\PenilaianPrakerin;
use App\Models\Prakerin;
use Illuminate\Http\Request;
// Hapus use Auth karena tidak lagi bergantung pada user yang login
use Inertia\Inertia;

class PenilaianPrakerinController extends Controller
{
    public function index()
    {
        // PERBAIKAN: Ambil semua data Prakerin yang statusnya "Selesai"
        // tanpa memfilter berdasarkan guru yang login.
        $prakerins = Prakerin::where('status', 'Selesai')
            ->with(['siswa.kelas', 'dudi', 'guru', 'penilaian']) // Muat semua relasi
            ->get();

        return Inertia::render('PenilaianPrakerin/Index', [
            'prakerins' => $prakerins,
        ]);
    }

    public function store(Request $request)
    {
        // Otorisasi bisa ditambahkan di sini untuk memastikan hanya admin yang bisa menyimpan
        // $this->authorize('create', PenilaianPrakerin::class);

        $validated = $request->validate([
            'prakerin_id' => 'required|exists:prakerins,id',
            'nilai_pembimbing_dudi' => 'required|numeric|min:0|max:100',
            'nilai_laporan' => 'required|numeric|min:0|max:100',
            'nilai_presentasi' => 'required|numeric|min:0|max:100',
            'catatan_akhir' => 'nullable|string',
        ]);

        // Hitung nilai akhir
        $nilai_akhir = ($validated['nilai_pembimbing_dudi'] + $validated['nilai_laporan'] + $validated['nilai_presentasi']) / 3;

        PenilaianPrakerin::updateOrCreate(
            ['prakerin_id' => $validated['prakerin_id']],
            [
                'nilai_pembimbing_dudi' => $validated['nilai_pembimbing_dudi'],
                'nilai_laporan' => $validated['nilai_laporan'],
                'nilai_presentasi' => $validated['nilai_presentasi'],
                'nilai_akhir' => round($nilai_akhir, 2),
                'catatan_akhir' => $validated['catatan_akhir'],
            ]
        );

        return redirect()->back()->with('message', 'Nilai Prakerin berhasil disimpan.');
    }
}
