<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nilai extends Model
{
    use HasFactory;

    protected $fillable = [
        'siswa_id',
        'jadwal_pelajaran_id',
        'semester_id',
        'nilai_tugas',
        'nilai_uts',
        'nilai_uas',
        'nilai_akhir',
    ];

    public function siswa() { return $this->belongsTo(Siswa::class); }
    public function jadwalPelajaran() { return $this->belongsTo(JadwalPelajaran::class); }
    public function semester() { return $this->belongsTo(Semester::class); }
}
