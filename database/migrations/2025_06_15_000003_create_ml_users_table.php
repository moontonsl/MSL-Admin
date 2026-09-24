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
        Schema::create('ml_users', function (Blueprint $table) {
            $table->id();
            $table->string('ml_id')->unique()->comment('Mobile Legends User ID');
            $table->string('server_id')->comment('Server ID (e.g., 1234)');
            $table->string('ign')->comment('In-Game Name');
            $table->string('current_rank')->nullable()->comment('Current rank in the game');
            $table->string('highest_rank')->nullable()->comment('Highest rank achieved');
            $table->integer('level')->nullable()->comment('Account level');
            $table->integer('matches_played')->nullable()->default(0);
            $table->integer('matches_won')->nullable()->default(0);
            $table->float('win_rate', 5, 2)->nullable()->default(0)->comment('Win rate percentage');
            $table->json('favorite_heroes')->nullable()->comment('Array of favorite heroes');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_active_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Add index for common queries
            $table->index(['server_id', 'ign']);
            $table->index('current_rank');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ml_users');
    }
}; 