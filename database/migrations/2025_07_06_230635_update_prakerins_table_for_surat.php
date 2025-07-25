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
        DB::statement("ALTER TABLE prakerins CHANGE COLUMN status status ENUM('Penempatan', 'Menunggu Jawaban DUDI', 'Diterima DUDI', 'Ditolak DUDI', 'Berlangsung', 'Selesai', 'Dibatalkan') NOT NULL DEFAULT 'Penempatan'");

    Schema::table('prakerins', function (Blueprint $table) {
        // Menambahkan kolom baru untuk surat
        $table->string('surat_pengantar_path')->nullable()->after('status');
        $table->string('surat_balasan_path')->nullable()->after('surat_pengantar_path');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prakerins', function (Blueprint $table) {
            //
        });
    }
};
