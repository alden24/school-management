<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Siswa extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_lengkap',
        'nisn',
        'nis',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'alamat',
        'asal_sekolah',
        'class_id',
        'parent_id',
        'user_id',
        'foto',
        'status',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    // PERBAIKAN: Baris ini memastikan 'foto_url' selalu disertakan
    // saat data dikirim ke frontend.
    protected $appends = ['foto_url'];


    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::deleting(function ($siswa) {
            if ($siswa->foto) {
                Storage::disk('public')->delete($siswa->foto);
            }
            if ($siswa->user) {
                $siswa->user->delete();
            }
            if ($siswa->orangTua) {
                $siswa->orangTua->delete();
            }
        });
    }

    /**
     * Accessor untuk mendapatkan URL lengkap foto.
     */
    public function getFotoUrlAttribute()
    {
        if ($this->foto) {
            return Storage::url($this->foto);
        }
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->nama_lengkap) . '&background=random';
    }

    // --- Relasi ---
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class, 'class_id');
    }

    public function orangTua(): BelongsTo
    {
        return $this->belongsTo(OrangTua::class, 'parent_id');
    }

    public function absensis() {
        return $this->hasMany(Absensi::class); 
    }

    public function pembayaranSpps()
    {
        return $this->hasMany(PembayaranSPP::class, 'siswa_id');
    }
}
