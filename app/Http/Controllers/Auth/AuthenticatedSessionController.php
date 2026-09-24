<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        // return Inertia::render('Auth/Login', [
        //     'canResetPassword' => Route::has('password.request'),
        //     'status' => session('status'),
        // ]);
        return Inertia::render('Login/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();
        
        $user = Auth::user();
        
        // Check user state and redirect accordingly
        if (in_array($user->role, ['SL', 'Regional Admin', 'Admin', 'Super Admin'])) {
            // Admin users go to their respective dashboards
            if (in_array($user->role, ['SL', 'Regional Admin', 'Super Admin'])) {
                return redirect()->intended(route('sl-admin', absolute: false));
            }
            return redirect()->intended(route('dashboard', absolute: false));
        }
        
        // Regular users go to student portal (middleware will handle state-based redirects)
        return redirect()->intended(route('SLStudent', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
