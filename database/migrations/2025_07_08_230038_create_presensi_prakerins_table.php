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
        Schema::create('presensi_prakerins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prakerin_id')->constrained('prakerins')->onDelete('cascade');
            $table->date('tanggal');
            $table->time('waktu_masuk')->nullable();
            $table->string('foto_masuk')->nullable();
            $table->string('latitude_masuk')->nullable();
            $table->string('longitude_masuk')->nullable();
            $table->time('waktu_pulang')->nullable();
            $table->string('foto_pulang')->nullable();
            $table->string('latitude_pulang')->nullable();
            $table->string('longitude_pulang')->nullable();
            $table->enum('status', ['Hadir', 'Izin', 'Sakit']);
            $table->text('keterangan')->nullable();
            $table->string('bukti_keterangan')->nullable(); // Untuk path file surat izin/sakit
            $table->timestamps();
    
            $table->unique(['prakerin_id', 'tanggal']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presensi_prakerins');
    }
};
