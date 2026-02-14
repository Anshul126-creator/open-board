<?php

namespace App\Http\Controllers;

use App\Models\ClassModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClassController extends Controller
{
    /**
     * Get all classes
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $classes = ClassModel::with('center', 'students', 'subjects')->get();
        
        return response()->json([
            'success' => true,
            'data' => $classes,
            'message' => 'Classes retrieved successfully'
        ]);
    }

    /**
     * Get single class
     *
     * @param ClassModel $class
     * @return JsonResponse
     */
    public function show(ClassModel $class): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $class->load('center', 'students', 'subjects'),
            'message' => 'Class retrieved successfully'
        ]);
    }

    /**
     * Create new class
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:classes',
            'description' => 'nullable|string',
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
            $class = ClassModel::create($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $class,
                'message' => 'Class created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create class',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update class
     *
     * @param Request $request
     * @param ClassModel $class
     * @return JsonResponse
     */
    public function update(Request $request, ClassModel $class): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:50|unique:classes,code,' . $class->id,
            'description' => 'nullable|string',
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
            $class->update($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $class,
                'message' => 'Class updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update class',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete class
     *
     * @param ClassModel $class
     * @return JsonResponse
     */
    public function destroy(ClassModel $class): JsonResponse
    {
        try {
            $class->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Class deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete class',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}