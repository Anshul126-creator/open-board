<?php

namespace App\Http\Controllers;

use App\Models\Result;
use App\Models\Mark;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ResultController extends Controller
{
    /**
     * Get all results
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $results = Result::with('student', 'session', 'class', 'center')->get();
        
        return response()->json([
            'success' => true,
            'data' => $results,
            'message' => 'Results retrieved successfully'
        ]);
    }

    /**
     * Get single result
     *
     * @param Result $result
     * @return JsonResponse
     */
    public function show(Result $result): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $result->load('student', 'session', 'class', 'center'),
            'message' => 'Result retrieved successfully'
        ]);
    }

    /**
     * Publish results
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function publish(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'session_id' => 'required|exists:sessions,id',
            'class_id' => 'required|exists:classes,id',
            'center_id' => 'required|exists:centers,id',
            'status' => 'required|in:published,draft',
            'published_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if results already exist
            $existingResult = Result::where([
                'session_id' => $request->session_id,
                'class_id' => $request->class_id,
                'center_id' => $request->center_id,
            ])->first();

            if ($existingResult) {
                $existingResult->update([
                    'status' => $request->status,
                    'published_at' => $request->published_at ?? now(),
                ]);
                
                $result = $existingResult;
            } else {
                $result = Result::create([
                    'session_id' => $request->session_id,
                    'class_id' => $request->class_id,
                    'center_id' => $request->center_id,
                    'status' => $request->status,
                    'published_at' => $request->published_at ?? now(),
                ]);
            }
            
            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Results published successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to publish results',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get result status
     *
     * @param string $session
     * @param string $class
     * @return JsonResponse
     */
    public function status(string $session, string $class): JsonResponse
    {
        $result = Result::where('session_id', $session)
            ->where('class_id', $class)
            ->first();
        
        return response()->json([
            'success' => true,
            'data' => [
                'published' => $result ? true : false,
                'status' => $result ? $result->status : 'not_published',
                'published_at' => $result ? $result->published_at : null,
            ],
            'message' => 'Result status retrieved successfully'
        ]);
    }

    /**
     * Get student results
     *
     * @param string $student
     * @return JsonResponse
     */
    public function studentResults(string $student): JsonResponse
    {
        $marks = Mark::where('student_id', $student)
            ->with('subject', 'session')
            ->get();
        
        $totalMarks = $marks->sum('marks_obtained');
        $totalMaxMarks = $marks->sum(function ($mark) {
            return $mark->subject->max_marks ?? 100;
        });
        
        $percentage = $totalMaxMarks > 0 ? ($totalMarks / $totalMaxMarks) * 100 : 0;
        
        return response()->json([
            'success' => true,
            'data' => [
                'student_id' => $student,
                'marks' => $marks,
                'total_marks' => $totalMarks,
                'total_max_marks' => $totalMaxMarks,
                'percentage' => round($percentage, 2),
                'grade' => $this->calculateGrade($percentage),
                'result' => $percentage >= 35 ? 'Pass' : 'Fail',
            ],
            'message' => 'Student results retrieved successfully'
        ]);
    }

    /**
     * Calculate grade based on percentage
     *
     * @param float $percentage
     * @return string
     */
    private function calculateGrade(float $percentage): string
    {
        if ($percentage >= 90) return 'A+';
        if ($percentage >= 80) return 'A';
        if ($percentage >= 70) return 'B+';
        if ($percentage >= 60) return 'B';
        if ($percentage >= 50) return 'C+';
        if ($percentage >= 40) return 'C';
        if ($percentage >= 35) return 'D';
        return 'F';
    }

    /**
     * Update result
     *
     * @param Request $request
     * @param Result $result
     * @return JsonResponse
     */
    public function update(Request $request, Result $result): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'session_id' => 'sometimes|exists:sessions,id',
            'class_id' => 'sometimes|exists:classes,id',
            'center_id' => 'sometimes|exists:centers,id',
            'status' => 'sometimes|in:published,draft',
            'published_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $result->update($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Result updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update result',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete result
     *
     * @param Result $result
     * @return JsonResponse
     */
    public function destroy(Result $result): JsonResponse
    {
        try {
            $result->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Result deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete result',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}