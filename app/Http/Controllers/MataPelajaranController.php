<?php

namespace App\Http\Controllers;

use App\Models\MataPelajaran;
use App\Models\KategoriMataPelajaran;
use App\Models\Kurikulum; // 1. Import Kurikulum
use Illuminate\Http\Request;
use Inertia\Inertia;

class MataPelajaranController extends Controller
{
    public function index()
    {
        // 2. Muat relasi kurikulum dan kategori
        return Inertia::render('MataPelajaran/Index', [
            'matapelajarans' => MataPelajaran::with(['kategori', 'kurikulum'])->latest()->get(),
        ]);
    }

    public function create()
    {
        // 3. Kirim data kurikulum dan kategori ke form
        return Inertia::render('MataPelajaran/Create', [
            'kategoris' => KategoriMataPelajaran::all(),
            'kurikulums' => Kurikulum::all(),
        ]);
    }

    public function store(Request $request)
    {
        // 4. Tambahkan validasi untuk kurikulum_id
        $validated = $request->validate([
            'nama_mapel' => 'required|string|max:255|unique:mata_pelajarans,nama_mapel',
            'deskripsi' => 'nullable|string',
            'kategori_id' => 'required|exists:kategori_mata_pelajarans,id',
            'kurikulum_id' => 'required|exists:kurikulums,id',
        ]);

        MataPelajaran::create($validated);

        return redirect()->route('matapelajaran.index')->with('message', 'Mata Pelajaran berhasil ditambahkan.');
    }

    public function edit(MataPelajaran $matapelajaran)
    {
        // 5. Kirim data kurikulum dan kategori ke form edit
        return Inertia::render('MataPelajaran/Edit', [
            'matapelajaran' => $matapelajaran,
            'kategoris' => KategoriMataPelajaran::all(),
            'kurikulums' => Kurikulum::all(),
        ]);
    }

    public function update(Request $request, MataPelajaran $matapelajaran)
    {
        $validated = $request->validate([
            'nama_mapel' => 'required|string|max:255|unique:mata_pelajarans,nama_mapel,' . $matapelajaran->id,
            'deskripsi' => 'nullable|string',
            'kategori_id' => 'required|exists:kategori_mata_pelajarans,id',
            'kurikulum_id' => 'required|exists:kurikulums,id',
        ]);

        $matapelajaran->update($validated);

        return redirect()->route('matapelajaran.index')->with('message', 'Mata Pelajaran berhasil diperbarui.');
    }

    public function destroy(MataPelajaran $matapelajaran)
    {
        $matapelajaran->delete();
        return redirect()->route('matapelajaran.index')->with('message', 'Mata Pelajaran berhasil dihapus.');
    }
}
