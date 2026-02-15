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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();

            // Student ID (bigint) – assuming users table uses bigints
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();

            // Session ID (string)
            $table->unsignedBigInteger('session_id');
            $table->foreign('session_id')
                  ->references('id')
                  ->on('academic_sessions')
                  ->cascadeOnDelete();

            // Class ID (bigint)
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();

            // Center ID (bigint)
            $table->foreignId('center_id')->constrained()->cascadeOnDelete();

            // Attendance date
            $table->date('date');

            // Status and remarks
            $table->string('status')->default('present'); // present, absent, late, excused
            $table->text('remarks')->nullable();

            // Who recorded the attendance
            $table->foreignId('recorded_by')->constrained('users')->cascadeOnDelete();

            // Timestamps
            $table->timestamps();

            // Indexes for better performance
            $table->index(['student_id', 'date']);
            $table->index(['class_id', 'date']);
            $table->index(['center_id', 'date']);
            $table->index(['session_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
