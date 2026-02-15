<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    /**
     * Get all attendance records
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Attendance::with(['student', 'session', 'class', 'center', 'recorder']);

            // Filter by center if user is not admin
            if (!Auth::user()->isAdmin()) {
                $query->where('center_id', Auth::user()->center_id);
            }

            // Apply filters
            if ($request->has('student_id')) {
                $query->where('student_id', $request->student_id);
            }

            if ($request->has('class_id')) {
                $query->where('class_id', $request->class_id);
            }

            if ($request->has('session_id')) {
                $query->where('session_id', $request->session_id);
            }

            if ($request->has('date')) {
                $query->where('date', $request->date);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $attendances = $query->orderBy('date', 'desc')->paginate(50);

            return response()->json([
                'success' => true,
                'data' => $attendances,
                'message' => 'Attendance records retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve attendance records',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new attendance record
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'student_id' => 'required|exists:students,id',
                'session_id' => 'required|exists:sessions,id',
                'class_id' => 'required|exists:classes,id',
                'date' => 'required|date',
                'status' => 'required|in:present,absent,late,excused',
                'remarks' => 'nullable|string|max:255',
            ]);

            // Set center_id and recorded_by based on user's context
            $validated['center_id'] = Auth::user()->center_id;
            $validated['recorded_by'] = Auth::id();

            $attendance = Attendance::create($validated);

            return response()->json([
                'success' => true,
                'data' => $attendance->load(['student', 'session', 'class', 'center', 'recorder']),
                'message' => 'Attendance record created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create attendance record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk create attendance records
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function bulkStore(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'attendances' => 'required|array',
                'attendances.*.student_id' => 'required|exists:students,id',
                'attendances.*.session_id' => 'required|exists:sessions,id',
                'attendances.*.class_id' => 'required|exists:classes,id',
                'attendances.*.date' => 'required|date',
                'attendances.*.status' => 'required|in:present,absent,late,excused',
                'attendances.*.remarks' => 'nullable|string|max:255',
            ]);

            $centerId = Auth::user()->center_id;
            $recordedBy = Auth::id();
            $createdAttendances = [];

            foreach ($validated['attendances'] as $attendanceData) {
                $attendanceData['center_id'] = $centerId;
                $attendanceData['recorded_by'] = $recordedBy;

                $attendance = Attendance::create($attendanceData);
                $createdAttendances[] = $attendance;
            }

            return response()->json([
                'success' => true,
                'data' => $createdAttendances,
                'message' => 'Bulk attendance records created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create bulk attendance records',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get attendance record by ID
     *
     * @param Attendance $attendance
     * @return JsonResponse
     */
    public function show(Attendance $attendance): JsonResponse
    {
        try {
            // Check authorization
            if (!Auth::user()->isAdmin() && $attendance->center_id !== Auth::user()->center_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to this attendance record'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $attendance->load(['student', 'session', 'class', 'center', 'recorder']),
                'message' => 'Attendance record retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve attendance record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update attendance record
     *
     * @param Request $request
     * @param Attendance $attendance
     * @return JsonResponse
     */
    public function update(Request $request, Attendance $attendance): JsonResponse
    {
        try {
            // Check authorization
            if (!Auth::user()->isAdmin() && $attendance->center_id !== Auth::user()->center_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to this attendance record'
                ], 403);
            }

            $validated = $request->validate([
                'status' => 'sometimes|in:present,absent,late,excused',
                'remarks' => 'nullable|string|max:255',
            ]);

            $attendance->update($validated);

            return response()->json([
                'success' => true,
                'data' => $attendance->load(['student', 'session', 'class', 'center', 'recorder']),
                'message' => 'Attendance record updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update attendance record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete attendance record
     *
     * @param Attendance $attendance
     * @return JsonResponse
     */
    public function destroy(Attendance $attendance): JsonResponse
    {
        try {
            // Check authorization
            if (!Auth::user()->isAdmin() && $attendance->center_id !== Auth::user()->center_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to this attendance record'
                ], 403);
            }

            $attendance->delete();

            return response()->json([
                'success' => true,
                'message' => 'Attendance record deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete attendance record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get attendance summary for a student
     *
     * @param int $studentId
     * @return JsonResponse
     */
    public function studentSummary(int $studentId): JsonResponse
    {
        try {
            $query = Attendance::where('student_id', $studentId);

            // Filter by center if user is not admin
            if (!Auth::user()->isAdmin()) {
                $query->where('center_id', Auth::user()->center_id);
            }

            $summary = $query->selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get();

            $total = $query->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'summary' => $summary,
                    'total' => $total,
                    'student_id' => $studentId
                ],
                'message' => 'Attendance summary retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve attendance summary',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get attendance summary for a class
     *
     * @param int $classId
     * @return JsonResponse
     */
    public function classSummary(int $classId): JsonResponse
    {
        try {
            $query = Attendance::where('class_id', $classId);

            // Filter by center if user is not admin
            if (!Auth::user()->isAdmin()) {
                $query->where('center_id', Auth::user()->center_id);
            }

            $summary = $query->selectRaw('date, status, COUNT(*) as count')
                ->groupBy(['date', 'status'])
                ->orderBy('date', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $summary,
                'message' => 'Class attendance summary retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve class attendance summary',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}