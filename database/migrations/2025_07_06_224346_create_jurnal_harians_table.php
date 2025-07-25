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
        Schema::create('jurnal_harians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prakerin_id')->constrained('prakerins')->onDelete('cascade');
            $table->date('tanggal');
            $table->text('kegiatan');
            $table->enum('status_validasi', ['Menunggu', 'Disetujui', 'Revisi'])->default('Menunggu');
            $table->text('catatan_pembimbing')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jurnal_harians');
    }
};
