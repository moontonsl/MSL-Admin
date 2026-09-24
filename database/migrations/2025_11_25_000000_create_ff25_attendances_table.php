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
        Schema::create('ff25_attendances', function (Blueprint $table) {
            $table->id();
            $table->enum('has_msl_account', ['yes', 'no']);
            $table->string('region');
            $table->string('school');
            $table->string('msl_username')->nullable();
            $table->string('full_name')->nullable();
            $table->string('email')->nullable();
            $table->string('mlbb_id')->nullable();
            $table->string('mlbb_server')->nullable();
            $table->string('event_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ff25_attendances');
    }
};


