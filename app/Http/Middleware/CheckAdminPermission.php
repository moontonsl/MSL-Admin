<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string|null  $permission
     */
    public function handle(Request $request, Closure $next, ?string $permission = null): Response
    {
        $adminUser = Auth::guard('admin')->user();

        if (!$adminUser) {
            return redirect()->route('admin.login')->with('error', 'Please login to access this page.');
        }

        // admin@msl.com has super_admin privileges and full access to everything
        if ($adminUser->email === 'admin@msl.com') {
            return $next($request);
        }

        // If route requires super_admin permission, deny non-super admins
        if ($permission === 'super_admin') {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthorized. Super Admin access required.'], 403);
            }
            return redirect()->route('admin.dashboard')->with('error', 'Unauthorized access.');
        }

        // Check if specific route permission is granted
        if ($permission) {
            $userPermissions = $adminUser->permissions ?? [];
            if (!in_array($permission, $userPermissions)) {
                if ($request->expectsJson()) {
                    return response()->json(['error' => 'You do not have permission to access this resource.'], 403);
                }
                return redirect()->route('admin.dashboard')->with('error', 'You do not have permission to access that section.');
            }
        }

        return $next($request);
    }
}
