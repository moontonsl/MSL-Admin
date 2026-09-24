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
        $indexes = collect(\DB::select("SHOW INDEXES FROM event_registrations"))->pluck('Key_name');

        Schema::table('event_registrations', function (Blueprint $table) use ($indexes) {
            if ($indexes->contains('unique_registration_per_event')) {
                $table->dropUnique('unique_registration_per_event');
            }
            
            if (!$indexes->contains('unique_registration_per_day')) {
                $table->unique(['mlbb_id', 'mlbb_server', 'event_name', 'event_date'], 'unique_registration_per_day');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->dropUnique('unique_registration_per_day');
            $table->unique(['mlbb_id', 'mlbb_server', 'event_name'], 'unique_registration_per_event');
        });
    }
};
