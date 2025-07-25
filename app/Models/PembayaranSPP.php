<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PembayaranSPP extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'pembayaran_spps';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'siswa_id',
        'tanggal_bayar',
        'jumlah_bayar',
        'periode_bulan',
        'periode_tahun',
        'status',
        'bukti_pembayaran',
        'order_id',
        'snap_token',
        'payment_type',
    ];

    /**
     * Get the siswa that owns the PembayaranSPP
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
}
