<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MutasiSiswa extends Model
{
    use HasFactory;
    protected $fillable = ['siswa_id', 'tanggal_mutasi', 'jenis_mutasi', 'keterangan'];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
}
