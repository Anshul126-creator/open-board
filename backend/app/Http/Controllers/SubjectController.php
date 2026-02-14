<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubjectController extends Controller
{
    /**
     * Get all subjects
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $subjects = Subject::with('center', 'class', 'session', 'marks')->get();
        
        return response()->json([
            'success' => true,
            'data' => $subjects,
            'message' => 'Subjects retrieved successfully'
        ]);
    }

    /**
     * Get single subject
     *
     * @param Subject $subject
     * @return JsonResponse
     */
    public function show(Subject $subject): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $subject->load('center', 'class', 'session', 'marks'),
            'message' => 'Subject retrieved successfully'
        ]);
    }

    /**
     * Create new subject
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:subjects',
            'class_id' => 'required|exists:classes,id',
            'session_id' => 'required|exists:sessions,id',
            'max_marks' => 'required|integer|min:0',
            'pass_marks' => 'required|integer|min:0|lte:max_marks',
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
            $subject = Subject::create($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $subject,
                'message' => 'Subject created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create subject',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update subject
     *
     * @param Request $request
     * @param Subject $subject
     * @return JsonResponse
     */
    public function update(Request $request, Subject $subject): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:50|unique:subjects,code,' . $subject->id,
            'class_id' => 'sometimes|exists:classes,id',
            'session_id' => 'sometimes|exists:sessions,id',
            'max_marks' => 'sometimes|integer|min:0',
            'pass_marks' => 'sometimes|integer|min:0|lte:max_marks',
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
            $subject->update($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $subject,
                'message' => 'Subject updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update subject',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete subject
     *
     * @param Subject $subject
     * @return JsonResponse
     */
    public function destroy(Subject $subject): JsonResponse
    {
        try {
            $subject->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Subject deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete subject',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}