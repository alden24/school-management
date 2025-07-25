<?php

namespace App\Http\Controllers;

use App\Models\KategoriMataPelajaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KategoriMataPelajaranController extends Controller
{
    public function index()
    {
        return Inertia::render('KategoriMataPelajaran/Index', [
            'kategoris' => KategoriMataPelajaran::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('KategoriMataPelajaran/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:kategori_mata_pelajarans,nama_kategori',
        ]);

        KategoriMataPelajaran::create($validated);

        return redirect()->route('kategori-matapelajaran.index')->with('message', 'Kategori berhasil ditambahkan.');
    }

    public function edit(KategoriMataPelajaran $kategori_matapelajaran)
    {
        return Inertia::render('KategoriMataPelajaran/Edit', [
            'kategori' => $kategori_matapelajaran,
        ]);
    }

    public function update(Request $request, KategoriMataPelajaran $kategori_matapelajaran)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:kategori_mata_pelajarans,nama_kategori,' . $kategori_matapelajaran->id,
        ]);

        $kategori_matapelajaran->update($validated);

        return redirect()->route('kategori-matapelajaran.index')->with('message', 'Kategori berhasil diperbarui.');
    }

    public function destroy(KategoriMataPelajaran $kategori_matapelajaran)
    {
        $kategori_matapelajaran->delete();

        return redirect()->route('kategori-matapelajaran.index')->with('message', 'Kategori berhasil dihapus.');
    }
}
