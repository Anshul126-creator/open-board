<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'class_id',
        'session_id',
        'max_marks',
        'pass_marks',
        'center_id',
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
        return $this->belongsTo(ClassModel::class);
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
}