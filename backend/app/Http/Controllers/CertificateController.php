<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use PDF; // For PDF generation

class CertificateController extends Controller
{
    /**
     * Get all certificates
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $certificates = Certificate::with('student', 'session', 'center')->get();
        
        return response()->json([
            'success' => true,
            'data' => $certificates,
            'message' => 'Certificates retrieved successfully'
        ]);
    }

    /**
     * Get single certificate
     *
     * @param Certificate $certificate
     * @return JsonResponse
     */
    public function show(Certificate $certificate): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $certificate->load('student', 'session', 'center'),
            'message' => 'Certificate retrieved successfully'
        ]);
    }

    /**
     * Generate certificate (supports PDF generation)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'certificate_type' => 'required|in:marksheet,certificate,bonafide,transfer',
            'issue_date' => 'required|date',
            'certificate_number' => 'required|string|max:100|unique:certificates',
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
            // Generate PDF certificate
            $student = \App\Models\Student::with('class', 'center')->find($request->student_id);
            $pdf = $this->generateCertificatePDF($student, $request->all());

            // Save PDF to storage
            $fileName = 'certificates/' . str_replace('/', '_', $request->certificate_number) . '.pdf';
            Storage::disk('public')->put($fileName, $pdf->output());

            $certificate = Certificate::create([
                'student_id' => $request->student_id,
                'certificate_type' => $request->certificate_type,
                'issue_date' => $request->issue_date,
                'certificate_number' => $request->certificate_number,
                'file_path' => $fileName,
                'session_id' => $request->session_id,
                'center_id' => $request->center_id,
            ]);
            
            return response()->json([
                'success' => true,
                'data' => $certificate,
                'message' => 'Certificate generated successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate certificate',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update certificate
     *
     * @param Request $request
     * @param Certificate $certificate
     * @return JsonResponse
     */
    public function update(Request $request, Certificate $certificate): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'sometimes|exists:students,id',
            'certificate_type' => 'sometimes|in:marksheet,certificate,bonafide,transfer',
            'issue_date' => 'sometimes|date',
            'certificate_number' => 'sometimes|string|max:100|unique:certificates,certificate_number,' . $certificate->id,
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
            $certificate->update($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $certificate,
                'message' => 'Certificate updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update certificate',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete certificate
     *
     * @param Certificate $certificate
     * @return JsonResponse
     */
    public function destroy(Certificate $certificate): JsonResponse
    {
        try {
            // Delete PDF file from storage
            if ($certificate->file_path && Storage::disk('public')->exists($certificate->file_path)) {
                Storage::disk('public')->delete($certificate->file_path);
            }

            $certificate->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Certificate deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete certificate',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download certificate PDF
     *
     * @param Certificate $certificate
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function download(Certificate $certificate)
    {
        if (!$certificate->file_path || !Storage::disk('public')->exists($certificate->file_path)) {
            abort(404, 'Certificate file not found');
        }

        return Storage::disk('public')->download($certificate->file_path, 'Certificate_' . $certificate->certificate_number . '.pdf');
    }

    /**
     * Generate certificate PDF
     *
     * @param mixed $student
     * @param array $data
     * @return mixed
     */
    private function generateCertificatePDF($student, array $data)
    {
        $pdf = PDF::loadView('certificates.template', [
            'student' => $student,
            'certificate' => $data,
            'center' => $student->center,
            'class' => $student->class,
        ]);

        return $pdf;
    }
}