<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserState
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        \Log::info('CheckUserState middleware called for route: ' . $request->route()->getName());
        
        if (Auth::check()) {
            $user = Auth::user();
            
            // Block archived users - logout and redirect to login
            if ($user->status === 'Archived') {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                return redirect()->route('login')->with('archived', 'This account has been archived. If you believe this action was taken in error, you may submit an appeal by emailing web@moontonslph.org to reactivate.');
            }
            
            // Skip state checking for admin users
            if (in_array($user->role, ['SL', 'Regional Admin', 'Admin', 'Super Admin'])) {
                return $next($request);
            }
            
            // Define allowed routes for each state
            $allowedRoutes = [
                'logout', // Always allow logout
                'ml.logout', // ML logout route
                'force-logout', // Force logout route
                'profile.destroy', // Allow account deletion for all states
                'user.attachment.show', // Allow viewing own attachment
            ];
            
            // If the user's status is inactive, restrict access accordingly
            if ($user->status === 'inactive') {
                if ($user->state === 'New') {
                    // Inactive users who submitted docs can only access waiting page
                    $allowedRoutes[] = 'user.waiting';
                    $currentRoute = $request->route() ? $request->route()->getName() : 'unknown';
                    if (!$request->routeIs($allowedRoutes)) {
                        \Log::info('Inactive user (New state) redirected to waiting. Route: ' . $currentRoute . ', User: ' . $user->name);
                        return redirect()->route('user.waiting');
                    }
                } else {
                    // Otherwise, inactive users must go to the upload page to submit docs
                    $allowedRoutes[] = 'user.upload';
                    $currentRoute = $request->route() ? $request->route()->getName() : 'unknown';
                    if (!$request->routeIs($allowedRoutes)) {
                        \Log::info('Inactive user redirected to upload. Route: ' . $currentRoute . ', User: ' . $user->name);
                        return redirect()->route('user.upload');
                    }
                }
                return $next($request);
            }
            
            // Check user state and restrict access accordingly
            switch ($user->state) {
                case 'New':
                    // New users can only access waiting page and logout
                    $allowedRoutes[] = 'user.waiting';
                    $currentRoute = $request->route() ? $request->route()->getName() : 'unknown';
                    if (!$request->routeIs($allowedRoutes)) {
                        \Log::info('New user redirected to waiting. Route: ' . $currentRoute . ', User: ' . $user->name . ', Allowed routes: ' . implode(', ', $allowedRoutes));
                        return redirect()->route('user.waiting');
                    }
                    break;
                    
                case 'Renew':
                    // Renew users can only access upload page and logout
                    $allowedRoutes[] = 'user.upload';
                    $currentRoute = $request->route() ? $request->route()->getName() : 'unknown';
                    if (!$request->routeIs($allowedRoutes)) {
                        \Log::info('Renew user redirected to upload. Route: ' . $currentRoute . ', User: ' . $user->name . ', Allowed routes: ' . implode(', ', $allowedRoutes));
                        return redirect()->route('user.upload');
                    }
                    break;
                    
                case 'Blocked':
                    // Blocked users can only access blocked page and logout
                    $allowedRoutes[] = 'user.blocked';
                    $currentRoute = $request->route() ? $request->route()->getName() : 'unknown';
                    if (!$request->routeIs($allowedRoutes)) {
                        \Log::info('Blocked user redirected to blocked. Route: ' . $currentRoute . ', User: ' . $user->name . ', Allowed routes: ' . implode(', ', $allowedRoutes));
                        return redirect()->route('user.blocked');
                    }
                    break;
                    
                case 'Verified':
                    // Verified users can access all routes normally
                    break;
                    
                default:
                    // Unknown state, treat as new
                    $allowedRoutes[] = 'user.waiting';
                    $currentRoute = $request->route() ? $request->route()->getName() : 'unknown';
                    if (!$request->routeIs($allowedRoutes)) {
                        \Log::info('Unknown state user redirected to waiting. Route: ' . $currentRoute . ', User: ' . $user->name . ', Allowed routes: ' . implode(', ', $allowedRoutes));
                        return redirect()->route('user.waiting');
                    }
                    break;
            }
        }
        
        return $next($request);
    }
}
