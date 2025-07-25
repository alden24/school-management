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
        $table->enum('status_lokasi_masuk', ['Di Lokasi', 'Di Luar Lokasi'])->nullable()->after('longitude_masuk');
        $table->enum('status_lokasi_pulang', ['Di Lokasi', 'Di Luar Lokasi'])->nullable()->after('longitude_pulang');
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
