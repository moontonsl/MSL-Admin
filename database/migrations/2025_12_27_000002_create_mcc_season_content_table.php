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
        Schema::create('mcc_season_content', function (Blueprint $table) {
            $table->id();
            $table->foreignId('season_id')->constrained('mcc_seasons')->onDelete('cascade');
            $table->enum('content_type', [
                'hero_images',
                'logos',
                'backgrounds',
                'buttons',
                'text_content',
                'teams',
                'standings',
                'matches'
            ]);
            $table->string('content_key');
            $table->json('content_value');
            $table->integer('display_order')->default(0);
            $table->timestamps();
            
            // Index for faster queries
            $table->index(['season_id', 'content_type']);
            $table->index('content_key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mcc_season_content');
    }
};
