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
        Schema::table('ujians', function (Blueprint $table) {
            // Menghapus kolom jika ada
            if (Schema::hasColumn('ujians', 'jumlah_soal')) {
                $table->dropColumn('jumlah_soal');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ujians', function (Blueprint $table) {
            // Jika dibatalkan, tambahkan kembali kolomnya
            $table->integer('jumlah_soal')->default(0);
        });
    }
};
