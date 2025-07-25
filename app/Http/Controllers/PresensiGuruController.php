<?php

namespace App\Http\Controllers;

use App\Models\PresensiGuru;
use App\Models\PengaturanSekolah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Inertia\Inertia;

class PresensiGuruController extends Controller
{
    /**
     * Menampilkan halaman utama presensi untuk guru.
     */
    public function index()
    {
        $guru = Auth::user()->guru;
        $today = Carbon::today()->toDateString();

        // Cek apakah guru sudah melakukan presensi hari ini
        $presensiHariIni = PresensiGuru::where('guru_id', $guru->id)
            ->where('tanggal', $today)
            ->first();

        // Ambil pengaturan lokasi sekolah
        $pengaturanSekolah = PengaturanSekolah::first();

        return Inertia::render('PresensiGuru/Index', [
            'presensiHariIni' => $presensiHariIni,
            'pengaturanSekolah' => $pengaturanSekolah,
        ]);
    }

    /**
     * Menyimpan data presensi masuk.
     */
    public function storeMasuk(Request $request)
    {
        $request->validate([
            'foto' => 'required|image',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $guru = Auth::user()->guru;
        $today = Carbon::today()->toDateString();
        $pengaturanSekolah = PengaturanSekolah::first();

        if (!$pengaturanSekolah) {
            return redirect()->back()->withErrors(['error' => 'Pengaturan lokasi sekolah belum diatur oleh admin.']);
        }

        $existingPresensi = PresensiGuru::where('guru_id', $guru->id)->where('tanggal', $today)->first();
        if ($existingPresensi && $existingPresensi->waktu_masuk) {
            return redirect()->back()->withErrors(['error' => 'Anda sudah melakukan absen masuk hari ini.']);
        }

        // Validasi Lokasi (Geofencing)
        $jarak = $this->haversine(
            $pengaturanSekolah->latitude_sekolah,
            $pengaturanSekolah->longitude_sekolah,
            $request->latitude,
            $request->longitude
        );

        $statusLokasi = ($jarak <= $pengaturanSekolah->radius_lokasi) ? 'Di Lokasi' : 'Di Luar Lokasi';

        $fotoPath = $request->file('foto')->store('presensi/masuk', 'public');

        PresensiGuru::updateOrCreate(
            ['guru_id' => $guru->id, 'tanggal' => $today],
            [
                'waktu_masuk' => now()->toTimeString(),
                'foto_masuk' => $fotoPath,
                'latitude_masuk' => $request->latitude,
                'longitude_masuk' => $request->longitude,
                'status' => 'Hadir',
                'status_lokasi_masuk' => $statusLokasi,
            ]
        );

        return redirect()->route('presensi.guru.index')->with('message', 'Absen masuk berhasil direkam.');
    }

    /**
     * Menyimpan data presensi pulang.
     */
    public function storePulang(Request $request)
    {
        $request->validate([
            'presensi_id' => 'required|exists:presensi_gurus,id',
            'foto' => 'required|image',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $presensi = PresensiGuru::findOrFail($request->presensi_id);
        $pengaturanSekolah = PengaturanSekolah::first();

        if (!$pengaturanSekolah) {
            return redirect()->back()->withErrors(['error' => 'Pengaturan lokasi sekolah belum diatur oleh admin.']);
        }

        $jarak = $this->haversine(
            $pengaturanSekolah->latitude_sekolah,
            $pengaturanSekolah->longitude_sekolah,
            $request->latitude,
            $request->longitude
        );

        $statusLokasi = ($jarak <= $pengaturanSekolah->radius_lokasi) ? 'Di Lokasi' : 'Di Luar Lokasi';

        $fotoPath = $request->file('foto')->store('presensi/pulang', 'public');

        $presensi->update([
            'waktu_pulang' => now()->toTimeString(),
            'foto_pulang' => $fotoPath,
            'latitude_pulang' => $request->latitude,
            'longitude_pulang' => $request->longitude,
            'status_lokasi_pulang' => $statusLokasi,
        ]);

        return redirect()->route('presensi.guru.index')->with('message', 'Absen pulang berhasil direkam.');
    }
    
    /**
     * Menyimpan pengajuan izin atau sakit.
     */
    public function storeKeterangan(Request $request)
    {
        $request->validate([
            'status' => 'required|in:Izin,Sakit',
            'keterangan' => 'required|string|max:255',
        ]);

        $guru = Auth::user()->guru;
        $today = Carbon::today()->toDateString();

        $existingPresensi = PresensiGuru::where('guru_id', $guru->id)->where('tanggal', $today)->first();
        if ($existingPresensi) {
            return redirect()->back()->withErrors(['error' => 'Anda sudah memiliki rekam kehadiran hari ini.']);
        }

        PresensiGuru::create([
            'guru_id' => $guru->id,
            'tanggal' => $today,
            'status' => $request->status,
            'keterangan' => $request->keterangan,
        ]);

        return redirect()->route('presensi.guru.index')->with('message', 'Pengajuan ' . $request->status . ' berhasil direkam.');
    }


    /**
     * Fungsi helper untuk menghitung jarak antara dua koordinat GPS.
     * Menggunakan formula Haversine.
     * @return float Jarak dalam meter.
     */
    private function haversine($lat1, $lon1, $lat2, $lon2)
    {
        if ($lat1 == null || $lon1 == null) return INF;

        $earthRadius = 6371000; // Radius bumi dalam meter

        $latFrom = deg2rad($lat1);
        $lonFrom = deg2rad($lon1);
        $latTo = deg2rad($lat2);
        $lonTo = deg2rad($lon2);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
            cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));
            
        return $angle * $earthRadius;
    }
}
