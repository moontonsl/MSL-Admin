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
        if (!Schema::hasColumn('campus_tournament_teams', 'status')) {
            Schema::table('campus_tournament_teams', function (Blueprint $table) {
                $table->enum('status', ['assembling', 'registered'])->default('assembling')->after('team_name');
            });

            // Update existing teams to 'assembling' or 'registered' as needed
            // For now, let's default to 'registered' for backward compatibility or 'assembling' if safer.
            // Since the user said "registered" is the final state, and previously everything was effectively registered,
            // we should probably set existing to 'registered' to avoid breaking current tournaments.
            DB::table('campus_tournament_teams')->update(['status' => 'registered']);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('campus_tournament_teams', 'status')) {
            Schema::table('campus_tournament_teams', function (Blueprint $table) {
                $table->dropColumn('status');
            });
        }
    }
};
