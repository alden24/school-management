<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\Guru;
use App\Models\Kejuruan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index()
    {
        $kelas = Kelas::with(['waliKelas', 'kejuruan'])->latest()->get();
        return Inertia::render('Kelas/Index', [
            'kelas' => $kelas
        ]);
    }

    public function create()
    {
        return Inertia::render('Kelas/Create', [
            'gurus' => Guru::all(),
            'kejuruans' => Kejuruan::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string|max:255|unique:kelas,nama_kelas',
            'tingkat' => 'required|integer',
            'wali_kelas_id' => 'nullable|exists:gurus,id',
            'kejuruan_id' => 'required|exists:kejuruans,id',
        ]);

        Kelas::create($validated);

        return redirect()->route('kelas.index')->with('message', 'Data kelas berhasil ditambahkan.');
    }

    /**
     * Menampilkan form untuk mengedit data kelas.
     */
    public function edit(Kelas $kela)
    {
        return Inertia::render('Kelas/Edit', [
            'kelas' => $kela,
            'gurus' => Guru::all(),
            'kejuruans' => Kejuruan::all(),
        ]);
    }

    /**
     * Memperbarui data kelas di database.
     */
    public function update(Request $request, Kelas $kela)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string|max:255|unique:kelas,nama_kelas,' . $kela->id,
            'tingkat' => 'required|integer',
            'wali_kelas_id' => 'nullable|exists:gurus,id',
            'kejuruan_id' => 'required|exists:kejuruans,id',
        ]);

        $kela->update($validated);

        return redirect()->route('kelas.index')->with('message', 'Data kelas berhasil diperbarui.');
    }

    /**
     * Menghapus data kelas dari database.
     */
    public function destroy(Kelas $kela)
    {
        // Tambahan: Cek jika ada siswa di kelas ini sebelum menghapus
        if ($kela->siswas()->count() > 0) {
            return redirect()->back()->withErrors(['error' => 'Tidak dapat menghapus kelas karena masih ada siswa di dalamnya.']);
        }
        
        $kela->delete();

        return redirect()->route('kelas.index')->with('message', 'Data kelas berhasil dihapus.');
    }
}
