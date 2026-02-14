<?php

namespace App\Http\Controllers;

use App\Models\Mark;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MarkController extends Controller
{
    /**
     * Get all marks
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $marks = Mark::with('student', 'subject', 'session')->get();
        
        return response()->json([
            'success' => true,
            'data' => $marks,
            'message' => 'Marks retrieved successfully'
        ]);
    }

    /**
     * Get single mark
     *
     * @param Mark $mark
     * @return JsonResponse
     */
    public function show(Mark $mark): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $mark->load('student', 'subject', 'session'),
            'message' => 'Mark retrieved successfully'
        ]);
    }

    /**
     * Create new mark
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'required|exists:subjects,id',
            'marks_obtained' => 'required|numeric|min:0',
            'session_id' => 'required|exists:sessions,id',
            'exam_type' => 'required|string|max:50',
            'center_id' => 'required|exists:centers,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $mark = Mark::create($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $mark,
                'message' => 'Mark created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create mark',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk create marks
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function bulkStore(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            '*.student_id' => 'required|exists:students,id',
            '*.subject_id' => 'required|exists:subjects,id',
            '*.marks_obtained' => 'required|numeric|min:0',
            '*.session_id' => 'required|exists:sessions,id',
            '*.exam_type' => 'required|string|max:50',
            '*.center_id' => 'required|exists:centers,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $marks = [];
            foreach ($request->all() as $markData) {
                $marks[] = Mark::create($markData);
            }
            
            return response()->json([
                'success' => true,
                'data' => $marks,
                'message' => 'Marks created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create marks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update mark
     *
     * @param Request $request
     * @param Mark $mark
     * @return JsonResponse
     */
    public function update(Request $request, Mark $mark): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'sometimes|exists:students,id',
            'subject_id' => 'sometimes|exists:subjects,id',
            'marks_obtained' => 'sometimes|numeric|min:0',
            'session_id' => 'sometimes|exists:sessions,id',
            'exam_type' => 'sometimes|string|max:50',
            'center_id' => 'sometimes|exists:centers,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $mark->update($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $mark,
                'message' => 'Mark updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update mark',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete mark
     *
     * @param Mark $mark
     * @return JsonResponse
     */
    public function destroy(Mark $mark): JsonResponse
    {
        try {
            $mark->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Mark deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete mark',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get marks by student
     *
     * @param string $student
     * @return JsonResponse
     */
    public function byStudent(string $student): JsonResponse
    {
        $marks = Mark::where('student_id', $student)
            ->with('subject', 'session')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $marks,
            'message' => 'Marks retrieved successfully'
        ]);
    }

    /**
     * Get marks by subject
     *
     * @param string $subject
     * @return JsonResponse
     */
    public function bySubject(string $subject): JsonResponse
    {
        $marks = Mark::where('subject_id', $subject)
            ->with('student', 'session')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $marks,
            'message' => 'Marks retrieved successfully'
        ]);
    }
}