<?php
namespace App\Exports;

use App\Models\PresensiGuru;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PresensiGuruExport implements FromCollection, WithHeadings, WithMapping
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function collection()
    {
        return PresensiGuru::with('guru')
            ->whereBetween('tanggal', [$this->startDate, $this->endDate])
            ->get();
    }

    public function headings(): array
    {
        return ["Nama", "Tanggal", "Waktu Masuk", "Status Masuk", "Waktu Pulang", "Status Pulang"];
    }

    public function map($presensi): array
    {
        return [
            $presensi->guru->nama_lengkap,
            $presensi->tanggal,
            $presensi->waktu_masuk,
            $presensi->status_lokasi_masuk,
            $presensi->waktu_pulang,
            $presensi->status_lokasi_pulang,
        ];
    }
}