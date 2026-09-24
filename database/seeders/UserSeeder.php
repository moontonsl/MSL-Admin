<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $universities = [
            'University of Southern Mindanao-Kabacan Campus',
            'Polytechnic University of the Philippines-Quezon City Campus',
            'STI College-Lucena',
            'Cotabato State University',
            'Central Mindanao University'
        ];

        $universityRegions = [
            'University of Southern Mindanao-Kabacan Campus' => 'Region XII',
            'Polytechnic University of the Philippines-Quezon City Campus' => 'NCR',
            'STI College-Lucena' => 'Region IV-A',
            'Cotabato State University' => 'BARMM',
            'Central Mindanao University' => 'Region X'
        ];

        // Use withoutEvents to prevent triggering Google Sheets sync jobs during database seeding
        User::withoutEvents(function () use ($universities, $universityRegions) {
            // 1. Create 30 Students (6 per University)
            $this->command->info('Seeding 30 Students (Betatest1 to Betatest30)...');
            for ($i = 1; $i <= 30; $i++) {
                // Distribute students evenly among the 5 universities (6 per university)
                $univIndex = (int) (($i - 1) / 6);
                $univ = $universities[$univIndex];
                $region = $universityRegions[$univ];

                // Generate padded student IDs like 2026-0001 to 2026-0030
                $studentIdStr = '2026-' . str_pad($i, 4, '0', STR_PAD_LEFT);

                // generate sequential ml_id (40404201 to 40404230) and ml_server (3001 to 3030)
                $mlId = 40404200 + $i;
                $mlServer = 3000 + $i;

                User::create([
                    'name' => 'Betatest' . $i,
                    'surname' => 'Surname' . $i,
                    'username' => 'betatest' . $i,
                    'email' => 'betatest' . $i . '@gmail.com',
                    'password' => Hash::make('12345678'),
                    'ml_id' => (string) $mlId,
                    'ml_server' => (string) $mlServer,
                    'ml_ign' => 'betatest' . $i,
                    'course' => 'BS in Entrepreneurship (BS Entrep)',
                    'university' => $univ,
                    'year_level' => 'Freshmen (1st Yr)',
                    'studentId' => $studentIdStr,
                    'role' => 'Student',
                    'state' => 'Verified',
                    'verified_by' => 10120,
                    'verified_date' => '2025-09-28 11:10:25',
                    'status' => 'active',
                    'birthday' => '2007-09-07',
                    'age' => 18,
                    'gender' => 'male',
                    'contact_number' => '09393939393',
                    'facebook_link' => 'https://www.facebook.com',
                    'region' => $region,
                ]);
            }

            // 2. Create 5 Student Leaders (SL) (1 per University)
            $this->command->info('Seeding 5 Student Leaders (BetatestSL1 to BetatestSL5)...');
            for ($i = 1; $i <= 5; $i++) {
                $univ = $universities[$i - 1];
                $region = $universityRegions[$univ];

                // Generate padded student IDs like 2026-0101 to 2026-0105
                $studentIdStr = '2026-010' . $i;

                // generate sequential ml_id (40404231 to 40404235) and ml_server (3031 to 3035)
                $mlId = 40404230 + $i;
                $mlServer = 3030 + $i;

                User::create([
                    'name' => 'BetatestSL' . $i,
                    'surname' => 'SLSurname' . $i,
                    'username' => 'betatestsl' . $i,
                    'email' => 'betatestsl' . $i . '@gmail.com',
                    'password' => Hash::make('12345678'),
                    'ml_id' => (string) $mlId,
                    'ml_server' => (string) $mlServer,
                    'ml_ign' => 'betatestsl' . $i,
                    'course' => 'BS in Entrepreneurship (BS Entrep)',
                    'university' => $univ,
                    'year_level' => 'Freshmen (1st Yr)',
                    'studentId' => $studentIdStr,
                    'role' => 'SL',
                    'state' => 'Verified',
                    'verified_by' => 10120,
                    'verified_date' => '2025-09-28 11:10:25',
                    'status' => 'active',
                    'birthday' => '2007-09-07',
                    'age' => 18,
                    'gender' => 'male',
                    'contact_number' => '09393939393',
                    'facebook_link' => 'https://www.facebook.com',
                    'region' => $region,
                ]);
            }
        });

        $this->command->info('UserSeeding completed successfully!');
    }
}
