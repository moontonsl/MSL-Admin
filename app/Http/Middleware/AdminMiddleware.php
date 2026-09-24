<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Accept dedicated AdminUser accounts
        if (Auth::guard('admin')->check()) {
            return $next($request);
        }

        // Also accept regular users with Super Admin or Admin roles
        if (Auth::guard('web')->check() && in_array(Auth::guard('web')->user()->role, ['Super Admin', 'Admin'])) {
            return $next($request);
        }

        if ($request->expectsJson()) {
            return response()->json(['error' => 'Unauthorized.'], 401);
        }

        return redirect()->route('admin.login')->with('error', 'Please login to access the admin area.');
    }
}