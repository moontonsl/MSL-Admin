<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // ML related fields
            if (!Schema::hasColumn('users', 'ml_id')) {
                $table->string('ml_id')->nullable();
            }
            if (!Schema::hasColumn('users', 'username')) {
                $table->string('username')->nullable();
            }
            if (!Schema::hasColumn('users', 'ml_server')) {
                $table->string('ml_server')->nullable();
            }
            if (!Schema::hasColumn('users', 'ml_ign')) {
                $table->string('ml_ign')->nullable();
            }
            if (!Schema::hasColumn('users', 'status')) {
                $table->enum('status', ['active', 'inactive'])->default('active');
            }

            // Personal details
            if (!Schema::hasColumn('users', 'surname')) {
                $table->string('surname')->nullable();
            }
            if (!Schema::hasColumn('users', 'lastName')) {
                $table->string('lastName')->nullable();
            }
            if (!Schema::hasColumn('users', 'suffix')) {
                $table->string('suffix')->nullable();
            }
            if (!Schema::hasColumn('users', 'birthday')) {
                $table->date('birthday')->nullable();
            }
            if (!Schema::hasColumn('users', 'age')) {
                $table->integer('age')->nullable();
            }
            if (!Schema::hasColumn('users', 'gender')) {
                $table->enum('gender', ['male', 'female', 'other'])->nullable();
            }
            if (!Schema::hasColumn('users', 'contact_number')) {
                $table->string('contact_number')->nullable();
            }
            if (!Schema::hasColumn('users', 'facebook_link')) {
                $table->string('facebook_link')->nullable();
            }

            // Academic details
            if (!Schema::hasColumn('users', 'course')) {
                $table->string('course')->nullable();
            }
            if (!Schema::hasColumn('users', 'university')) {
                $table->string('university')->nullable();
            }
            if (!Schema::hasColumn('users', 'year_level')) {
                $table->string('year_level')->nullable();
            }
            if (!Schema::hasColumn('users', 'studentId')) {
                $table->string('studentId')->nullable();
            }
            if (!Schema::hasColumn('users', 'proofOfEnrollment')) {
                $table->string('proofOfEnrollment')->nullable();
            }

            // Location details
            if (!Schema::hasColumn('users', 'region')) {
                $table->string('region')->nullable();
            }
            if (!Schema::hasColumn('users', 'island')) {
                $table->string('island')->nullable();
            }

            // Squad details
            if (!Schema::hasColumn('users', 'squadAbbreviation')) {
                $table->string('squadAbbreviation')->nullable();
            }
            if (!Schema::hasColumn('users', 'squadName')) {
                $table->string('squadName')->nullable();
            }
            if (!Schema::hasColumn('users', 'inGameRole')) {
                $table->string('inGameRole')->nullable();
            }
            if (!Schema::hasColumn('users', 'mainHero')) {
                $table->string('mainHero')->nullable();
            }
            if (!Schema::hasColumn('users', 'rank')) {
                $table->string('rank')->nullable();
            }

            // User type
            if (!Schema::hasColumn('users', 'user_type')) {
                $table->string('user_type')->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                // ML related fields
                'ml_id',
                'username',
                'ml_server',
                'ml_ign',
                'status',
                
                // Personal details
                'surname',
                'lastName',
                'suffix',
                'birthday',
                'age',
                'gender',
                'contact_number',
                'facebook_link',
                
                // Academic details
                'course',
                'university',
                'year_level',
                'studentId',
                'proofOfEnrollment',
                
                // Location details
                'region',
                'island',
                
                // Squad details
                'squadAbbreviation',
                'squadName',
                'inGameRole',
                'mainHero',
                'rank',
                
                // User type
                'user_type'
            ]);
        });
    }
};