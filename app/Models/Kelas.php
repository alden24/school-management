<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';

    protected $fillable = ['nama_kelas', 'tingkat', 'wali_kelas_id', 'kejuruan_id'];


    public function waliKelas(): BelongsTo
    {
        return $this->belongsTo(Guru::class, 'wali_kelas_id');
    }

    public function siswas()
    {
        return $this->hasMany(Siswa::class, 'class_id');
    }
    
    // --- TAMBAHKAN METHOD INI ---
    public function jadwalPelajarans()
    {
        return $this->hasMany(JadwalPelajaran::class, 'kelas_id');
    }

    public function kejuruan()
    {
        return $this->belongsTo(Kejuruan::class);
    }
}