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
        Schema::table('campus_tournament_team_members', function (Blueprint $table) {
            $table->string('lane_role')->nullable()->after('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campus_tournament_team_members', function (Blueprint $table) {
            $table->dropColumn('lane_role');
        });
    }
};
