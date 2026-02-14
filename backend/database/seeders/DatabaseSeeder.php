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
            UserSeeder::class,
            CenterSeeder::class,
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