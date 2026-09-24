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
        Schema::create('award_nominations', function (Blueprint $table) {
            $table->id();
            $table->string('ml_id');
            $table->string('award_id');
            $table->string('award_type'); // 'organization', 'student', etc.
            $table->string('nominator_name');
            $table->string('nominee_name');
            $table->text('reason');
            $table->timestamps();

            // A user can nominate multiple times per award, but not the same nominee
            $table->unique(['ml_id', 'award_id', 'nominee_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('award_nominations');
    }
};
