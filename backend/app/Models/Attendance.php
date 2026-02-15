<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'session_id',
        'class_id',
        'center_id',
        'date',
        'status',
        'remarks',
        'recorded_by',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public const STATUS_PRESENT = 'present';
    public const STATUS_ABSENT = 'absent';
    public const STATUS_LATE = 'late';
    public const STATUS_EXCUSED = 'excused';

    public static array $statuses = [
        self::STATUS_PRESENT,
        self::STATUS_ABSENT,
        self::STATUS_LATE,
        self::STATUS_EXCUSED,
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
     * Define relationship with class.
     */
    public function class()
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    /**
     * Define relationship with center.
     */
    public function center()
    {
        return $this->belongsTo(Center::class);
    }

    /**
     * Define relationship with user who recorded attendance.
     */
    public function recorder()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}