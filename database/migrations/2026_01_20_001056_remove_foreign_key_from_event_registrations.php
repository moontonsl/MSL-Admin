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
        $exists = \DB::table('information_schema.TABLE_CONSTRAINTS')
            ->where('TABLE_SCHEMA', \DB::connection()->getDatabaseName())
            ->where('TABLE_NAME', 'event_registrations')
            ->where('CONSTRAINT_NAME', 'event_registrations_mlbb_id_mlbb_server_foreign')
            ->where('CONSTRAINT_TYPE', 'FOREIGN KEY')
            ->exists();

        if ($exists) {
            Schema::table('event_registrations', function (Blueprint $table) {
                $table->dropForeign('event_registrations_mlbb_id_mlbb_server_foreign');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            // Re-add the foreign key if needed (though we likely don't want to)
            $table->foreign(['mlbb_id', 'mlbb_server'], 'event_registrations_mlbb_id_mlbb_server_foreign')
                  ->references(['ml_id', 'server_id'])
                  ->on('ml_users')
                  ->onDelete('cascade');
        });
    }
};
