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
        Schema::create('pembimbing_dudis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dudi_id')->constrained('dudis')->onDelete('cascade');
            $table->string('nama_pembimbing');
            $table->string('jabatan')->nullable();
            $table->string('kontak')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembimbing_dudis');
    }
};
