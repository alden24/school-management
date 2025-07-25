<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\User;
use App\Models\JadwalPelajaran;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class GuruController extends Controller
{
    public function index()
    {
        return Inertia::render('Guru/Index', [
            'gurus' => Guru::with('user')->latest()->get(),
        ]);
    }
    
    public function jadwalSaya()
{
    $user = Auth::user();
    // Pastikan user memiliki relasi guru
    if (!$user->guru) {
        return redirect()->route('dashboard')->withErrors(['error' => 'Akun Anda tidak terhubung dengan data guru.']);
    }

    $semesterAktif = Semester::where('is_active', true)->first();
    $jadwalPerHari = [];

    if ($semesterAktif) {
        $jadwals = JadwalPelajaran::where('guru_id', $user->guru->id)
            ->where('semester_id', $semesterAktif->id)
            ->with(['kelas', 'mataPelajaran'])
            ->orderBy('jam_mulai')
            ->get()
            ->groupBy('hari');

        // Urutkan hari
        $urutanHari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        foreach ($urutanHari as $hari) {
            if (isset($jadwals[$hari])) {
                $jadwalPerHari[$hari] = $jadwals[$hari];
            }
        }
    }

    return Inertia::render('Guru/JadwalSaya', [
        'jadwalPerHari' => $jadwalPerHari,
    ]);
}
    

    public function resetPassword(Guru $guru)
    {
        if (!$guru->user) {
            return redirect()->back()->withErrors(['error' => 'Guru ini tidak memiliki akun login.']);
        }

        $newPassword = Str::random(8);

        $guru->user->update([
            'password' => Hash::make($newPassword)
        ]);

        return redirect()->route('guru.index')->with([
            'message' => 'Password berhasil direset.',
            'newPasswordInfo' => [
                'name' => $guru->nama_lengkap,
                'password' => $newPassword
            ]
        ]);
    }
    public function create()
    {
        return Inertia::render('Guru/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'nuptk' => 'nullable|string|max:16|unique:gurus,nuptk',
            'nip' => 'nullable|string|max:18|unique:gurus,nip',
            'nik' => 'nullable|string|max:16|unique:gurus,nik',
            'npwp' => 'nullable|string|max:16|unique:gurus,npwp',
            'nama_ibu_kandung' => 'nullable|string|max:255',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|in:Laki-laki,Perempuan',
            'status' => 'required|in:Guru,Tendik',
            'status_perkawinan' => 'nullable|in:Belum Kawin,Kawin,Cerai Hidup,Cerai Mati',
            'agama' => 'nullable|string|max:50',
            'alamat' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'spesialisasi_mapel' => 'nullable|string|max:100',
            'kontak' => 'nullable|string|max:20',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('fotos/guru', 'public');
        }

        $plainPassword = Str::random(8);

        try {
            DB::transaction(function () use ($validated, $fotoPath, $plainPassword) {
                $user = User::create([
                    'name' => $validated['nama_lengkap'],
                    'email' => $validated['email'],
                    'password' => Hash::make($plainPassword),
                    'role' => 'guru',
                ]);

                Guru::create(array_merge($validated, [
                    'foto' => $fotoPath,
                    'user_id' => $user->id,
                ]));
            });
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan data. ' . $e->getMessage()]);
        }

        return redirect()->route('guru.index')->with([
            'message' => 'Data guru berhasil dibuat.',
            'newUser' => [
                'name' => $validated['nama_lengkap'],
                'email' => $validated['email'],
                'password' => $plainPassword
            ]
        ]);
    }

    public function edit(Guru $guru)
    {
        $guru->load('user');
        return Inertia::render('Guru/Edit', [
            'guru' => $guru,
        ]);
    }

    public function update(Request $request, Guru $guru)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $guru->user_id,
            'nuptk' => 'nullable|string|max:16|unique:gurus,nuptk,' . $guru->id,
            'nip' => 'nullable|string|max:18|unique:gurus,nip,' . $guru->id,
            'nik' => 'nullable|string|max:16|unique:gurus,nik,' . $guru->id,
            'npwp' => 'nullable|string|max:16|unique:gurus,npwp,' . $guru->id,
            'nama_ibu_kandung' => 'nullable|string|max:255',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|in:Laki-laki,Perempuan',
            'status' => 'required|in:Guru,Tendik', 
            'status_perkawinan' => 'nullable|in:Belum Kawin,Kawin,Cerai Hidup,Cerai Mati',
            'agama' => 'nullable|string|max:50',
            'alamat' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'spesialisasi_mapel' => 'nullable|string|max:100',
            'kontak' => 'nullable|string|max:20',
        ]);

        $fotoPath = $guru->foto;
        if ($request->hasFile('foto')) {
            if ($guru->foto) {
                Storage::disk('public')->delete($guru->foto);
            }
            $fotoPath = $request->file('foto')->store('fotos/guru', 'public');
        }

        try {
            DB::transaction(function () use ($validated, $guru, $fotoPath) {
                if ($guru->user) {
                    $guru->user->update([
                        'name' => $validated['nama_lengkap'],
                        'email' => $validated['email'],
                    ]);
                }

                $guru->update(array_merge($validated, ['foto' => $fotoPath]));
            });
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal mengupdate data. ' . $e->getMessage()]);
        }

        return redirect()->route('guru.index')->with('message', 'Data guru berhasil diperbarui.');
    }

    public function destroy(Guru $guru)
    {
        try {
            DB::transaction(function () use ($guru) {
                if ($guru->user) {
                    $guru->user->delete();
                }
                $guru->delete();
            });
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus data. ' . $e->getMessage()]);
        }
        
        return redirect()->route('guru.index')->with('message', 'Data guru berhasil dihapus.');
    }
}
