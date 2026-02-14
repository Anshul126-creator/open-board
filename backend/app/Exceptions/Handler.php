<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Auth\Access\AuthorizationException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        $this->renderable(function (AuthenticationException $e, $request) {
            return $this->unauthenticated($request, $e);
        });

        $this->renderable(function (ValidationException $e, $request) {
            return $this->convertValidationExceptionToResponse($e, $request);
        });

        $this->renderable(function (ModelNotFoundException $e, $request) {
            return $this->handleModelNotFound($e, $request);
        });

        $this->renderable(function (NotFoundHttpException $e, $request) {
            return $this->handleNotFoundHttpException($e, $request);
        });

        $this->renderable(function (MethodNotAllowedHttpException $e, $request) {
            return $this->handleMethodNotAllowed($e, $request);
        });

        $this->renderable(function (AuthorizationException $e, $request) {
            return $this->handleAuthorizationException($e, $request);
        });

        $this->renderable(function (HttpException $e, $request) {
            return $this->handleHttpException($e, $request);
        });

        $this->renderable(function (Throwable $e, $request) {
            return $this->handleGenericException($e, $request);
        });
    }

    /**
     * Convert an authentication exception into a response.
     */
    protected function unauthenticated($request, AuthenticationException $exception): Response
    {
        return response()->json([
            'success' => false,
            'message' => $exception->getMessage() ?? 'Unauthenticated',
            'error' => 'Authentication required'
        ], 401);
    }

    /**
     * Convert a validation exception into a response.
     */
    protected function convertValidationExceptionToResponse(ValidationException $e, $request): Response
    {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $e->errors(),
            'error' => 'Validation error'
        ], 422);
    }

    /**
     * Handle model not found exception.
     */
    protected function handleModelNotFound(ModelNotFoundException $e, $request): Response
    {
        return response()->json([
            'success' => false,
            'message' => 'Resource not found',
            'error' => 'The requested resource does not exist'
        ], 404);
    }

    /**
     * Handle not found HTTP exception.
     */
    protected function handleNotFoundHttpException(NotFoundHttpException $e, $request): Response
    {
        return response()->json([
            'success' => false,
            'message' => 'Endpoint not found',
            'error' => 'The requested URL was not found on this server'
        ], 404);
    }

    /**
     * Handle method not allowed exception.
     */
    protected function handleMethodNotAllowed(MethodNotAllowedHttpException $e, $request): Response
    {
        return response()->json([
            'success' => false,
            'message' => 'Method not allowed',
            'error' => 'The HTTP method is not supported for this endpoint'
        ], 405);
    }

    /**
     * Handle authorization exception.
     */
    protected function handleAuthorizationException(AuthorizationException $e, $request): Response
    {
        return response()->json([
            'success' => false,
            'message' => 'Forbidden',
            'error' => 'You do not have permission to access this resource'
        ], 403);
    }

    /**
     * Handle HTTP exceptions.
     */
    protected function handleHttpException(HttpException $e, $request): Response
    {
        return response()->json([
            'success' => false,
            'message' => 'HTTP Error',
            'error' => $e->getMessage()
        ], $e->getStatusCode());
    }

    /**
     * Handle generic exceptions.
     */
    protected function handleGenericException(Throwable $e, $request): Response
    {
        $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
        
        return response()->json([
            'success' => false,
            'message' => 'Server Error',
            'error' => config('app.debug') ? $e->getMessage() : 'An unexpected error occurred',
            'file' => config('app.debug') ? $e->getFile() : null,
            'line' => config('app.debug') ? $e->getLine() : null,
            'trace' => config('app.debug') ? $e->getTrace() : null
        ], $statusCode);
    }
}