<?php

namespace App\Http\Controllers;

use App\Models\FeeStructure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FeeStructureController extends Controller
{
    /**
     * Get all fee structures
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $feeStructures = FeeStructure::with('center', 'class', 'session')->get();
        
        return response()->json([
            'success' => true,
            'data' => $feeStructures,
            'message' => 'Fee structures retrieved successfully'
        ]);
    }

    /**
     * Get single fee structure
     *
     * @param FeeStructure $feeStructure
     * @return JsonResponse
     */
    public function show(FeeStructure $feeStructure): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $feeStructure->load('center', 'class', 'session'),
            'message' => 'Fee structure retrieved successfully'
        ]);
    }

    /**
     * Create new fee structure
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'class_id' => 'required|exists:classes,id',
            'session_id' => 'required|exists:sessions,id',
            'center_id' => 'required|exists:centers,id',
            'fee_type' => 'required|string|max:100',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $feeStructure = FeeStructure::create($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $feeStructure,
                'message' => 'Fee structure created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create fee structure',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update fee structure
     *
     * @param Request $request
     * @param FeeStructure $feeStructure
     * @return JsonResponse
     */
    public function update(Request $request, FeeStructure $feeStructure): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'class_id' => 'sometimes|exists:classes,id',
            'session_id' => 'sometimes|exists:sessions,id',
            'center_id' => 'sometimes|exists:centers,id',
            'fee_type' => 'sometimes|string|max:100',
            'amount' => 'sometimes|numeric|min:0',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $feeStructure->update($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $feeStructure,
                'message' => 'Fee structure updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update fee structure',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete fee structure
     *
     * @param FeeStructure $feeStructure
     * @return JsonResponse
     */
    public function destroy(FeeStructure $feeStructure): JsonResponse
    {
        try {
            $feeStructure->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Fee structure deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete fee structure',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}