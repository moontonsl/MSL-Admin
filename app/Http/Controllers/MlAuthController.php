<?php

namespace App\Http\Controllers;

use App\Models\MlUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;

class MlAuthController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('MCC/Voting/Voting Sign In/Index');
    }

    public function login(Request $request)
    {
        $request->validate([
            'ml_id' => 'required|string',
            'server_id' => 'required|string',
            'ign' => 'required|string',
            'token' => 'required|string', // Moonton JWT token
        ]);

        // Find or create the ML user
        $mlUser = MlUser::updateOrCreate(
            ['ml_id' => $request->ml_id],
            [
                'server_id' => $request->server_id,
                'ign' => $request->ign,
                'is_active' => true,
                'last_active_at' => now(),
                // You might want to store the token if needed for future API calls
                // 'moonton_token' => $request->token,
            ]
        );

        // Store ML user in session
        session(['ml_user' => $mlUser]);

        return response()->json([
            'success' => true,
            'message' => 'Welcome back, ' . $mlUser->ign . '!',
            'redirect' => route('mccs2predictions.show')
        ]);
    }

    public function logout(Request $request)
    {
        session()->forget('ml_user');
        
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
            'redirect' => route('ml.login')
        ]);
    }

    /**
     * Verify the Moonton token and get user info
     */
    public function verifyToken(Request $request)
    {
        $request->validate([
            'token' => 'required|string'
        ]);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $request->token,
                'Content-Type' => 'application/x-www-form-urlencoded;charset=UTF-8',
            ])->post('https://api.mobilelegends.com/base/getBaseInfo');

            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'success' => true,
                    'data' => $data
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Invalid token'
            ], 401);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify token'
            ], 500);
        }
    }
} 