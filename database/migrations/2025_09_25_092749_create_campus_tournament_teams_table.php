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
        Schema::create('campus_tournament_teams', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tournament_id');
            $table->string('team_name');
            $table->string('discord_id');
            $table->unsignedBigInteger('captain_id');
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('tournament_id')->references('id')->on('campus_tournaments')->onDelete('cascade');
            $table->foreign('captain_id')->references('id')->on('users')->onDelete('cascade');
            
            // Unique constraint for team name per tournament
            $table->unique(['tournament_id', 'team_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campus_tournament_teams');
    }
};
