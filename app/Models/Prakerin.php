<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prakerin extends Model
{
    use HasFactory;

    protected $fillable = [
        'siswa_id', 
        'dudi_id', 
        'guru_pembimbing_id', 
        'pembimbing_dudi_id', 
        'tanggal_mulai', 
        'tanggal_selesai', 
        'status',
        'surat_pengantar_path', // <-- Tambahkan ini
        'surat_balasan_path',   // <-- Tambahkan ini
    ];
    
    /**
     * Mendefinisikan relasi ke model Siswa.
     * Satu data Prakerin dimiliki oleh satu Siswa.
     */
    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    /**
     * Mendefinisikan relasi ke model Dudi.
     * Satu data Prakerin dimiliki oleh satu Dudi.
     */
    public function dudi()
    {
        return $this->belongsTo(Dudi::class);
    }

    /**
     * Mendefinisikan relasi ke model Guru.
     * Kita menamainya 'guru' agar konsisten dengan pemanggilan di controller.
     */
    public function guru()
    {
        return $this->belongsTo(Guru::class, 'guru_pembimbing_id');
    }

    /**
     * Mendefinisikan relasi ke model PembimbingDudi.
     */
    public function pembimbingDudi()
    {
        return $this->belongsTo(PembimbingDudi::class);
    }

    public function jurnalHarians()
    {
        return $this->hasMany(JurnalHarian::class)->orderBy('tanggal', 'desc');
    }

    public function penilaian()
    {
        return $this->hasOne(PenilaianPrakerin::class);
    }

    public function presensiPrakerins()
    {
        return $this->hasMany(PresensiPrakerin::class)->orderBy('tanggal', 'desc');
    }
}
