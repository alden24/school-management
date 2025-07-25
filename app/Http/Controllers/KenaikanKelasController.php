<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KenaikanKelasController extends Controller
{
    /**
     * Menampilkan halaman untuk proses kenaikan kelas.
     */
    public function index(Request $request)
    {
        $kelasAsalId = $request->query('kelas_asal_id');
        $students = collect();

        if ($kelasAsalId) {
            $students = Siswa::where('class_id', $kelasAsalId)->get();
        }

        return Inertia::render('KenaikanKelas/Index', [
            'kelases' => Kelas::orderBy('tingkat')->get(),
            'students' => $students,
            'kelasAsalId' => $kelasAsalId,
        ]);
    }

    /**
     * Menyimpan proses kenaikan kelas.
     */
    public function store(Request $request)
    {
        $request->validate([
            'kelas_asal_id' => 'required|exists:kelas,id',
            'kelas_tujuan_id' => 'required|exists:kelas,id',
            'siswa_ids' => 'required|array|min:1',
            'siswa_ids.*' => 'exists:siswas,id',
        ]);

        try {
            DB::transaction(function () use ($request) {
                Siswa::whereIn('id', $request->siswa_ids)
                    ->update(['class_id' => $request->kelas_tujuan_id]);
            });
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal memproses kenaikan kelas. ' . $e->getMessage()]);
        }

        return redirect()->route('kenaikan-kelas.index')->with('message', 'Proses kenaikan kelas berhasil dilaksanakan.');
    }
}
