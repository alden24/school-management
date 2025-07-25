<?php

namespace App\Http\Controllers;

use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SemesterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Semester/Index', [
            'semesters' => Semester::latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Semester/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:semesters,nama',
            'tahun_ajaran' => 'required|string|max:9',
            'semester' => 'required|in:Ganjil,Genap',
            'is_active' => 'boolean',
        ]);

        DB::transaction(function () use ($validated) {
            // Jika semester baru ini aktif, nonaktifkan semua yang lain
            if ($validated['is_active']) {
                Semester::where('is_active', true)->update(['is_active' => false]);
            }

            Semester::create($validated);
        });

        return redirect()->route('semester.index')->with('message', 'Semester berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Semester $semester)
    {
        return Inertia::render('Semester/Edit', [
            'semester' => $semester,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Semester $semester)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:semesters,nama,' . $semester->id,
            'tahun_ajaran' => 'required|string|max:9',
            'semester' => 'required|in:Ganjil,Genap',
            'is_active' => 'boolean',
        ]);

        DB::transaction(function () use ($validated, $semester) {
            // Jika semester ini akan diaktifkan, nonaktifkan semua yang lain
            if ($validated['is_active']) {
                Semester::where('is_active', true)->where('id', '!=', $semester->id)->update(['is_active' => false]);
            }

            $semester->update($validated);
        });

        return redirect()->route('semester.index')->with('message', 'Semester berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Semester $semester)
    {
        // Logika tambahan: mungkin Anda tidak ingin menghapus semester aktif
        if ($semester->is_active) {
            return redirect()->back()->withErrors(['error' => 'Tidak dapat menghapus semester yang sedang aktif.']);
        }

        $semester->delete();

        return redirect()->route('semester.index')->with('message', 'Semester berhasil dihapus.');
    }
}
