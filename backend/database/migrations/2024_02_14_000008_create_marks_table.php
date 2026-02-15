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
        Schema::create('marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->decimal('marks_obtained', 5, 2);
            
            // Note: pointing to academic_sessions as per previous fix
            $table->foreignId('session_id')->constrained('academic_sessions')->onDelete('cascade');
            
            $table->string('exam_type'); // midterm, final, etc.
            $table->foreignId('center_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // ADDED: Composite Unique Constraint
            // This prevents duplicate marks for: Student + Subject + Session + Exam Type + Center
            $table->unique(
                ['student_id', 'subject_id', 'session_id', 'exam_type', 'center_id'], 
                'marks_student_subject_session_exam_center_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // It's good practice to drop the unique index before the table
        Schema::table('marks', function (Blueprint $table) {
            if (Schema::hasTable('marks')) {
                $table->dropUnique('marks_student_subject_session_exam_center_unique');
            }
        });

        Schema::dropIfExists('marks');
    }
};