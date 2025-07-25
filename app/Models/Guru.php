<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Guru extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_lengkap',
        'nuptk',
        'spesialisasi_mapel',
        'kontak',
        'user_id',
        'nip',
        'nik',
        'npwp',
        'nama_ibu_kandung',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'status',
        'status_perkawinan',
        'agama',
        'alamat',
        'foto',
    ];
    protected $appends = ['foto_url'];
    
    public function getFotoUrlAttribute()
    {
        if ($this->foto) {
            return Storage::url($this->foto);
        }
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->nama_lengkap) . '&background=random';
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function presensiGurus()
    {
        return $this->hasMany(PresensiGuru::class);
    }
}
