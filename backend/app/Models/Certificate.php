<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'certificate_type',
        'issue_date',
        'certificate_number',
        'file_path',
        'session_id',
        'center_id',
    ];

    protected $casts = [
        'issue_date' => 'date',
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