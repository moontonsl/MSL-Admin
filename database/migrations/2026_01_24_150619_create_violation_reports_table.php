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
        Schema::create('violation_reports', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable(); // Nullable because it can be anonymous
            $table->string('school')->nullable(); // Nullable because it can be anonymous
            $table->string('incident_type');
            $table->text('description');
            $table->text('evidence')->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->string('status')->default('Pending'); // Pending, Reviewed, Resolved
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('violation_reports');
    }
};
