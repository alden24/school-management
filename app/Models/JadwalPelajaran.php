<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;
class JadwalPelajaran extends Model
{
    use HasFactory;

    protected $fillable = [
        'semester_id',
        'kelas_id',
        'mata_pelajaran_id',
        'guru_id',
        'hari',
        'jam_mulai',
        'jam_selesai',
    ];
    protected $appends = ['jumlah_jp'];

    public function getJumlahJpAttribute()
    {
        if (!$this->jam_mulai || !$this->jam_selesai) {
            return null;
        }

        $mulai = Carbon::parse($this->jam_mulai);
        $selesai = Carbon::parse($this->jam_selesai);

        // Hitung durasi total dalam menit
        $durasiTotalMenit = ($selesai->timestamp - $mulai->timestamp) / 60;
        if ($durasiTotalMenit < 0) return null;

        // Tentukan waktu istirahat
        $istirahat1Mulai = Carbon::parse('10:00');
        $istirahat1Selesai = Carbon::parse('10:20');
        $istirahat2Mulai = Carbon::parse('11:50');
        $istirahat2Selesai = Carbon::parse('12:20');

        $durasiIstirahatMenit = 0;

        // Hitung tumpang tindih dengan istirahat pertama
        if ($mulai < $istirahat1Selesai && $selesai > $istirahat1Mulai) {
            $overlapStart = $mulai->max($istirahat1Mulai);
            $overlapEnd = $selesai->min($istirahat1Selesai);
            $durasiIstirahatMenit += ($overlapEnd->timestamp - $overlapStart->timestamp) / 60;
        }

        // Hitung tumpang tindih dengan istirahat kedua
        if ($mulai < $istirahat2Selesai && $selesai > $istirahat2Mulai) {
            $overlapStart = $mulai->max($istirahat2Mulai);
            $overlapEnd = $selesai->min($istirahat2Selesai);
            $durasiIstirahatMenit += ($overlapEnd->timestamp - $overlapStart->timestamp) / 60;
        }

        // Kurangi durasi total dengan durasi istirahat
        $durasiEfektifMenit = $durasiTotalMenit - $durasiIstirahatMenit;

        // Asumsi 1 Jam Pelajaran (JP) = 45 menit
        $jp = floor($durasiEfektifMenit / 45);

        return $jp . ' JP';
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function mataPelajaran()
    {
        return $this->belongsTo(MataPelajaran::class);
    }

    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }

    public function absensis() { 
        return $this->hasMany(Absensi::class); 
    }
}
