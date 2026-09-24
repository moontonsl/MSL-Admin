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
        if (!Schema::hasTable('votings')) {
            Schema::create('votings', function (Blueprint $table) {
                $table->id();
                $table->string('ml_id');
                $table->foreign('ml_id')
                      ->references('ml_id')
                      ->on('ml_users')
                      ->onDelete('cascade');
                $table->string('image');
                $table->string('bracket');
                $table->string('team');
                $table->string('status')->default('open');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votings');
    }
};
