<?php

namespace App\Http\Controllers;

use App\Models\Dudi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DudiController extends Controller
{
    public function index()
    {
        return Inertia::render('Dudi/Index', [
            'dudis' => Dudi::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Dudi/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_perusahaan' => 'required|string|max:255|unique:dudis,nama_perusahaan',
            'alamat' => 'required|string',
            'telepon' => 'nullable|string|max:20',
            'email_perusahaan' => 'nullable|email|max:255|unique:dudis,email_perusahaan',
            'nama_kontak_personalia' => 'nullable|string|max:255',
        ]);

        Dudi::create($validated);

        return redirect()->route('dudi.index')->with('message', 'Data DUDI berhasil ditambahkan.');
    }

    public function edit(Dudi $dudi)
    {
        return Inertia::render('Dudi/Edit', [
            'dudi' => $dudi,
        ]);
    }

    public function update(Request $request, Dudi $dudi)
    {
        $validated = $request->validate([
            'nama_perusahaan' => 'required|string|max:255|unique:dudis,nama_perusahaan,' . $dudi->id,
            'alamat' => 'required|string',
            'telepon' => 'nullable|string|max:20',
            'email_perusahaan' => 'nullable|email|max:255|unique:dudis,email_perusahaan,' . $dudi->id,
            'nama_kontak_personalia' => 'nullable|string|max:255',
        ]);

        $dudi->update($validated);

        return redirect()->route('dudi.index')->with('message', 'Data DUDI berhasil diperbarui.');
    }

    public function destroy(Dudi $dudi)
    {
        // Anda bisa menambahkan validasi di sini, misalnya,
        // cek apakah DUDI masih memiliki siswa yang sedang prakerin.
        
        $dudi->delete();

        return redirect()->route('dudi.index')->with('message', 'Data DUDI berhasil dihapus.');
    }
}
