<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            
            CenterSeeder::class,
            UserSeeder::class,
            ClassSeeder::class,
            SessionSeeder::class,
            SubjectSeeder::class,
            StudentSeeder::class,
            MarkSeeder::class,
            PaymentSeeder::class,
            CertificateSeeder::class,
        ]);
    }
}