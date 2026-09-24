<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('msl_news_data')) {
            return;
        }

        Schema::create('msl_news_data', function (Blueprint $table) {
            $table->id();
            $table->string('news_canonical')->unique();
            $table->string('news_state', 100);
            $table->string('news_title');
            $table->text('news_subtitle')->nullable();
            $table->dateTime('news_published')->nullable();
            $table->string('news_writer', 255)->nullable();
            $table->string('news_img1', 255)->nullable();
            $table->string('news_img2', 255)->nullable();
            $table->string('news_img3', 255)->nullable();
            $table->longText('news_content')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('msl_news_data');
    }
};

