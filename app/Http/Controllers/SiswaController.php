<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\OrangTua;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class SiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $siswas = Siswa::with(['kelas', 'orangTua', 'user'])->latest()->get();
        return Inertia::render('Siswa/Index', [
            'siswas' => $siswas,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Siswa/Create', [
            'kelas' => Kelas::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Data Siswa
            'nama_lengkap' => 'required|string|max:255',
            'nisn' => 'required|string|max:10|unique:siswas,nisn',
            'nis' => 'nullable|string|max:10|unique:siswas,nis',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'alamat' => 'nullable|string',
            'asal_sekolah' => 'nullable|string|max:255',
            'class_id' => 'required|exists:kelas,id',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            
            // Data Akun
            'email' => 'required|string|email|max:255|unique:users',

            // Data Orang Tua
            'nama_ayah' => 'required|string|max:255',
            'pekerjaan_ayah' => 'nullable|string|max:100',
            'nama_ibu' => 'required|string|max:255',
            'pekerjaan_ibu' => 'nullable|string|max:100',
            'kontak_ortu' => 'nullable|string|max:20',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('fotos', 'public');
        }

        $plainPassword = '';

        try {
            DB::transaction(function () use ($validated, $fotoPath, &$plainPassword) {
                $plainPassword = $validated['tanggal_lahir'] 
                    ? Carbon::parse($validated['tanggal_lahir'])->format('dmY') 
                    : Str::random(8);

                $user = User::create([
                    'name' => $validated['nama_lengkap'],
                    'email' => $validated['email'],
                    'password' => Hash::make($plainPassword),
                    'role' => 'siswa',
                ]);

                $orangTua = OrangTua::create([
                    'nama_ayah' => $validated['nama_ayah'],
                    'pekerjaan_ayah' => $validated['pekerjaan_ayah'],
                    'nama_ibu' => $validated['nama_ibu'],
                    'pekerjaan_ibu' => $validated['pekerjaan_ibu'],
                    'kontak' => $validated['kontak_ortu'],
                ]);

                Siswa::create([
                    'nama_lengkap' => $validated['nama_lengkap'],
                    'nisn' => $validated['nisn'],
                    'nis' => $validated['nis'],
                    'tempat_lahir' => $validated['tempat_lahir'],
                    'tanggal_lahir' => $validated['tanggal_lahir'],
                    'jenis_kelamin' => $validated['jenis_kelamin'],
                    'alamat' => $validated['alamat'],
                    'asal_sekolah' => $validated['asal_sekolah'],
                    'class_id' => $validated['class_id'],
                    'user_id' => $user->id,
                    'parent_id' => $orangTua->id,
                    'foto' => $fotoPath,
                ]);
            });
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan data. ' . $e->getMessage()]);
        }

        return redirect()->route('siswa.index')->with([
            'message' => 'Data siswa berhasil dibuat.',
            'newUser' => [
                'name' => $validated['nama_lengkap'],
                'email' => $validated['email'],
                'password' => $plainPassword
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Siswa $siswa)
    {
        $siswa->load(['user', 'orangTua']);
        return Inertia::render('Siswa/Edit', [
            'siswa' => $siswa,
            'kelas' => Kelas::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Siswa $siswa)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nisn' => 'required|string|max:10|unique:siswas,nisn,' . $siswa->id,
            'nis' => 'nullable|string|max:10|unique:siswas,nis,' . $siswa->id,
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'alamat' => 'nullable|string',
            'asal_sekolah' => 'nullable|string|max:255',
            'class_id' => 'required|exists:kelas,id',
            'email' => 'required|string|email|max:255|unique:users,email,' . $siswa->user_id,
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'nama_ayah' => 'required|string|max:255',
            'pekerjaan_ayah' => 'nullable|string|max:100',
            'nama_ibu' => 'required|string|max:255',
            'pekerjaan_ibu' => 'nullable|string|max:100',
            'kontak_ortu' => 'nullable|string|max:20', // <-- Tambahkan validasi

        ]);

        $fotoPath = $siswa->foto;
        if ($request->hasFile('foto')) {
            if ($siswa->foto) {
                Storage::disk('public')->delete($siswa->foto);
            }
            $fotoPath = $request->file('foto')->store('fotos', 'public');
        }

        try {
            DB::transaction(function () use ($validated, $siswa, $fotoPath) {
                if ($siswa->user) {
                    $siswa->user->update([
                        'name' => $validated['nama_lengkap'],
                        'email' => $validated['email'],
                    ]);
                }

                if ($siswa->orangTua) {
                    $siswa->orangTua()->update([
                        'nama_ayah' => $validated['nama_ayah'],
                        'pekerjaan_ayah' => $validated['pekerjaan_ayah'],
                        'nama_ibu' => $validated['nama_ibu'],
                        'pekerjaan_ibu' => $validated['pekerjaan_ibu'],
                        'kontak' => $validated['kontak_ortu'],
                    ]);
                }

                $siswa->update([
                    'nama_lengkap' => $validated['nama_lengkap'],
                    'nisn' => $validated['nisn'],
                    'nis' => $validated['nis'],
                    'tempat_lahir' => $validated['tempat_lahir'],
                    'tanggal_lahir' => $validated['tanggal_lahir'],
                    'jenis_kelamin' => $validated['jenis_kelamin'],
                    'alamat' => $validated['alamat'],
                    'asal_sekolah' => $validated['asal_sekolah'],
                    'class_id' => $validated['class_id'],
                    'foto' => $fotoPath,
                ]);
            });
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal mengupdate data. ' . $e->getMessage()]);
        }

        return redirect()->route('siswa.index')->with('message', 'Data siswa berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Siswa $siswa)
    {
        $siswa->delete();
        return redirect()->route('siswa.index')->with('message', 'Data siswa berhasil dihapus.');
    }

    /**
     * Reset password for a student's user account.
     */
    public function resetPassword(Siswa $siswa)
    {
        if (!$siswa->user) {
            return redirect()->back()->withErrors(['error' => 'Siswa ini tidak memiliki akun login.']);
        }

        $newPassword = Str::random(8);

        $siswa->user->update([
            'password' => Hash::make($newPassword)
        ]);

        return redirect()->route('siswa.index')->with([
            'message' => 'Password berhasil direset.',
            'newPasswordInfo' => [
                'name' => $siswa->nama_lengkap,
                'password' => $newPassword
            ]
        ]);
    }

    public function cetakKartuPelajar(Siswa $siswa)
    {
        // Muat relasi yang dibutuhkan
        $siswa->load(['kelas.kejuruan']);

        // Buat PDF dari view
        $pdf = Pdf::loadView('kartu.pelajar', ['siswa' => $siswa]);

        // Tampilkan PDF di browser
        return $pdf->stream('kartu-pelajar-' . $siswa->nisn . '.pdf');
    }

}
