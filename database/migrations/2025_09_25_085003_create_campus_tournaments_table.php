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
        Schema::create('campus_tournaments', function (Blueprint $table) {
            $table->id();
            $table->string('school_name');
            $table->string('sl_name');
            $table->unsignedBigInteger('sl_id'); // Foreign key to users table
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable(); // Regional Admin who approved/rejected
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            
            // Foreign key constraints
            $table->foreign('sl_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campus_tournaments');
    }
};
