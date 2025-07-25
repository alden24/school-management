<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PilihanJawaban extends Model
{
    use HasFactory;
    protected $fillable = ['soal_id', 'pilihan', 'is_benar'];

    public function soal() { return $this->belongsTo(Soal::class); }

}
