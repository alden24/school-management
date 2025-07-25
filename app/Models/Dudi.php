<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dudi extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_perusahaan',
        'alamat',
        'telepon',
        'email_perusahaan',
        'nama_kontak_personalia',
        'latitude',
        'longitude',
    ];
}
