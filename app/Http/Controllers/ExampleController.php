<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExampleController extends Controller
{
    /**
     * Example of checking if ml_id is used
     */
    public function checkMlId(Request $request): JsonResponse
    {
        $mlId = $request->input('ml_id');
        
        if (empty($mlId)) {
            return response()->json([
                'error' => 'ML ID is required'
            ], 400);
        }
        
        // Check if ml_id is already used
        if (is_ml_id_used($mlId)) {
            return response()->json([
                'available' => false,
                'message' => 'This ML ID is already registered with another account.'
            ]);
        }
        
        return response()->json([
            'available' => true,
            'message' => 'ML ID is available for registration.'
        ]);
    }
    
    /**
     * Example of checking ml_id availability with user exclusion (for updates)
     */
    public function checkMlIdForUpdate(Request $request): JsonResponse
    {
        $mlId = $request->input('ml_id');
        $userId = $request->input('user_id'); // Current user ID to exclude
        
        $validation = validate_ml_id_uniqueness($mlId, $userId);
        
        return response()->json([
            'valid' => $validation['valid'],
            'message' => $validation['message']
        ]);
    }
    
    /**
     * Example of getting user by ml_id
     */
    public function getUserByMlId(Request $request): JsonResponse
    {
        $mlId = $request->input('ml_id');
        
        $user = get_user_by_ml_id($mlId);
        
        if (!$user) {
            return response()->json([
                'error' => 'No user found with this ML ID'
            ], 404);
        }
        
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'ml_id' => $user->ml_id,
                'ml_server' => $user->ml_server,
                'ml_ign' => $user->ml_ign
            ]
        ]);
    }
} 