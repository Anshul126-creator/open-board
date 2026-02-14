<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\JWTAuth;

class AuthService
{
    protected $jwtAuth;

    public function __construct(JWTAuth $jwtAuth)
    {
        $this->jwtAuth = $jwtAuth;
    }

    /**
     * Login user with credentials
     *
     * @param array $credentials
     * @return array
     * @throws AuthenticationException
     */
    public function login(array $credentials): array
    {
        if (!$token = $this->jwtAuth->attempt($credentials)) {
            throw new AuthenticationException('Invalid credentials');
        }

        $user = Auth::user();
        $refreshToken = $this->generateRefreshToken();

        return [
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'user' => $this->formatUserResponse($user),
        ];
    }

    /**
     * Logout user
     *
     * @param User $user
     * @return void
     */
    public function logout(User $user): void
    {
        $this->jwtAuth->invalidate($this->jwtAuth->getToken());
    }

    /**
     * Refresh JWT token
     *
     * @param string $refreshToken
     * @return array
     * @throws JWTException
     */
    public function refreshToken(string $refreshToken): array
    {
        try {
            // In a real implementation, you would validate the refresh token
            // and generate a new access token
            $newToken = $this->jwtAuth->refresh();
            $newRefreshToken = $this->generateRefreshToken();

            return [
                'access_token' => $newToken,
                'refresh_token' => $newRefreshToken,
            ];
        } catch (TokenExpiredException $e) {
            throw new JWTException('Refresh token expired');
        } catch (TokenInvalidException $e) {
            throw new JWTException('Invalid refresh token');
        }
    }

    /**
     * Get current authenticated user
     *
     * @param User $user
     * @return array
     */
    public function getCurrentUser(User $user): array
    {
        return $this->formatUserResponse($user);
    }

    /**
     * Generate refresh token
     *
     * @return string
     */
    protected function generateRefreshToken(): string
    {
        return bin2hex(random_bytes(32));
    }

    /**
     * Format user response
     *
     * @param User $user
     * @return array
     */
    protected function formatUserResponse(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'center_id' => $user->center_id,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }
}