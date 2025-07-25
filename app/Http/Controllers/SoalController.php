<?php

namespace App\Http\Controllers;

use App\Models\Soal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SoalController extends Controller
{
    /**
     * Menyimpan soal baru ke dalam ujian.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ujian_id' => 'required|exists:ujians,id',
            'pertanyaan' => 'required|string',
            'tipe_soal' => 'required|in:pilihan_ganda,esai',
            'pilihan_jawabans' => 'required_if:tipe_soal,pilihan_ganda|array|min:2',
            'pilihan_jawabans.*.pilihan' => 'required|string',
            'pilihan_jawabans.*.is_benar' => 'boolean',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $soal = Soal::create([
                    'ujian_id' => $validated['ujian_id'],
                    'pertanyaan' => $validated['pertanyaan'],
                    'tipe_soal' => $validated['tipe_soal'],
                ]);

                if ($validated['tipe_soal'] === 'pilihan_ganda') {
                    foreach ($validated['pilihan_jawabans'] as $pilihan) {
                        $soal->pilihanJawabans()->create([
                            'pilihan' => $pilihan['pilihan'],
                            'is_benar' => $pilihan['is_benar'],
                        ]);
                    }
                }
            });
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan soal. ' . $e->getMessage()]);
        }

        return redirect()->back()->with('message', 'Soal berhasil ditambahkan.');
    }

    /**
     * Memperbarui soal yang sudah ada.
     */
    public function update(Request $request, Soal $soal)
    {
        $validated = $request->validate([
            'pertanyaan' => 'required|string',
            'tipe_soal' => 'required|in:pilihan_ganda,esai',
            'pilihan_jawabans' => 'required_if:tipe_soal,pilihan_ganda|array|min:2',
            'pilihan_jawabans.*.pilihan' => 'required|string',
            'pilihan_jawabans.*.is_benar' => 'boolean',
        ]);

        try {
            DB::transaction(function () use ($validated, $soal) {
                $soal->update([
                    'pertanyaan' => $validated['pertanyaan'],
                    'tipe_soal' => $validated['tipe_soal'],
                ]);

                // Hapus pilihan lama dan buat yang baru
                $soal->pilihanJawabans()->delete();

                if ($validated['tipe_soal'] === 'pilihan_ganda') {
                    foreach ($validated['pilihan_jawabans'] as $pilihan) {
                        $soal->pilihanJawabans()->create([
                            'pilihan' => $pilihan['pilihan'],
                            'is_benar' => $pilihan['is_benar'],
                        ]);
                    }
                }
            });
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui soal. ' . $e->getMessage()]);
        }

        return redirect()->back()->with('message', 'Soal berhasil diperbarui.');
    }

    /**
     * Menghapus soal dari ujian.
     */
    public function destroy(Soal $soal)
    {
        $soal->delete();
        return redirect()->back()->with('message', 'Soal berhasil dihapus.');
    }
}
