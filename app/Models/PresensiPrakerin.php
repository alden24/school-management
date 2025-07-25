<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PresensiPrakerin extends Model
{
    use HasFactory;

    protected $fillable = [
        'prakerin_id', 'tanggal', 'waktu_masuk', 'foto_masuk', 'latitude_masuk', 'longitude_masuk',
        'waktu_pulang', 'foto_pulang', 'latitude_pulang', 'longitude_pulang',
        'status', 'keterangan', 'bukti_keterangan'
    ];

    protected $appends = ['foto_masuk_url', 'bukti_keterangan_url'];

    public function getFotoMasukUrlAttribute()
    {
        if ($this->foto_masuk) {
            return Storage::url($this->foto_masuk);
        }
        return null;
    }

    public function getBuktiKeteranganUrlAttribute()
    {
        if ($this->bukti_keterangan) {
            return Storage::url($this->bukti_keterangan);
        }
        return null;
    }

    /**
     * Mendefinisikan relasi ke model Prakerin.
     */
    public function prakerin()
    {
        return $this->belongsTo(Prakerin::class);
    }
}
