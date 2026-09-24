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
        if (!Schema::hasTable('mccs2_team_predictions')) {
            Schema::create('mccs2_team_predictions', function (Blueprint $table) {
                $table->id();
                $table->string('ml_id')->unique();
                $table->json('selected_teams');
                $table->timestamps();
                $table->foreign('ml_id')->references('ml_id')->on('ml_users')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('mccs2_player_predictions')) {
            Schema::create('mccs2_player_predictions', function (Blueprint $table) {
                $table->id();
                $table->string('ml_id');
                $table->string('role'); // GOLD, JUNGLER, EXP, MIDDLE, ROAMER
                $table->json('selected_players');
                $table->timestamps();
                $table->foreign('ml_id')->references('ml_id')->on('ml_users')->onDelete('cascade');
                $table->unique(['ml_id', 'role']); // One vote per role per user
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mccs2_player_predictions');
        Schema::dropIfExists('mccs2_team_predictions');
    }
};
