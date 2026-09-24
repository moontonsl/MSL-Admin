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
        Schema::create('jb_flex_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('school');
            $table->string('ml_id');
            $table->string('server_id');
            $table->string('facebook_profile_link', 500);
            $table->string('post_link', 500);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jb_flex_submissions');
    }
};
