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
        Schema::create('mcc_seasons', function (Blueprint $table) {
            $table->id();
            $table->integer('season_number')->unique();
            $table->string('season_name');
            $table->boolean('is_active')->default(false);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('route_slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Index for faster queries
            $table->index('is_active');
            $table->index('season_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mcc_seasons');
    }
};
