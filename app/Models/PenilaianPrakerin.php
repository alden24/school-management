<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PenilaianPrakerin extends Model
{
    use HasFactory;
    protected $fillable = ['prakerin_id', 'nilai_pembimbing_dudi', 'nilai_laporan', 'nilai_presentasi', 'nilai_akhir', 'catatan_akhir'];
}
