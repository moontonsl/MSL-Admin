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
        Schema::table('event_registrations', function (Blueprint $table) {
            // New fields for GM26
            $table->string('facebook_link')->nullable()->after('email');
            $table->string('community')->nullable()->after('facebook_link');
            $table->string('school')->nullable()->after('community');
            $table->string('post_link')->nullable()->after('school'); // For GM26Network
            $table->string('proof_link')->nullable()->after('post_link'); // For GM26Comm

            // Make existing fields nullable for GM26
            $table->string('region')->nullable()->change();
            $table->string('venue')->nullable()->change();
            $table->date('event_date')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->string('region')->nullable(false)->change();
            $table->string('venue')->nullable(false)->change();
            $table->date('event_date')->nullable(false)->change();

            $table->dropColumn([
                'facebook_link',
                'community',
                'school',
                'post_link',
                'proof_link',
            ]);
        });
    }
};
