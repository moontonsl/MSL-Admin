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
        Schema::table('campus_tournaments', function (Blueprint $table) {
            $table->string('tournament_type')->default('Online')->after('end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campus_tournaments', function (Blueprint $table) {
            $table->dropColumn('tournament_type');
        });
    }
};
