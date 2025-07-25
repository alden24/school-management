<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MataPelajaran extends Model
{
    use HasFactory;
    
    protected $fillable = ['nama_mapel', 'deskripsi', 'kategori_id', 'kurikulum_id'];

    public function kurikulum()
    {
        return $this->belongsTo(Kurikulum::class);
    }

    public function kategori()
    {
        return $this->belongsTo(KategoriMataPelajaran::class, 'kategori_id');
    }
}
