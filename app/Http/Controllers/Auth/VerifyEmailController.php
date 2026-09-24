<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
// jabu
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;
use App\Models\User;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }
    public function sendCode(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email'
            ]);
    
            $code = rand(100000, 999999);
            Cache::put('verification_code_' . $request->email, $code, now()->addMinutes(10));
    
            $user = User::where('email', $request->email)->first();
            $name = $user ? ($user->name ?? $user->username) : 'User';

            Mail::send('emails.verification-code', ['code' => $code, 'name' => $name], function($message) use ($request) {
                $message->to($request->email)
                        ->subject('MSL Account Verification Code');
            });
    
            return response()->json(['message' => 'Verification code sent!', 'code' => $code]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function checkMlId(Request $request)
    {
        $mlId = $request->query('ml_id');
        
        if (empty($mlId)) {
            return response()->json(['exists' => false, 'error' => 'ML ID is required']);
        }
        
        // Use our new global helper function
        $exists = is_ml_id_used($mlId);

        return response()->json(['exists' => $exists]);
    }

    /**
     * Check if ML ID is available for use
     */
    public function checkMlIdAvailability(Request $request)
    {
        $mlId = $request->query('ml_id');
        $userId = $request->query('user_id'); // Optional, for updates
        
        if (empty($mlId)) {
            return response()->json(['available' => false, 'error' => 'ML ID is required']);
        }
        
        $available = is_ml_id_available($mlId, $userId);
        
        return response()->json(['available' => $available]);
    }

    /**
     * Get user by ML ID
     */
    public function getUserByMlId(Request $request)
    {
        $mlId = $request->query('ml_id');
        
        if (empty($mlId)) {
            return response()->json(['error' => 'ML ID is required'], 400);
        }
        
        $user = get_user_by_ml_id($mlId);
        
        if (!$user) {
            return response()->json(['error' => 'No user found with this ML ID'], 404);
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

    /**
     * Validate ML ID uniqueness with structured response
     */
    public function validateMlId(Request $request)
    {
        $mlId = $request->query('ml_id');
        $userId = $request->query('user_id'); // Optional, for updates
        
        $validation = validate_ml_id_uniqueness($mlId, $userId);
        
        return response()->json($validation);
    }
}
