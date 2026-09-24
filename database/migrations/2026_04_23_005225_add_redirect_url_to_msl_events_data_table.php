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
        Schema::table('msl_events_data', function (Blueprint $table) {
            $table->string('redirect_url')->nullable()->after('event_canonical');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('msl_events_data', function (Blueprint $table) {
            $table->dropColumn('redirect_url');
        });
    }
};
