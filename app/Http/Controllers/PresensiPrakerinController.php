<?php

namespace App\Http\Controllers;

use App\Models\PresensiPrakerin;
use App\Models\Prakerin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class PresensiPrakerinController extends Controller
{
    public function index()
    {
        $siswa = Auth::user()->siswa;
        $prakerinAktif = Prakerin::where('siswa_id', $siswa->id)->where('status', 'Berlangsung')->with('dudi')->first();
        $presensiHariIni = null;

        if ($prakerinAktif) {
            $presensiHariIni = PresensiPrakerin::where('prakerin_id', $prakerinAktif->id)
                ->where('tanggal', Carbon::today()->toDateString())
                ->first();
        }

        return Inertia::render('PresensiPrakerin/Index', [
            'prakerinAktif' => $prakerinAktif,
            'presensiHariIni' => $presensiHariIni,
        ]);
    }

    public function storeMasuk(Request $request)
    {
        $request->validate([
            'prakerin_id' => 'required|exists:prakerins,id',
            'foto' => 'required|image',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $prakerin = Prakerin::with('dudi')->findOrFail($request->prakerin_id);

        // Validasi Lokasi (Geofencing)
        $jarak = $this->haversine(
            $prakerin->dudi->latitude,
            $prakerin->dudi->longitude,
            $request->latitude,
            $request->longitude
        );

        if ($jarak > 50) {
            return redirect()->back()->withErrors(['location' => 'Anda berada di luar jangkauan lokasi. Mendekatlah ke lokasi kerja.']);
        }
        
        $fotoPath = $request->file('foto')->store('presensi_prakerin/masuk', 'public');

        PresensiPrakerin::create([
            'prakerin_id' => $request->prakerin_id,
            'tanggal' => Carbon::today()->toDateString(),
            'waktu_masuk' => now()->toTimeString(),
            'foto_masuk' => $fotoPath,
            'latitude_masuk' => $request->latitude,
            'longitude_masuk' => $request->longitude,
            'status' => 'Hadir',
        ]);

        return redirect()->route('presensi.prakerin.index')->with('message', 'Absen masuk berhasil direkam.');
    }


    public function storePulang(Request $request)
    {
        $request->validate([
            'presensi_id' => 'required|exists:presensi_prakerins,id',
            'foto' => 'required|image',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $presensi = PresensiPrakerin::with('prakerin.dudi')->findOrFail($request->presensi_id);

        // Validasi Lokasi (Geofencing)
        $jarak = $this->haversine(
            $presensi->prakerin->dudi->latitude,
            $presensi->prakerin->dudi->longitude,
            $request->latitude,
            $request->longitude
        );


        if ($jarak > 50) {
            return redirect()->back()->withErrors(['location' => 'Anda berada di luar jangkauan lokasi. Mendekatlah ke lokasi kerja.']);
        }
        // PERBAIKAN: Cari presensi berdasarkan ID dari request
        $presensi = PresensiPrakerin::findOrFail($request->presensi_id);
        $siswa = Auth::user()->siswa;

        // Otorisasi: Pastikan presensi ini milik siswa yang login
        if ($presensi->prakerin->siswa_id !== $siswa->id) {
            return redirect()->back()->withErrors(['error' => 'Akses tidak diizinkan.']);
        }

        // Cek apakah sudah absen pulang
        if ($presensi->waktu_pulang) {
            return redirect()->back()->withErrors(['error' => 'Anda sudah melakukan absen pulang hari ini.']);
        }

        // Simpan foto selfie pulang
        $fotoPath = $request->file('foto')->store('presensi_prakerin/pulang', 'public');

        // Update data presensi yang sudah ada
        $presensi->update([
            'waktu_pulang' => now()->toTimeString(),
            'foto_pulang' => $fotoPath,
            'latitude_pulang' => $request->latitude,
            'longitude_pulang' => $request->longitude,
        ]);

        return redirect()->route('presensi.prakerin.index')->with('message', 'Absen pulang berhasil direkam.');
    }

    public function storeKeterangan(Request $request)
    {
        $request->validate([
            'prakerin_id' => 'required|exists:prakerins,id',
            'status' => 'required|in:Izin,Sakit',
            'keterangan' => 'required|string',
            'bukti_keterangan' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $buktiPath = null;
        if ($request->hasFile('bukti_keterangan')) {
            $buktiPath = $request->file('bukti_keterangan')->store('bukti_keterangan', 'public');
        }

        PresensiPrakerin::create([
            'prakerin_id' => $request->prakerin_id,
            'tanggal' => Carbon::today()->toDateString(),
            'status' => $request->status,
            'keterangan' => $request->keterangan,
            'bukti_keterangan' => $buktiPath,
        ]);

        return redirect()->route('presensi.prakerin.index')->with('message', 'Pengajuan ' . $request->status . ' berhasil direkam.');
    }

    private function haversine($lat1, $lon1, $lat2, $lon2)
    {
        if ($lat1 == null || $lon1 == null) return INF; // Kembalikan jarak tak terhingga jika lokasi belum di set

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
