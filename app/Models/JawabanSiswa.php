<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JawabanSiswa extends Model
{
    use HasFactory;
    protected $fillable = ['ujian_id', 'soal_id', 'siswa_id', 'pilihan_jawaban_id', 'jawaban_esai'];

}
