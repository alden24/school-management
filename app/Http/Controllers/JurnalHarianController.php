<?php

namespace App\Http\Controllers;

use App\Models\JurnalHarian;
use App\Models\Prakerin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class JurnalHarianController extends Controller
{
    public function index()
    {
        $siswa = Auth::user()->siswa;
        if (!$siswa) {
            return redirect()->route('dashboard')->withErrors(['error' => 'Akun Anda tidak terhubung dengan data siswa.']);
        }

        // PERBAIKAN: Cari data prakerin dengan status 'Berlangsung'
        $prakerin = Prakerin::where('siswa_id', $siswa->id)
            ->where('status', 'Berlangsung')
            ->first();

        $jurnals = [];
        if ($prakerin) {
            $jurnals = JurnalHarian::where('prakerin_id', $prakerin->id)
                ->orderBy('tanggal', 'desc')
                ->get();
        }

        return Inertia::render('JurnalHarian/Index', [
            'prakerin' => $prakerin,
            'jurnals' => $jurnals,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'prakerin_id' => 'required|exists:prakerins,id',
            'tanggal' => 'required|date',
            'kegiatan' => 'required|string',
        ]);

        $prakerin = Prakerin::findOrFail($validated['prakerin_id']);
        if ($prakerin->siswa_id !== Auth::user()->siswa->id) {
            return redirect()->back()->withErrors(['error' => 'Akses tidak diizinkan.']);
        }

        // Tambahan: Pastikan jurnal hanya bisa diisi saat status 'Berlangsung'
        if ($prakerin->status !== 'Berlangsung') {
            return redirect()->back()->withErrors(['error' => 'Periode Prakerin belum berlangsung.']);
        }

        JurnalHarian::create($validated);

        return redirect()->route('jurnal-harian.index')->with('message', 'Jurnal harian berhasil disimpan.');
    }
}
