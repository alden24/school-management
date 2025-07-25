<?php

namespace App\Http\Controllers;

use App\Models\Prakerin;
use App\Models\Siswa;
use App\Models\Dudi;
use App\Models\Guru;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon; 

class PrakerinController extends Controller
{
    public function index()
    {
        $penempatans = Prakerin::whereYear('created_at', now()->year)
            // Tambahkan 'jurnalHarians' untuk memuat data jurnal
            ->with(['siswa', 'dudi', 'guru', 'jurnalHarians'])
            ->latest()
            ->get();
    
        return Inertia::render('Prakerin/Index', [
            'penempatans' => $penempatans,
        ]);
    }

    public function create()
    {
        return Inertia::render('Prakerin/Create', [
            // PERBAIKAN: Filter siswa yang hanya berada di tingkat 11
            'siswas' => Siswa::where('status', 'Aktif')
                ->whereHas('kelas', function ($query) {
                    $query->where('tingkat', 11);
                })
                ->get(),
            'dudis' => Dudi::all(),
            'gurus' => Guru::where('status', 'Guru')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id|unique:prakerins,siswa_id',
            'dudi_id' => 'required|exists:dudis,id',
            'guru_pembimbing_id' => 'required|exists:gurus,id',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
        ]);

        Prakerin::create($validated);

        return redirect()->route('penempatan-prakerin.index')->with('message', 'Penempatan siswa berhasil.');
    }

    /**
     * Menampilkan form untuk mengedit data penempatan.
     */
    public function edit(Prakerin $penempatan_prakerin)
    {
        return Inertia::render('Prakerin/Edit', [
            'penempatan' => $penempatan_prakerin,
            'siswas' => Siswa::where('status', 'Aktif')->orWhere('id', $penempatan_prakerin->siswa_id)->get(),
            'dudis' => Dudi::all(),
            'gurus' => Guru::where('status', 'Guru')->get(),
        ]);
    }

    /**
     * Memperbarui data penempatan di database.
     */
    public function update(Request $request, Prakerin $penempatan_prakerin)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id|unique:prakerins,siswa_id,' . $penempatan_prakerin->id,
            'dudi_id' => 'required|exists:dudis,id',
            'guru_pembimbing_id' => 'required|exists:gurus,id',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
        ]);

        $penempatan_prakerin->update($validated);

        return redirect()->route('penempatan-prakerin.index')->with('message', 'Data penempatan berhasil diperbarui.');
    }

    /**
     * Menghapus data penempatan dari database.
     */
    public function destroy(Prakerin $penempatan_prakerin)
    {
        $penempatan_prakerin->delete();
        return redirect()->route('penempatan-prakerin.index')->with('message', 'Data penempatan berhasil dihapus.');
    }

    public function generateSurat(Prakerin $prakerin)
    {
        // Muat semua relasi yang dibutuhkan untuk surat
        $prakerin->load(['siswa.kelas.kejuruan', 'dudi']);

        // Buat PDF
        $pdf = Pdf::loadView('surat.pengantar_prakerin', ['prakerin' => $prakerin]);

        // Buat nama file yang unik
        $fileName = 'surat-pengantar-' . $prakerin->siswa->nisn . '-' . time() . '.pdf';
        $filePath = 'surat_prakerin/' . $fileName;

        // Simpan PDF ke storage
        Storage::disk('public')->put($filePath, $pdf->output());

        // Update data prakerin dengan path surat dan ubah statusnya
        $prakerin->update([
            'surat_pengantar_path' => $filePath,
            'status' => 'Menunggu Jawaban DUDI',
        ]);

        return redirect()->back()->with('message', 'Surat pengantar berhasil dibuat dan status diperbarui.');
    }

    public function generateSuratKolektif(Dudi $dudi)
    {
        // Ambil semua data penempatan untuk DUDI ini yang statusnya masih 'Penempatan'
        $penempatans = Prakerin::where('dudi_id', $dudi->id)
            ->where('status', 'Penempatan')
            ->with(['siswa.kelas', 'dudi'])
            ->get();

        if ($penempatans->isEmpty()) {
            return redirect()->back()->withErrors(['error' => 'Tidak ada siswa yang perlu dibuatkan surat untuk DUDI ini.']);
        }

        // Buat PDF
        $pdf = Pdf::loadView('surat.pengantar_prakerin_kolektif', [
            'penempatans' => $penempatans,
            'dudi' => $dudi
        ]);

        $fileName = 'surat-kolektif-' . Str::slug($dudi->nama_perusahaan) . '-' . time() . '.pdf';
        $filePath = 'surat_prakerin/' . $fileName;

        Storage::disk('public')->put($filePath, $pdf->output());

        // Update semua data penempatan yang terlibat
        foreach ($penempatans as $penempatan) {
            $penempatan->update([
                'surat_pengantar_path' => $filePath,
                'status' => 'Menunggu Jawaban DUDI',
            ]);
        }

        return redirect()->back()->with('message', 'Surat pengantar kolektif berhasil dibuat.');
    }

    public function updateStatusDudi(Request $request, Dudi $dudi)
{
    $validated = $request->validate([
        'status' => 'required|in:Diterima DUDI,Ditolak DUDI',
        'surat_balasan' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
    ]);

    // Simpan file surat balasan
    $suratBalasanPath = $request->file('surat_balasan')->store('surat_balasan', 'public');

    // Update status untuk semua penempatan yang relevan
    Prakerin::where('dudi_id', $dudi->id)
        ->where('status', 'Menunggu Jawaban DUDI')
        ->update([
            'status' => $validated['status'],
            'surat_balasan_path' => $suratBalasanPath,
        ]);

    return redirect()->route('penempatan-prakerin.index')->with('message', 'Status penempatan untuk DUDI ' . $dudi->nama_perusahaan . ' berhasil diperbarui.');
}
}
