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
        if (!Schema::hasTable('msl_news_data')) {
            return;
        }

        Schema::table('msl_news_data', function (Blueprint $table) {
            if (!Schema::hasColumn('msl_news_data', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }

            if (!Schema::hasColumn('msl_news_data', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('msl_news_data')) {
            return;
        }

        Schema::table('msl_news_data', function (Blueprint $table) {
            $columns = array_filter(
                ['created_at', 'updated_at'],
                fn (string $column) => Schema::hasColumn('msl_news_data', $column)
            );

            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
