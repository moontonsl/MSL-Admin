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
            $table->boolean('results_submitted')->default(false)->after('approved_at');
            $table->timestamp('results_submitted_at')->nullable()->after('results_submitted');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campus_tournaments', function (Blueprint $table) {
            $table->dropColumn(['results_submitted', 'results_submitted_at']);
        });
    }
};
