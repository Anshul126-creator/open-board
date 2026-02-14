<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    /**
     * Get all students
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $students = Student::with('center', 'class', 'session')->get();
        
        return response()->json([
            'success' => true,
            'data' => $students,
            'message' => 'Students retrieved successfully'
        ]);
    }

    /**
     * Get single student
     *
     * @param Student $student
     * @return JsonResponse
     */
    public function show(Student $student): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $student->load('center', 'class', 'session', 'marks', 'payments', 'certificates'),
            'message' => 'Student retrieved successfully'
        ]);
    }

    /**
     * Get student profile
     *
     * @param Student $student
     * @return JsonResponse
     */
    public function profile(Student $student): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $student->load('center', 'class', 'session', 'marks.subject', 'payments', 'certificates'),
            'message' => 'Student profile retrieved successfully'
        ]);
    }

    /**
     * Create new student
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'center_id' => 'required|exists:centers,id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'class_id' => 'required|exists:classes,id',
            'roll_number' => 'required|string|max:50',
            'session_id' => 'required|exists:sessions,id',
            'father_name' => 'nullable|string|max:255',
            'mother_name' => 'nullable|string|max:255',
            'dob' => 'nullable|date',
            'address' => 'nullable|string',
            'photo' => 'nullable|string',
            'registration_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $student = Student::create($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $student,
                'message' => 'Student created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update student
     *
     * @param Request $request
     * @param Student $student
     * @return JsonResponse
     */
    public function update(Request $request, Student $student): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'center_id' => 'sometimes|exists:centers,id',
            'name' => 'sometimes|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'class_id' => 'sometimes|exists:classes,id',
            'roll_number' => 'sometimes|string|max:50',
            'session_id' => 'sometimes|exists:sessions,id',
            'father_name' => 'nullable|string|max:255',
            'mother_name' => 'nullable|string|max:255',
            'dob' => 'nullable|date',
            'address' => 'nullable|string',
            'photo' => 'nullable|string',
            'registration_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $student->update($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $student,
                'message' => 'Student updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete student
     *
     * @param Student $student
     * @return JsonResponse
     */
    public function destroy(Student $student): JsonResponse
    {
        try {
            $student->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Student deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete student',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}