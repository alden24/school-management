<?php

namespace App\Http\Controllers;

use App\Models\PembimbingDudi;
use App\Models\Dudi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PembimbingDudiController extends Controller
{
    public function index()
    {
        return Inertia::render('PembimbingDudi/Index', [
            'pembimbings' => PembimbingDudi::with('dudi')->latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('PembimbingDudi/Create', [
            'dudis' => Dudi::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'dudi_id' => 'required|exists:dudis,id',
            'nama_pembimbing' => 'required|string|max:255',
            'jabatan' => 'nullable|string|max:100',
            'kontak' => 'nullable|string|max:20',
        ]);

        PembimbingDudi::create($validated);

        return redirect()->route('pembimbing-dudi.index')->with('message', 'Data Pembimbing DUDI berhasil ditambahkan.');
    }

    public function edit(PembimbingDudi $pembimbing_dudi)
    {
        return Inertia::render('PembimbingDudi/Edit', [
            'pembimbing' => $pembimbing_dudi,
            'dudis' => Dudi::all(),
        ]);
    }

    public function update(Request $request, PembimbingDudi $pembimbing_dudi)
    {
        $validated = $request->validate([
            'dudi_id' => 'required|exists:dudis,id',
            'nama_pembimbing' => 'required|string|max:255',
            'jabatan' => 'nullable|string|max:100',
            'kontak' => 'nullable|string|max:20',
        ]);

        $pembimbing_dudi->update($validated);

        return redirect()->route('pembimbing-dudi.index')->with('message', 'Data Pembimbing DUDI berhasil diperbarui.');
    }

    public function destroy(PembimbingDudi $pembimbing_dudi)
    {
        $pembimbing_dudi->delete();
        return redirect()->route('pembimbing-dudi.index')->with('message', 'Data Pembimbing DUDI berhasil dihapus.');
    }
}
