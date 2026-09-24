<?php

use App\Models\User;

if (!function_exists('is_ml_id_used')) {
    /**
     * Check if an ml_id is already used by other accounts
     * 
     * @param string $mlId The ml_id to check
     * @param int|null $excludeUserId Optional user ID to exclude from the check (useful for updates)
     * @return bool Returns true if ml_id is already used, false otherwise
     */
    function is_ml_id_used(string $mlId, ?int $excludeUserId = null): bool
    {
        $query = User::where('ml_id', $mlId);
        
        // Exclude the current user if updating
        if ($excludeUserId !== null) {
            $query->where('id', '!=', $excludeUserId);
        }
        
        return $query->exists();
    }
}

if (!function_exists('is_ml_id_available')) {
    /**
     * Check if ml_id is available for use
     * 
     * @param string $mlId The ml_id to check
     * @param int|null $excludeUserId Optional user ID to exclude from the check
     * @return bool Returns true if ml_id is available, false if already used
     */
    function is_ml_id_available(string $mlId, ?int $excludeUserId = null): bool
    {
        return !is_ml_id_used($mlId, $excludeUserId);
    }
}

if (!function_exists('get_user_by_ml_id')) {
    /**
     * Get the user who owns the ml_id
     * 
     * @param string $mlId The ml_id to find
     * @return User|null Returns the user or null if not found
     */
    function get_user_by_ml_id(string $mlId): ?User
    {
        return User::where('ml_id', $mlId)->first();
    }
}

if (!function_exists('validate_ml_id_uniqueness')) {
    /**
     * Validate ml_id uniqueness and return validation result
     * 
     * @param string $mlId The ml_id to validate
     * @param int|null $excludeUserId Optional user ID to exclude from validation
     * @return array Returns array with 'valid' boolean and 'message' string
     */
    function validate_ml_id_uniqueness(string $mlId, ?int $excludeUserId = null): array
    {
        if (empty($mlId)) {
            return [
                'valid' => false,
                'message' => 'ML ID is required.'
            ];
        }
        
        if (is_ml_id_used($mlId, $excludeUserId)) {
            return [
                'valid' => false,
                'message' => 'This ML ID is already registered with another account.'
            ];
        }
        
        return [
            'valid' => true,
            'message' => 'ML ID is available.'
        ];
    }
} 