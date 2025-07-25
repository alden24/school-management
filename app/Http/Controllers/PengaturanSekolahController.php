<?php

namespace App\Http\Controllers;

use App\Models\PengaturanSekolah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengaturanSekolahController extends Controller
{
    /**
     * Menampilkan halaman pengaturan.
     * Akan membuat record default jika belum ada.
     */
    public function index()
    {
        // Ambil pengaturan pertama, atau buat jika tidak ada
        $pengaturan = PengaturanSekolah::firstOrCreate(
            ['id' => 1],
            [
                'nama_sekolah' => 'Nama Sekolah Anda',
                'latitude_sekolah' => '-6.2088', // Contoh: Jakarta
                'longitude_sekolah' => '106.8456',
                'radius_lokasi' => 100, // dalam meter
            ]
        );

        return Inertia::render('PengaturanSekolah/Index', [
            'pengaturan' => $pengaturan,
        ]);
    }

    /**
     * Memperbarui data pengaturan sekolah.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'nama_sekolah' => 'required|string|max:255',
            'latitude_sekolah' => 'required|numeric',
            'longitude_sekolah' => 'required|numeric',
            'radius_lokasi' => 'required|integer|min:10',
        ]);

        // Cari pengaturan dengan ID 1, lalu update
        $pengaturan = PengaturanSekolah::find(1);
        if ($pengaturan) {
            $pengaturan->update($validated);
        }

        return redirect()->route('pengaturan.sekolah.index')->with('message', 'Pengaturan sekolah berhasil diperbarui.');
    }
}
