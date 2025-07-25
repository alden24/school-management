<?php

namespace App\Http\Controllers;

use App\Models\JurnalHarian;
use App\Models\Prakerin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ValidasiJurnalController extends Controller
{
    /**
     * Menampilkan halaman validasi jurnal untuk guru pembimbing.
     */
    public function index()
    {
        $guru = Auth::user()->guru;
        if (!$guru) {
            return redirect()->route('dashboard')->withErrors(['error' => 'Akun Anda tidak terhubung dengan data guru.']);
        }

        // Ambil ID semua siswa yang dibimbing oleh guru ini
        $prakerinIds = Prakerin::where('guru_pembimbing_id', $guru->id)->pluck('id');

        // Ambil semua jurnal dari siswa bimbingan, kelompokkan berdasarkan siswa
        $jurnals = JurnalHarian::whereIn('prakerin_id', $prakerinIds)
            ->with('prakerin.siswa') // Muat relasi untuk mendapatkan nama siswa
            ->orderBy('tanggal', 'desc')
            ->get()
            ->groupBy('prakerin.siswa.nama_lengkap'); // Kelompokkan berdasarkan nama siswa

        return Inertia::render('ValidasiJurnal/Index', [
            'jurnalsBySiswa' => $jurnals,
        ]);
    }

    /**
     * Memperbarui status validasi jurnal.
     */
    public function update(Request $request, JurnalHarian $jurnal)
    {
        // Otorisasi: Pastikan guru yang login adalah pembimbing dari jurnal ini
        $this->authorize('update', $jurnal);

        $request->validate([
            'status_validasi' => 'required|in:Disetujui,Revisi',
            'catatan_pembimbing' => 'nullable|string|required_if:status_validasi,Revisi',
        ]);

        $jurnal->update([
            'status_validasi' => $request->status_validasi,
            'catatan_pembimbing' => $request->status_validasi === 'Revisi' ? $request->catatan_pembimbing : null,
        ]);

        return redirect()->back()->with('message', 'Jurnal berhasil divalidasi.');
    }
}
