<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponder
{
    /**
     * Return a success response.
     *
     * @param mixed $data
     * @param string $message
     * @param int $statusCode
     * @return JsonResponse
     */
    protected function successResponse(mixed $data = null, string $message = 'Success', int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message
        ], $statusCode);
    }

    /**
     * Return a created response.
     *
     * @param mixed $data
     * @param string $message
     * @return JsonResponse
     */
    protected function createdResponse(mixed $data = null, string $message = 'Resource created'): JsonResponse
    {
        return $this->successResponse($data, $message, 201);
    }

    /**
     * Return an error response.
     *
     * @param string $message
     * @param string $error
     * @param int $statusCode
     * @param mixed $errors
     * @return JsonResponse
     */
    protected function errorResponse(
        string $message = 'Error',
        string $error = 'api_error',
        int $statusCode = 400,
        mixed $errors = null
    ): JsonResponse {
        $response = [
            'success' => false,
            'message' => $message,
            'error' => $error
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Return a validation error response.
     *
     * @param array $errors
     * @param string $message
     * @return JsonResponse
     */
    protected function validationErrorResponse(array $errors, string $message = 'Validation failed'): JsonResponse
    {
        return $this->errorResponse($message, 'validation_error', 422, $errors);
    }

    /**
     * Return a not found error response.
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function notFoundResponse(string $message = 'Resource not found'): JsonResponse
    {
        return $this->errorResponse($message, 'not_found_error', 404);
    }

    /**
     * Return an unauthorized error response.
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function unauthorizedResponse(string $message = 'Unauthenticated'): JsonResponse
    {
        return $this->errorResponse($message, 'authentication_error', 401);
    }

    /**
     * Return a forbidden error response.
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function forbiddenResponse(string $message = 'Forbidden'): JsonResponse
    {
        return $this->errorResponse($message, 'authorization_error', 403);
    }

    /**
     * Return a server error response.
     *
     * @param string $message
     * @param string $error
     * @return JsonResponse
     */
    protected function serverErrorResponse(string $message = 'Server Error', string $error = 'server_error'): JsonResponse
    {
        return $this->errorResponse($message, $error, 500);
    }

    /**
     * Return a conflict error response.
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function conflictResponse(string $message = 'Conflict'): JsonResponse
    {
        return $this->errorResponse($message, 'conflict_error', 409);
    }

    /**
     * Return a response with pagination.
     *
     * @param mixed $data
     * @param string $message
     * @param int $statusCode
     * @return JsonResponse
     */
    protected function paginatedResponse(mixed $data, string $message = 'Success', int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data->items(),
            'meta' => [
                'current_page' => $data->currentPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
                'last_page' => $data->lastPage(),
            ],
            'message' => $message
        ], $statusCode);
    }
}