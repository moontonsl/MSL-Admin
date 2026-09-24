<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('event_name');
            $table->string('full_name');
            $table->string('region');
            $table->string('venue');
            $table->date('event_date');
            $table->string('email');
            $table->string('mlbb_id');
            $table->string('mlbb_server');
            $table->timestamps();



            $table->unique(['mlbb_id', 'mlbb_server', 'event_name'], 'unique_registration_per_event');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_registrations');
    }
};
