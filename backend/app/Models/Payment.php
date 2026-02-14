<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'amount',
        'payment_date',
        'payment_method',
        'transaction_id',
        'status',
        'session_id',
        'center_id',
    ];

    protected $casts = [
        'payment_date' => 'datetime',
    ];

    /**
     * Define relationship with student.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Define relationship with session.
     */
    public function session()
    {
        return $this->belongsTo(Session::class);
    }

    /**
     * Define relationship with center.
     */
    public function center()
    {
        return $this->belongsTo(Center::class);
    }
}