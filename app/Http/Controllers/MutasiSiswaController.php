<?php

namespace App\Http\Controllers;

use App\Models\MutasiSiswa;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MutasiSiswaController extends Controller
{
    /**
     * Menampilkan halaman untuk proses mutasi siswa.
     */
    public function index()
    {
        return Inertia::render('MutasiSiswa/Index', [
            // Ambil hanya siswa yang masih aktif
            'siswas' => Siswa::where('status', 'Aktif')->orderBy('nama_lengkap')->get(),
            // Ambil riwayat mutasi untuk ditampilkan di tabel
            'mutasiHistory' => MutasiSiswa::with('siswa.kelas')->latest()->get(),
        ]);
    }

    /**
     * Menyimpan proses mutasi siswa.
     */
    public function store(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'jenis_mutasi' => 'required|in:Keluar,Lulus,Pindah',
            'tanggal_mutasi' => 'required|date',
            'keterangan' => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($request) {
                // 1. Cari siswa yang akan dimutasi
                $siswa = Siswa::findOrFail($request->siswa_id);

                // 2. Update status siswa dan hapus dari kelasnya
                $siswa->update([
                    'status' => $request->jenis_mutasi,
                    'class_id' => null, // Siswa tidak lagi di kelas manapun
                ]);

                // 3. Catat kejadian mutasi di tabel riwayat
                MutasiSiswa::create([
                    'siswa_id' => $request->siswa_id,
                    'tanggal_mutasi' => $request->tanggal_mutasi,
                    'jenis_mutasi' => $request->jenis_mutasi,
                    'keterangan' => $request->keterangan,
                ]);
            });
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal memproses mutasi. ' . $e->getMessage()]);
        }

        return redirect()->route('mutasi-siswa.index')->with('message', 'Mutasi siswa berhasil diproses.');
    }
}
