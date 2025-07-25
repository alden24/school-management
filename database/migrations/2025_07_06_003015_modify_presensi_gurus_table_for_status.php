<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('presensi_gurus', function (Blueprint $table) {
            // Hapus kolom lama jika ada
            $table->dropColumn(['status_lokasi_masuk', 'status_lokasi_pulang']);
            // Tambahkan kolom status baru
            $table->enum('status', ['Hadir', 'Izin', 'Sakit', 'Alfa'])->nullable()->after('tanggal');
            $table->text('keterangan')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presensi_gurus', function (Blueprint $table) {
            //
        });
    }
};
