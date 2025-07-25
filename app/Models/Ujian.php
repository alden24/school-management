<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ujian extends Model
{
    use HasFactory;

    protected $fillable = [
        'jadwal_pelajaran_id', 
        'judul', 
        'deskripsi', 
        'waktu_mulai', 
        'waktu_selesai', 
        'tipe',
    ];

    /**
     * The attributes that should be cast.
     * Ini akan secara otomatis mengonversi kolom ini menjadi objek Carbon
     * dan memformatnya dengan benar saat dikirim ke frontend.
     * @var array
     */
    protected $casts = [
        'waktu_mulai' => 'datetime',
        'waktu_selesai' => 'datetime',
    ];

    public function soals()
    {
        return $this->hasMany(Soal::class);
    }

    public function jadwalPelajaran()
    {
        return $this->belongsTo(JadwalPelajaran::class);
    }
}
