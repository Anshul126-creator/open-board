<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeeStructure extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id',
        'session_id',
        'center_id',
        'fee_type',
        'amount',
        'description',
        'due_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date',
    ];

    /**
     * Define relationship with center.
     */
    public function center()
    {
        return $this->belongsTo(Center::class);
    }

    /**
     * Define relationship with class.
     */
    public function class()
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    /**
     * Define relationship with session.
     */
    public function session()
    {
        return $this->belongsTo(Session::class);
    }
}