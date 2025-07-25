<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kurikulum extends Model
{
    use HasFactory;
    protected $fillable = ['nama_kurikulum', 'is_active'];

    public function mataPelajarans()
    {
        return $this->hasMany(MataPelajaran::class);
    }
}
