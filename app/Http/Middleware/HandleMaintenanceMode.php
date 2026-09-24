<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Auth;

class HandleMaintenanceMode
{
    public function handle(Request $request, Closure $next)
    {
        // Exclude admin panel routes from maintenance mode
        if ($request->is('admin*')) {
            return $next($request);
        }

        $maintenance = Setting::getValue('maintenance_mode', false);
        $message = Setting::getValue('maintenance_message', 'The site is under maintenance. Please check back later.');

        // Allow admins to bypass maintenance mode
        if ($maintenance && (!Auth::check() || !Auth::user()->is_admin)) {
            return response()->view('maintenance', ['message' => $message]);
        }
        return $next($request);
    }
} 