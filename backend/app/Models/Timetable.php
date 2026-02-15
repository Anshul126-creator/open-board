<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
     * Casts for attributes.
     * Ensuring file_size is treated as a large integer and IDs are correct.
     */
    protected $casts = [
        'file_size' => 'integer',
        'class_id'  => 'integer',
        'session_id' => 'integer',
        'center_id' => 'integer',
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
     * Note: Ensure your Class model is actually named 'ClassModel'.
     */
    public function academicClass()
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    /**
     * Define relationship with session.
     * Updated to point to the renamed AcademicSession model.
     */
    public function session()
    {
        return $this->belongsTo(AcademicSession::class, 'session_id');
    }

    /**
     * Get the file URL attribute.
     * Using Storage::url is safer than asset() for different drivers (s3, public, etc).
     */
    public function getFileUrlAttribute(): string
    {
        return Storage::url($this->file_path);
    }

    /**
     * Helper to get a human-readable file size (e.g., 2.5 MB).
     */
    public function getHumanSizeAttribute(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        for ($i = 0; $bytes > 1024; $i++) $bytes /= 1024;
        return round($bytes, 2) . ' ' . $units[$i];
    }
}