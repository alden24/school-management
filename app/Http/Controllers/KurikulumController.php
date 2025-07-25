<?php

namespace App\Http\Controllers;

use App\Models\Kurikulum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KurikulumController extends Controller
{
    public function index()
    {
        return Inertia::render('Kurikulum/Index', [
            'kurikulums' => Kurikulum::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Kurikulum/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kurikulum' => 'required|string|max:255|unique:kurikulums,nama_kurikulum',
            'is_active' => 'boolean',
        ]);

        DB::transaction(function () use ($validated) {
            // Jika kurikulum baru ini aktif, nonaktifkan semua yang lain
            if ($validated['is_active']) {
                Kurikulum::where('is_active', true)->update(['is_active' => false]);
            }
            Kurikulum::create($validated);
        });

        return redirect()->route('kurikulum.index')->with('message', 'Kurikulum berhasil ditambahkan.');
    }

    public function edit(Kurikulum $kurikulum)
    {
        return Inertia::render('Kurikulum/Edit', [
            'kurikulum' => $kurikulum,
        ]);
    }

    public function update(Request $request, Kurikulum $kurikulum)
    {
        $validated = $request->validate([
            'nama_kurikulum' => 'required|string|max:255|unique:kurikulums,nama_kurikulum,' . $kurikulum->id,
            'is_active' => 'boolean',
        ]);

        DB::transaction(function () use ($validated, $kurikulum) {
            // Jika kurikulum ini akan diaktifkan, nonaktifkan semua yang lain
            if ($validated['is_active']) {
                Kurikulum::where('is_active', true)->where('id', '!=', $kurikulum->id)->update(['is_active' => false]);
            }
            $kurikulum->update($validated);
        });

        return redirect()->route('kurikulum.index')->with('message', 'Kurikulum berhasil diperbarui.');
    }

    public function destroy(Kurikulum $kurikulum)
    {
        // Tambahan: Cek jika kurikulum masih digunakan sebelum menghapus
        if ($kurikulum->mataPelajarans()->count() > 0) {
            return redirect()->back()->withErrors(['error' => 'Tidak dapat menghapus kurikulum karena masih digunakan oleh mata pelajaran.']);
        }
        
        $kurikulum->delete();

        return redirect()->route('kurikulum.index')->with('message', 'Kurikulum berhasil dihapus.');
    }
}
