<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // First create the brackets table
        Schema::create('brackets', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->enum('status', ['open', 'closed', 'upcoming'])->default('open');
            $table->timestamps();
        });

        // Then create the bracket_teams table with the foreign key
        Schema::create('bracket_teams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bracket_id')
                  ->constrained('brackets')
                  ->onDelete('cascade');
            $table->string('team_name');
            $table->string('image_path');
            $table->integer('team_order');
            $table->timestamps();

            // Add unique constraint for team name within a bracket
            $table->unique(['bracket_id', 'team_name']);
        });
    }

    public function down()
    {
        // Drop tables in reverse order (due to foreign key constraints)
        Schema::dropIfExists('bracket_teams');
        Schema::dropIfExists('brackets');
    }
}; 