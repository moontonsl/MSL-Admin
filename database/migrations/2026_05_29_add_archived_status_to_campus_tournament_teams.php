<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds 'archived' to the status enum so assembling teams can be preserved
     * during roster lock and restored when registration is extended.
     */
    public function up(): void
    {
        // MySQL requires re-defining the full enum to add a value
        DB::statement("ALTER TABLE campus_tournament_teams MODIFY COLUMN status ENUM('assembling', 'registered', 'archived') NOT NULL DEFAULT 'assembling'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // First convert any archived teams back to assembling so the column can be narrowed
        DB::table('campus_tournament_teams')
            ->where('status', 'archived')
            ->update(['status' => 'assembling']);

        DB::statement("ALTER TABLE campus_tournament_teams MODIFY COLUMN status ENUM('assembling', 'registered') NOT NULL DEFAULT 'assembling'");
    }
};
