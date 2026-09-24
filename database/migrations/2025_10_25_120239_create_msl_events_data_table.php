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
        if (!Schema::hasTable('msl_events_data')) {
            Schema::create('msl_events_data', function (Blueprint $table) {
                $table->id();
                $table->string('event_name');
                $table->string('event_state')->default('Active');
                $table->string('event_canonical');
                $table->string('event_logo')->nullable();
                $table->string('event_title');
                $table->text('event_subtitle');
                $table->text('event_content01')->nullable();
                $table->text('event_content02')->nullable();
                $table->string('event_img01')->nullable();
                $table->string('event_img02')->nullable();
                $table->string('event_img03')->nullable();
                $table->string('event_img04')->nullable();
                $table->string('event_img05')->nullable();
                $table->boolean('is_featured')->default(false);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('msl_events_data');
    }
};