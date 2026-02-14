<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Timetable extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id',
        'session_id',
        'center_id',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
        'description',
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
     * Get the file URL attribute.
     */
    public function getFileUrlAttribute(): string
    {
        return asset('storage/' . $this->file_path);
    }
}