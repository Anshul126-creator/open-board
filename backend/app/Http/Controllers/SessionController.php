<?php

namespace App\Http\Controllers;

use App\Models\Session;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SessionController extends Controller
{
    /**
     * Get all sessions
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $sessions = Session::with('center', 'students', 'subjects')->get();
        
        return response()->json([
            'success' => true,
            'data' => $sessions,
            'message' => 'Sessions retrieved successfully'
        ]);
    }

    /**
     * Get single session
     *
     * @param Session $session
     * @return JsonResponse
     */
    public function show(Session $session): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $session->load('center', 'students', 'subjects'),
            'message' => 'Session retrieved successfully'
        ]);
    }

    /**
     * Create new session
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:active,upcoming,completed,archived',
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
            $session = Session::create($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $session,
                'message' => 'Session created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create session',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update session
     *
     * @param Request $request
     * @param Session $session
     * @return JsonResponse
     */
    public function update(Request $request, Session $session): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'status' => 'sometimes|in:active,upcoming,completed,archived',
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
            $session->update($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $session,
                'message' => 'Session updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update session',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete session
     *
     * @param Session $session
     * @return JsonResponse
     */
    public function destroy(Session $session): JsonResponse
    {
        try {
            $session->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Session deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete session',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}