<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EducationLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $levels = [
            'Undergraduate',
            'Graduate program',
            'Senior High School',
            'National Certificates',
            'Associates',
            'Diploma',
            'Certificate'
        ];

        foreach ($levels as $level) {
            DB::table('education_levels')->insert([
                'name' => $level,
                'slug' => Str::slug($level),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
} 