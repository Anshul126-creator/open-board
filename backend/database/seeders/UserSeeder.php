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
        // Admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@edu.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'center_id' => null,
        ]);

        // Center user
        User::create([
            'name' => 'Center User',
            'email' => 'center1@edu.com',
            'password' => Hash::make('center123'),
            'role' => 'center',
            'center_id' => 1, // Will be set after centers are created
        ]);

        // Student user
        User::create([
            'name' => 'Student User',
            'email' => 'student@edu.com',
            'password' => Hash::make('student123'),
            'role' => 'student',
            'center_id' => 1, // Will be set after centers are created
        ]);
    }
}