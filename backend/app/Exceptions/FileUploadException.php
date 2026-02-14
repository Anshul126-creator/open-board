<?php

namespace App\Exceptions;

use Symfony\Component\HttpFoundation\Response;

class FileUploadException extends ApiException
{
    /**
     * Create a new file upload exception.
     *
     * @param string $message
     * @param int $statusCode
     * @param string $errorCode
     */
    public function __construct(
        string $message = "File upload failed",
        int $statusCode = Response::HTTP_BAD_REQUEST,
        string $errorCode = "file_upload_error"
    ) {
        parent::__construct($message, $statusCode, $errorCode);
    }

    /**
     * Create an exception for invalid file type.
     *
     * @param string $allowedTypes
     * @return static
     */
    public static function invalidFileType(string $allowedTypes): self
    {
        return new static("Invalid file type. Allowed types: " . $allowedTypes, Response::HTTP_UNPROCESSABLE_ENTITY, 'invalid_file_type');
    }

    /**
     * Create an exception for file too large.
     *
     * @param string $maxSize
     * @return static
     */
    public static function fileTooLarge(string $maxSize): self
    {
        return new static("File too large. Maximum size: " . $maxSize, Response::HTTP_UNPROCESSABLE_ENTITY, 'file_too_large');
    }

    /**
     * Create an exception for upload failed.
     *
     * @return static
     */
    public static function uploadFailed(): self
    {
        return new static("File upload failed. Please try again.", Response::HTTP_INTERNAL_SERVER_ERROR, 'upload_failed');
    }

    /**
     * Create an exception for file not found.
     *
     * @return static
     */
    public static function fileNotFound(): self
    {
        return new static("File not found.", Response::HTTP_NOT_FOUND, 'file_not_found');
    }
}