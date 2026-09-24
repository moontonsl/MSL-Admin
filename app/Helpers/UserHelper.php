<?php

namespace App\Helpers;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserHelper
{
    /**
     * Check if an ml_id is already used by other accounts
     * 
     * @param string $mlId The ml_id to check
     * @param int|null $excludeUserId Optional user ID to exclude from the check (useful for updates)
     * @return bool Returns true if ml_id is already used, false otherwise
     */
    public static function isMlIdAlreadyUsed(string $mlId, ?int $excludeUserId = null): bool
    {
        $query = User::where('ml_id', $mlId);
        
        // Exclude the current user if updating
        if ($excludeUserId !== null) {
            $query->where('id', '!=', $excludeUserId);
        }
        
        return $query->exists();
    }
    
    /**
     * Get the user who owns the ml_id
     * 
     * @param string $mlId The ml_id to find
     * @return User|null Returns the user or null if not found
     */
    public static function getUserByMlId(string $mlId): ?User
    {
        return User::where('ml_id', $mlId)->first();
    }
    
    /**
     * Check if ml_id is available for use
     * 
     * @param string $mlId The ml_id to check
     * @param int|null $excludeUserId Optional user ID to exclude from the check
     * @return bool Returns true if ml_id is available, false if already used
     */
    public static function isMlIdAvailable(string $mlId, ?int $excludeUserId = null): bool
    {
        return !self::isMlIdAlreadyUsed($mlId, $excludeUserId);
    }
} 