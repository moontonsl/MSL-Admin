<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AdminUser::create([
            'name' => 'Super Admin',
            'email' => 'admin@msl.com',
            'password' => Hash::make('admin123'),
            'role' => 'super_admin',
            'email_verified_at' => now(),
        ]);

        AdminUser::create([
            'name' => 'Content Manager',
            'email' => 'content@msl.com',
            'password' => Hash::make('content123'),
            'role' => 'content_admin',
            'email_verified_at' => now(),
        ]);
    }
}