<?php

namespace App\Http\Controllers;

use App\Models\PresensiGuru;
use App\Models\Guru;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Exports\PresensiGuruExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class LaporanPresensiController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());
        $searchTerm = $request->input('search');

        $gurus = Guru::query()
            ->when($searchTerm, function ($query, $search) {
                $query->where('nama_lengkap', 'like', "%{$search}%");
            })
            ->with(['presensiGurus' => function ($query) use ($startDate, $endDate) {
                $query->whereBetween('tanggal', [$startDate, $endDate]);
            }])
            ->get();

        $laporanData = $gurus->map(function ($guru) {
            // Hitung jumlah setiap status presensi
            $summary = $guru->presensiGurus->countBy('status');
            
            return [
                'id' => $guru->id,
                'nama_lengkap' => $guru->nama_lengkap,
                'presensi_details' => $guru->presensiGurus,
                'summary' => [
                    'Hadir' => $summary->get('Hadir', 0),
                    'Izin' => $summary->get('Izin', 0),
                    'Sakit' => $summary->get('Sakit', 0),
                ],
            ];
        });

        return Inertia::render('Laporan/PresensiGuru', [
            'laporanData' => $laporanData,
            'filters' => ['start_date' => $startDate, 'end_date' => $endDate, 'search' => $searchTerm],
        ]);
    }

    public function exportExcel(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());
        
        return Excel::download(new PresensiGuruExport($startDate, $endDate), 'laporan-presensi-guru.xlsx');
    }

    public function exportPdf(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());

        $presensis = PresensiGuru::with('guru')
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->get();

        $pdf = Pdf::loadView('reports.presensi_guru', [
            'presensis' => $presensis,
            'startDate' => $startDate,
            'endDate' => $endDate
        ]);

        return $pdf->download('laporan-presensi-guru.pdf');
    }
}
