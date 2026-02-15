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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();

            // FIX: Changed from cascade to restrict to prevent data loss
            $table->foreignId('student_id')->constrained()->restrictOnDelete();
            
            $table->string('certificate_type'); // marksheet, certificate, etc.
            $table->date('issue_date');
            $table->string('certificate_number')->unique();
            $table->string('file_path');

            // FIX: Reference academic_sessions (per our previous table rename)
            // and prevent deletion if certificates are issued for that session.
            $table->foreignId('session_id')->constrained('academic_sessions')->restrictOnDelete();

            // FIX: Prevent center deletion if they have issued certificates
            $table->foreignId('center_id')->constrained()->restrictOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};