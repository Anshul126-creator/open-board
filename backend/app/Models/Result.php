<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'class_id',
        'center_id',
        'status',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
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
     * Define relationship with students.
     */
    public function students()
    {
        return $this->hasMany(Student::class, 'session_id', 'session_id')
            ->where('class_id', $this->class_id);
    }
}