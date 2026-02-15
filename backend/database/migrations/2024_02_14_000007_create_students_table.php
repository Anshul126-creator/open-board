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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('center_id');
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->unsignedBigInteger('class_id');
            $table->string('roll_number');
            $table->unsignedBigInteger('session_id');
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->date('dob')->nullable();
            $table->text('address')->nullable();
            $table->string('photo')->nullable();
            $table->timestamp('registration_date')->useCurrent();
            $table->timestamps();

            // ADDED: Composite unique index
            // This ensures a roll number can only exist once per Class + Session combination.
            $table->unique(['class_id', 'session_id', 'roll_number'], 'students_roll_unique');
        });

        Schema::table('students', function (Blueprint $table) {
            $table->foreign('center_id')->references('id')->on('centers')->onDelete('cascade');
            $table->foreign('class_id')->references('id')->on('classes')->onDelete('restrict');
            $table->foreign('session_id')->references('id')->on('academic_sessions')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // Drop the unique index before dropping the table
            $table->dropUnique('students_roll_unique');
        });

        Schema::dropIfExists('students');
    }
};