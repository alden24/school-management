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
        Schema::table('gurus', function (Blueprint $table) {
            $table->string('nip', 18)->nullable()->unique()->after('nuptk');
            $table->string('nik', 16)->nullable()->unique()->after('nip');
            $table->string('npwp', 16)->nullable()->unique()->after('nik');
            $table->string('nama_ibu_kandung')->nullable()->after('npwp');
            $table->string('tempat_lahir')->nullable()->after('nama_ibu_kandung');
            $table->date('tanggal_lahir')->nullable()->after('tempat_lahir');
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan'])->nullable()->after('tanggal_lahir');
            $table->enum('status_perkawinan', ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'])->nullable()->after('jenis_kelamin');
            $table->string('agama')->nullable()->after('status_perkawinan');
            $table->text('alamat')->nullable()->after('agama');
            $table->string('foto')->nullable()->after('alamat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gurus', function (Blueprint $table) {
            //
        });
    }
};
