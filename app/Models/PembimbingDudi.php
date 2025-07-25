<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PembimbingDudi extends Model
{
    use HasFactory;

    protected $fillable = [
        'dudi_id', 
        'nama_pembimbing', 
        'jabatan', 
        'kontak'
    ];

    /**
     * Mendefinisikan relasi ke model Dudi.
     * Satu Pembimbing DUDI dimiliki oleh satu Dudi.
     */
    public function dudi()
    {
        return $this->belongsTo(Dudi::class);
    }
}
