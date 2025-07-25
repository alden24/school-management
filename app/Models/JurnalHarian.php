<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JurnalHarian extends Model
{
    use HasFactory;
    protected $fillable = ['prakerin_id', 'tanggal', 'kegiatan', 'status_validasi', 'catatan_pembimbing'];

    public function prakerin()
    {
        return $this->belongsTo(Prakerin::class);
    }
}
