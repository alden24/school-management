<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PresensiGuru extends Model
{
    use HasFactory;

    protected $fillable = [
        'guru_id',
        'tanggal',
        'waktu_masuk',
        'waktu_pulang',
        'foto_masuk',
        'foto_pulang',
        'latitude_masuk',
        'longitude_masuk',
        'latitude_pulang',
        'longitude_pulang',
        'status',
        'keterangan',
        'status_lokasi_masuk',
        'status_lokasi_pulang',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    // 1. Baris ini memastikan accessor di bawah ini selalu disertakan
    //    saat data dikirim sebagai JSON/array ke frontend.
    protected $appends = ['foto_masuk_url', 'foto_pulang_url'];

    /**
     * Accessor untuk mendapatkan URL lengkap foto masuk.
     */
    public function getFotoMasukUrlAttribute()
    {
        if ($this->foto_masuk) {
            return Storage::url($this->foto_masuk);
        }
        return null;
    }

    /**
     * Accessor untuk mendapatkan URL lengkap foto pulang.
     */
    public function getFotoPulangUrlAttribute()
    {
        if ($this->foto_pulang) {
            return Storage::url($this->foto_pulang);
        }
        return null;
    }

    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }
}
