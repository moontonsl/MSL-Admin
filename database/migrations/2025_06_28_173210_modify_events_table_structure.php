<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            // Only add if the column does not exist
            if (!Schema::hasColumn('events', 'title')) {
                $table->string('title');
            }
            if (!Schema::hasColumn('events', 'description')) {
                $table->text('description')->nullable();
            }
            if (!Schema::hasColumn('events', 'start_date')) {
                $table->dateTime('start_date');
            }
            if (!Schema::hasColumn('events', 'end_date')) {
                $table->dateTime('end_date');
            }
            if (!Schema::hasColumn('events', 'location')) {
                $table->string('location')->nullable();
            }
            if (!Schema::hasColumn('events', 'created_by')) {
                $table->foreignId('created_by')->constrained('users');
            }
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            if (Schema::hasColumn('events', 'created_by')) {
                $table->dropForeign(['created_by']);
                $table->dropColumn('created_by');
            }
            foreach (['title','description','start_date','end_date','location'] as $col) {
                if (Schema::hasColumn('events', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
