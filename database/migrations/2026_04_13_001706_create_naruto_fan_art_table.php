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
        Schema::create('naruto_fan_art', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('school');
            $table->string('ml_id');
            $table->string('server_id');
            $table->string('facebook_profile_link');
            $table->string('post_link');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('naruto_fan_art');
    }
};
