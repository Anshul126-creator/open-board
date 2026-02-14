<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Center;

class CenterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Center::create([
            'name' => 'Demo Center',
            'code' => 'DC001',
            'address' => '123 Education Street, Learning City',
            'phone' => '1234567890',
            'email' => 'demo@center.edu',
            'status' => 'active',
        ]);
    }
}