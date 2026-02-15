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
        Schema::create('fee_structures', function (Blueprint $table) {
            $table->id();
            
            // Change onDelete('cascade') to restrictOnDelete()
            $table->unsignedBigInteger('class_id');
            $table->unsignedBigInteger('session_id');
            $table->unsignedBigInteger('center_id');

            $table->string('fee_type');
            $table->decimal('amount', 10, 2);
            $table->text('description')->nullable();
            $table->date('due_date')->nullable();
            
            // Optional: Add Soft Deletes for even better history preservation
            $table->softDeletes(); 
            $table->timestamps();
        });

        Schema::table('fee_structures', function (Blueprint $table) {
            $table->foreign('class_id')->references('id')->on('classes')->onDelete('restrict');
            $table->foreign('session_id')->references('id')->on('academic_sessions')->onDelete('restrict');
            $table->foreign('center_id')->references('id')->on('centers')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fee_structures');
    }
};