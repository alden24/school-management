<?php

namespace App\Http\Controllers;

use App\Models\Kejuruan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KejuruanController extends Controller
{
    public function index()
    {
        return Inertia::render('Kejuruan/Index', [
            'kejuruans' => Kejuruan::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Kejuruan/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kejuruan' => 'required|string|max:255|unique:kejuruans,nama_kejuruan',
            'singkatan' => 'nullable|string|max:50',
            'deskripsi' => 'nullable|string',
        ]);

        Kejuruan::create($validated);

        return redirect()->route('kejuruan.index')->with('message', 'Kejuruan berhasil ditambahkan.');
    }

    public function edit(Kejuruan $kejuruan)
    {
        return Inertia::render('Kejuruan/Edit', [
            'kejuruan' => $kejuruan,
        ]);
    }

    public function update(Request $request, Kejuruan $kejuruan)
    {
        $validated = $request->validate([
            'nama_kejuruan' => 'required|string|max:255|unique:kejuruans,nama_kejuruan,' . $kejuruan->id,
            'singkatan' => 'nullable|string|max:50',
            'deskripsi' => 'nullable|string',
        ]);

        $kejuruan->update($validated);

        return redirect()->route('kejuruan.index')->with('message', 'Kejuruan berhasil diperbarui.');
    }

    public function destroy(Kejuruan $kejuruan)
    {
        if ($kejuruan->kelases()->count() > 0) {
            return redirect()->back()->withErrors(['error' => 'Tidak dapat menghapus kejuruan karena masih digunakan oleh kelas.']);
        }
        
        $kejuruan->delete();

        return redirect()->route('kejuruan.index')->with('message', 'Kejuruan berhasil dihapus.');
    }
}
