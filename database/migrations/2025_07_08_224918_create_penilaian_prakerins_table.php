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
        Schema::create('penilaian_prakerins', function (Blueprint $table) {
            $table->id();
            // Setiap data penilaian terhubung ke satu data prakerin
            $table->foreignId('prakerin_id')->unique()->constrained('prakerins')->onDelete('cascade');
            $table->decimal('nilai_pembimbing_dudi', 5, 2)->nullable();
            $table->decimal('nilai_laporan', 5, 2)->nullable();
            $table->decimal('nilai_presentasi', 5, 2)->nullable();
            $table->decimal('nilai_akhir', 5, 2)->nullable();
            $table->text('catatan_akhir')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penilaian_prakerins');
    }
};
