<?php

namespace App\Http\Controllers;

use App\Models\JadwalPelajaran;
use App\Models\Semester;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Guru;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JadwalPelajaranController extends Controller
{
    public function index()
    {
        $jadwals = JadwalPelajaran::with(['semester', 'kelas', 'mataPelajaran', 'guru'])
            ->latest()
            ->get();

        return Inertia::render('JadwalPelajaran/Index', [
            'jadwals' => $jadwals,
        ]);
    }

    public function create()
    {
        return Inertia::render('JadwalPelajaran/Create', [
            'semesters' => Semester::where('is_active', true)->get(),
            'kelases' => Kelas::all(),
            'mataPelajarans' => MataPelajaran::all(),
            'gurus' => Guru::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'semester_id' => 'required|exists:semesters,id',
            'kelas_id' => 'required|exists:kelas,id',
            'mata_pelajaran_id' => 'required|exists:mata_pelajarans,id',
            'guru_id' => 'required|exists:gurus,id',
            'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
        ]);

        // Validasi konflik jadwal
        $konflik = JadwalPelajaran::where('semester_id', $validated['semester_id'])
            ->where('hari', $validated['hari'])
            ->where(function($query) use ($validated) {
                $query->where('jam_mulai', '<', $validated['jam_selesai'])
                      ->where('jam_selesai', '>', $validated['jam_mulai']);
            })
            ->where(function($query) use ($validated) {
                $query->where('guru_id', $validated['guru_id'])
                      ->orWhere('kelas_id', $validated['kelas_id']);
            })
            ->exists();

        if ($konflik) {
            return redirect()->back()->withErrors(['error' => 'Jadwal konflik! Guru atau kelas sudah memiliki jadwal di jam yang sama.']);
        }

        JadwalPelajaran::create($validated);

        return redirect()->route('jadwal-pelajaran.index')->with('message', 'Jadwal pelajaran berhasil ditambahkan.');
    }

    public function edit(JadwalPelajaran $jadwal_pelajaran)
    {
        return Inertia::render('JadwalPelajaran/Edit', [
            'jadwal' => $jadwal_pelajaran,
            'semesters' => Semester::all(),
            'kelases' => Kelas::all(),
            'mataPelajarans' => MataPelajaran::all(),
            'gurus' => Guru::all(),
        ]);
    }

    /**
     * Memperbarui jadwal di database.
     */
    public function update(Request $request, JadwalPelajaran $jadwal_pelajaran)
    {
        $validated = $request->validate([
            'semester_id' => 'required|exists:semesters,id',
            'kelas_id' => 'required|exists:kelas,id',
            'mata_pelajaran_id' => 'required|exists:mata_pelajarans,id',
            'guru_id' => 'required|exists:gurus,id',
            'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
        ]);

        // Validasi konflik, kecuali untuk jadwal yang sedang diedit
        $konflik = JadwalPelajaran::where('id', '!=', $jadwal_pelajaran->id)
            ->where('semester_id', $validated['semester_id'])
            ->where('hari', $validated['hari'])
            ->where(function($query) use ($validated) {
                $query->where('jam_mulai', '<', $validated['jam_selesai'])
                      ->where('jam_selesai', '>', $validated['jam_mulai']);
            })
            ->where(function($query) use ($validated) {
                $query->where('guru_id', $validated['guru_id'])
                      ->orWhere('kelas_id', $validated['kelas_id']);
            })
            ->exists();

        if ($konflik) {
            return redirect()->back()->withErrors(['error' => 'Jadwal konflik! Guru atau kelas sudah memiliki jadwal di jam yang sama.']);
        }

        $jadwal_pelajaran->update($validated);

        return redirect()->route('jadwal-pelajaran.index')->with('message', 'Jadwal pelajaran berhasil diperbarui.');
    }

    public function destroy(JadwalPelajaran $jadwal_pelajaran)
    {
        $jadwal_pelajaran->delete();
        return redirect()->route('jadwal-pelajaran.index')->with('message', 'Jadwal pelajaran berhasil dihapus.');
    }
}
