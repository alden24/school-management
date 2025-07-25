<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Soal extends Model
{
    use HasFactory;

    protected $fillable = ['ujian_id', 'pertanyaan', 'tipe_soal', 'gambar_soal'];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    // 1. Baris ini memastikan 'gambar_url' selalu disertakan
    //    saat data soal dikirim sebagai JSON/array.
    protected $appends = ['gambar_url'];

    /**
     * The "booted" method of the model.
     */
    protected static function booted()
    {
        // Otomatis hapus file gambar saat soal dihapus
        static::deleting(function ($soal) {
            if ($soal->gambar_soal) {
                Storage::disk('public')->delete($soal->gambar_soal);
            }
        });
    }

    /**
     * Accessor untuk mendapatkan URL lengkap gambar soal.
     */
    public function getGambarUrlAttribute()
    {
        if ($this->gambar_soal) {
            return Storage::url($this->gambar_soal);
        }
        // Mengembalikan null jika tidak ada gambar
        return null;
    }

    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }

    public function pilihanJawabans()
    {
        return $this->hasMany(PilihanJawaban::class);
    }
}
