<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicSession extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     * Since we renamed the table to avoid Laravel system conflicts.
     */
    protected $table = 'academic_sessions';

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'status',
        'center_id',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Define relationship with center.
     */
    public function center()
    {
        return $this->belongsTo(Center::class);
    }

    /**
     * Define relationship with students.
     * Note: If Student model uses 'session_id', it works automatically.
     */
    public function students()
    {
        return $this->hasMany(Student::class, 'session_id');
    }

    /**
     * Define relationship with subjects.
     */
    public function subjects()
    {
        return $this->hasMany(Subject::class, 'session_id');
    }
}