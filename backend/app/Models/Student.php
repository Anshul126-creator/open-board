<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'center_id',
        'name',
        'email',
        'phone',
        'class_id',
        'roll_number',
        'session_id',
        'father_name',
        'mother_name',
        'dob',
        'address',
        'photo',
        'registration_date',
    ];

    protected $casts = [
        'dob' => 'date',
        'registration_date' => 'datetime',
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

    /**
     * Define relationship with marks.
     */
    public function marks()
    {
        return $this->hasMany(Mark::class);
    }

    /**
     * Define relationship with payments.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Define relationship with certificates.
     */
    public function certificates()
    {
        return $this->hasMany(Certificate::class);
    }

    /**
     * Get the student's full name.
     */
    public function getFullNameAttribute(): string
    {
        return $this->name;
    }

    /**
     * Get the student's age.
     */
    public function getAgeAttribute(): int
    {
        return $this->dob ? $this->dob->age : 0;
    }
}