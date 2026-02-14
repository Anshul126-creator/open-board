<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CenterController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\MarkController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\FeeStructureController;
use App\Http\Controllers\TimetableController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\CertificateController;

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');
});

// Protected Routes
Route::middleware('auth:api')->group(function () {
    // Center Routes
    Route::apiResource('centers', CenterController::class);
    Route::put('centers/{center}/status', [CenterController::class, 'updateStatus']);

    // Student Routes
    Route::apiResource('students', StudentController::class);
    Route::get('students/{student}/profile', [StudentController::class, 'profile']);

    // Marks Routes
    Route::apiResource('marks', MarkController::class);
    Route::post('marks/bulk', [MarkController::class, 'bulkStore']);
    Route::get('marks/student/{student}', [MarkController::class, 'byStudent']);
    Route::get('marks/subject/{subject}', [MarkController::class, 'bySubject']);

    // Payment Routes
    Route::apiResource('payments', PaymentController::class);
    Route::get('payments/student/{student}', [PaymentController::class, 'byStudent']);

    // Session Routes
    Route::apiResource('sessions', SessionController::class);

    // Class Routes
    Route::apiResource('classes', ClassController::class);

    // Subject Routes
    Route::apiResource('subjects', SubjectController::class);

    // Fee Structure Routes
    Route::apiResource('fee-structures', FeeStructureController::class);

    // Timetable Routes
    Route::apiResource('timetables', TimetableController::class);
    Route::get('timetables/download/{timetable}', [TimetableController::class, 'download']);

    // Result Routes
    Route::apiResource('results', ResultController::class);
    Route::post('results/publish', [ResultController::class, 'publish']);
    Route::get('results/{session}/{class}', [ResultController::class, 'status']);
    Route::get('results/student/{student}', [ResultController::class, 'studentResults']);

    // Certificate Routes
    Route::apiResource('certificates', CertificateController::class);
    Route::get('certificates/download/{certificate}', [CertificateController::class, 'download']);
});

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'healthy']);
});