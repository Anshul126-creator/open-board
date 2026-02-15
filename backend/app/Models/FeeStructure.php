<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // Added this

class FeeStructure extends Model
{
    use HasFactory, SoftDeletes; // Added SoftDeletes trait

    protected $fillable = [
        'class_id',
        'session_id',
        'center_id',
        'fee_type',
        'amount',
        'description',
        'due_date',
    ];

    // Optional: Casts for better data handling
    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date',
    ];
}