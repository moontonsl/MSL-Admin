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
        if (!Schema::hasColumn('campus_tournament_team_members', 'status')) {
            Schema::table('campus_tournament_team_members', function (Blueprint $table) {
                $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending')->after('role');
            });
        }
        
        // Update existing to accepted
        DB::table('campus_tournament_team_members')
            ->where('status', 'pending') // Only update if still default? Or just force all existing to accepted? Force all existing.
            ->whereNull('updated_at') // rudimentary check, but let's just update all current rows since this is a new feature
            ->update(['status' => 'accepted']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campus_tournament_team_members', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
