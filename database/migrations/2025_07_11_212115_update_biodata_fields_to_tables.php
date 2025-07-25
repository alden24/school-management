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
        Schema::table('siswas', function (Blueprint $table) {
        $table->string('nis', 10)->nullable()->unique()->after('nisn');
        $table->string('tempat_lahir')->nullable()->after('tanggal_lahir');
    });

    // Menambahkan kolom ke tabel orang_tuas
    Schema::table('orang_tuas', function (Blueprint $table) {
        $table->renameColumn('nama_lengkap', 'nama_ayah');
        $table->renameColumn('pekerjaan', 'pekerjaan_ayah');
        $table->string('nama_ibu')->nullable()->after('pekerjaan_ayah');
        $table->string('pekerjaan_ibu')->nullable()->after('nama_ibu');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tables', function (Blueprint $table) {
            //
        });
    }
};
