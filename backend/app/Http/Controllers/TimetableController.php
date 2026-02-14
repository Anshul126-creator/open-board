<?php

namespace App\Http\Controllers;

use App\Models\Timetable;
use App\Exceptions\ApiException;
use App\Exceptions\FileUploadException;
use App\Traits\ApiResponder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class TimetableController extends Controller
{
    use ApiResponder;
{
    /**
     * Get all timetables
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $timetables = Timetable::with('center', 'class', 'session')->get();
        
        return response()->json([
            'success' => true,
            'data' => $timetables,
            'message' => 'Timetables retrieved successfully'
        ]);
    }

    /**
     * Get single timetable
     *
     * @param Timetable $timetable
     * @return JsonResponse
     */
    public function show(Timetable $timetable): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $timetable->load('center', 'class', 'session'),
            'message' => 'Timetable retrieved successfully'
        ]);
    }

    /**
     * Upload timetable file (supports PDF and other formats)
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
            'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx|csv|max:5120',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            /** @var UploadedFile $file */
            $file = $request->file('file');
            
            // Validate file size (5MB max)
            if ($file->getSize() > 5 * 1024 * 1024) {
                throw FileUploadException::fileTooLarge('5MB');
            }
            
            $filePath = $file->store('timetables', 'public');

            $timetable = Timetable::create([
                'class_id' => $request->class_id,
                'session_id' => $request->session_id,
                'center_id' => $request->center_id,
                'file_path' => $filePath,
                'file_name' => $file->getClientOriginalName(),
                'file_type' => $file->getClientOriginalExtension(),
                'file_size' => $file->getSize(),
                'description' => $request->description,
            ]);
            
            return $this->createdResponse($timetable, 'Timetable uploaded successfully');
        } catch (FileUploadException $e) {
            return $e->render();
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to upload timetable', 'upload_error');
        }
    }

    /**
     * Update timetable
     *
     * @param Request $request
     * @param Timetable $timetable
     * @return JsonResponse
     */
    public function update(Request $request, Timetable $timetable): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'class_id' => 'sometimes|exists:classes,id',
            'session_id' => 'sometimes|exists:sessions,id',
            'center_id' => 'sometimes|exists:centers,id',
            'file' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,csv|max:5120',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->except('file');

            if ($request->hasFile('file')) {
                // Delete old file
                if ($timetable->file_path && Storage::disk('public')->exists($timetable->file_path)) {
                    Storage::disk('public')->delete($timetable->file_path);
                }

                /** @var UploadedFile $file */
                $file = $request->file('file');
                $filePath = $file->store('timetables', 'public');

                $data['file_path'] = $filePath;
                $data['file_name'] = $file->getClientOriginalName();
                $data['file_type'] = $file->getClientOriginalExtension();
                $data['file_size'] = $file->getSize();
            }

            $timetable->update($data);
            
            return response()->json([
                'success' => true,
                'data' => $timetable,
                'message' => 'Timetable updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update timetable',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete timetable
     *
     * @param Timetable $timetable
     * @return JsonResponse
     */
    public function destroy(Timetable $timetable): JsonResponse
    {
        try {
            // Delete file from storage
            if ($timetable->file_path && Storage::disk('public')->exists($timetable->file_path)) {
                Storage::disk('public')->delete($timetable->file_path);
            }

            $timetable->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Timetable deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete timetable',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download timetable file (supports PDF and other formats)
     *
     * @param Timetable $timetable
     * @return \Symfony\Component\HttpFoundation\StreamedResponse|JsonResponse
     */
    public function download(Timetable $timetable)
    {
        try {
            if (!$timetable->file_path || !Storage::disk('public')->exists($timetable->file_path)) {
                throw FileUploadException::fileNotFound();
            }

            return Storage::disk('public')->download($timetable->file_path, $timetable->file_name);
        } catch (FileUploadException $e) {
            return $e->render();
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to download file', 'download_error');
        }
    }
}