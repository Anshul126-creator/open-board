<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    /**
     * Get all payments
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $payments = Payment::with('student', 'session', 'center')->get();
        
        return response()->json([
            'success' => true,
            'data' => $payments,
            'message' => 'Payments retrieved successfully'
        ]);
    }

    /**
     * Get single payment
     *
     * @param Payment $payment
     * @return JsonResponse
     */
    public function show(Payment $payment): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $payment->load('student', 'session', 'center'),
            'message' => 'Payment retrieved successfully'
        ]);
    }

    /**
     * Create new payment
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'nullable|date',
            'payment_method' => 'required|string|max:50',
            'transaction_id' => 'nullable|string|max:100',
            'status' => 'required|in:pending,completed,failed,refunded',
            'session_id' => 'required|exists:sessions,id',
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
            $payment = Payment::create($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $payment,
                'message' => 'Payment recorded successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to record payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update payment
     *
     * @param Request $request
     * @param Payment $payment
     * @return JsonResponse
     */
    public function update(Request $request, Payment $payment): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'sometimes|exists:students,id',
            'amount' => 'sometimes|numeric|min:0',
            'payment_date' => 'nullable|date',
            'payment_method' => 'sometimes|string|max:50',
            'transaction_id' => 'nullable|string|max:100',
            'status' => 'sometimes|in:pending,completed,failed,refunded',
            'session_id' => 'sometimes|exists:sessions,id',
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
            $payment->update($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $payment,
                'message' => 'Payment updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete payment
     *
     * @param Payment $payment
     * @return JsonResponse
     */
    public function destroy(Payment $payment): JsonResponse
    {
        try {
            $payment->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Payment deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payments by student
     *
     * @param string $student
     * @return JsonResponse
     */
    public function byStudent(string $student): JsonResponse
    {
        $payments = Payment::where('student_id', $student)
            ->with('session', 'center')
            ->orderBy('payment_date', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $payments,
            'message' => 'Payments retrieved successfully'
        ]);
    }
}