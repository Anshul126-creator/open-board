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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            
            // FIX: Prevent student deletion if they have payment records
            $table->foreignId('student_id')->constrained()->restrictOnDelete();
            
            $table->decimal('amount', 10, 2);
            $table->timestamp('payment_date')->useCurrent();
            $table->string('payment_method');
            $table->string('transaction_id')->nullable();
            $table->string('status')->default('completed');

            // FIX: Prevent session deletion if payments are linked to it
            // Points to 'academic_sessions' per previous table rename
            $table->foreignId('session_id')->constrained('academic_sessions')->restrictOnDelete();

            // FIX: Prevent center deletion if it has financial history
            $table->foreignId('center_id')->constrained()->restrictOnDelete();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};