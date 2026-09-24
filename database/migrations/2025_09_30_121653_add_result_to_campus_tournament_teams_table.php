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
        Schema::table('campus_tournament_teams', function (Blueprint $table) {
            $table->enum('result', ['participant', 'win', 'invalid'])->default('participant')->after('captain_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campus_tournament_teams', function (Blueprint $table) {
            $table->dropColumn('result');
        });
    }
};
