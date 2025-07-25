<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrangTua extends Model
{
    use HasFactory;

    protected $fillable = [
    'nama_ayah', // <-- Ganti dari nama_lengkap
    'pekerjaan_ayah', // <-- Ganti dari pekerjaan
    'nama_ibu', // <-- Tambahkan ini
    'pekerjaan_ibu', // <-- Tambahkan ini
    'kontak',
    ];
}
