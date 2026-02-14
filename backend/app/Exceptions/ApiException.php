<?php

namespace App\Exceptions;

use Exception;
use Symfony\Component\HttpFoundation\Response;

class ApiException extends Exception
{
    /**
     * The HTTP status code.
     *
     * @var int
     */
    protected $statusCode;

    /**
     * The error code.
     *
     * @var string
     */
    protected $errorCode;

    /**
     * Create a new API exception instance.
     *
     * @param string $message
     * @param int $statusCode
     * @param string $errorCode
     * @param int $code
     * @param Throwable|null $previous
     */
    public function __construct(
        string $message = "API Error",
        int $statusCode = Response::HTTP_BAD_REQUEST,
        string $errorCode = "api_error",
        int $code = 0,
        \Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
        $this->statusCode = $statusCode;
        $this->errorCode = $errorCode;
    }

    /**
     * Get the HTTP status code.
     *
     * @return int
     */
    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    /**
     * Get the error code.
     *
     * @return string
     */
    public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    /**
     * Render the exception into an HTTP response.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function render()
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
            'error' => $this->errorCode,
            'status_code' => $this->statusCode
        ], $this->statusCode);
    }

    /**
     * Create a validation exception.
     *
     * @param string $message
     * @param array $errors
     * @return static
     */
    public static function validation(string $message = "Validation failed", array $errors = []): self
    {
        $exception = new static($message, Response::HTTP_UNPROCESSABLE_ENTITY, 'validation_error');
        $exception->errors = $errors;
        return $exception;
    }

    /**
     * Create an authentication exception.
     *
     * @param string $message
     * @return static
     */
    public static function authentication(string $message = "Unauthenticated"): self
    {
        return new static($message, Response::HTTP_UNAUTHORIZED, 'authentication_error');
    }

    /**
     * Create an authorization exception.
     *
     * @param string $message
     * @return static
     */
    public static function authorization(string $message = "Forbidden"): self
    {
        return new static($message, Response::HTTP_FORBIDDEN, 'authorization_error');
    }

    /**
     * Create a not found exception.
     *
     * @param string $message
     * @return static
     */
    public static function notFound(string $message = "Resource not found"): self
    {
        return new static($message, Response::HTTP_NOT_FOUND, 'not_found_error');
    }

    /**
     * Create a conflict exception.
     *
     * @param string $message
     * @return static
     */
    public static function conflict(string $message = "Conflict"): self
    {
        return new static($message, Response::HTTP_CONFLICT, 'conflict_error');
    }

    /**
     * Create a server error exception.
     *
     * @param string $message
     * @return static
     */
    public static function serverError(string $message = "Server Error"): self
    {
        return new static($message, Response::HTTP_INTERNAL_SERVER_ERROR, 'server_error');
    }
}