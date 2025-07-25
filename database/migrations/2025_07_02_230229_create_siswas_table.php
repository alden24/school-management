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
        // Membuat tabel siswas dari awal dengan semua kolom yang benar
        Schema::create('siswas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('nama_lengkap');
            $table->string('nisn', 10)->unique();
            $table->date('tanggal_lahir')->nullable();
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
            $table->text('alamat')->nullable();
            $table->string('foto')->nullable(); // <-- Kolom foto sudah ada di sini
            $table->foreignId('parent_id')->nullable()->constrained('orang_tuas')->onDelete('set null');
            $table->foreignId('class_id')->nullable()->constrained('kelas')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Fungsi down yang benar adalah menghapus tabel yang dibuat oleh fungsi up
        Schema::dropIfExists('siswas');
    }
};
