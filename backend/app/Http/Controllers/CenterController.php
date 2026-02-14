<?php

namespace App\Http\Controllers;

use App\Models\Center;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CenterController extends Controller
{
    /**
     * Get all centers
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $centers = Center::with('users')->get();
        
        return response()->json([
            'success' => true,
            'data' => $centers,
            'message' => 'Centers retrieved successfully'
        ]);
    }

    /**
     * Get single center
     *
     * @param Center $center
     * @return JsonResponse
     */
    public function show(Center $center): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $center->load('users', 'students'),
            'message' => 'Center retrieved successfully'
        ]);
    }

    /**
     * Create new center
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:centers',
            'address' => 'required|string',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'status' => 'required|in:active,pending,suspended',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $center = Center::create($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $center,
                'message' => 'Center created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create center',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update center
     *
     * @param Request $request
     * @param Center $center
     * @return JsonResponse
     */
    public function update(Request $request, Center $center): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:50|unique:centers,code,' . $center->id,
            'address' => 'sometimes|string',
            'phone' => 'sometimes|string|max:20',
            'email' => 'sometimes|email|max:255',
            'status' => 'sometimes|in:active,pending,suspended',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $center->update($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $center,
                'message' => 'Center updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update center',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update center status
     *
     * @param Request $request
     * @param Center $center
     * @return JsonResponse
     */
    public function updateStatus(Request $request, Center $center): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,pending,suspended',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $center->update(['status' => $request->status]);
            
            return response()->json([
                'success' => true,
                'data' => $center,
                'message' => 'Center status updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update center status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete center
     *
     * @param Center $center
     * @return JsonResponse
     */
    public function destroy(Center $center): JsonResponse
    {
        try {
            $center->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Center deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete center',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}