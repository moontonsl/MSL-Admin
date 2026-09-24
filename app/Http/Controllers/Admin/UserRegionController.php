<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserRegionController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Check if user is Admin or Super Admin
        if ($user->role !== 'Admin' && $user->role !== 'Super Admin') {
            return redirect()->route('dashboard')->with('error', 'Access denied. Only Admins can access this page.');
        }
        
        // Get all Regional Admin users with their assigned regions
        $regionalAdmins = User::where('role', 'Regional Admin')
            ->with('assignedRegions')
            ->get()
            ->map(function ($admin) {
                // Convert region ID to region name
                $currentRegionName = null;
                if ($admin->region) {
                    $region = \Illuminate\Support\Facades\DB::table('regions')->where('id', $admin->region)->first();
                    $currentRegionName = $region ? $region->name : null;
                }
                
                return [
                    'id' => $admin->id,
                    'name' => $admin->name . ' ' . $admin->surname,
                    'email' => $admin->email,
                    'username' => $admin->username,
                    'current_region' => $currentRegionName, // Converted to region name
                    'assigned_regions' => $admin->getAssignedRegionNames(), // Now includes original region
                ];
            });
        
        // Get all regions directly from the regions table
        $allRegions = \Illuminate\Support\Facades\DB::table('regions')
            ->orderBy('name')
            ->pluck('name')
            ->values();
        
        // Get regions that are already assigned to Regional Admins
        // For each region, get all users who have it assigned
        $assignedRegions = \App\Models\UserRegion::with('user')
            ->get()
            ->groupBy('region_name')
            ->map(function($assignments) {
                // Return all assignments for this region, not just the first one
                // For UI display, we'll show the first one but allow Super Admin to see all
                $firstAssignment = $assignments->first();
                return [
                    'region_name' => $firstAssignment->region_name,
                    'assigned_to' => $assignments->map(function($assignment) {
                        return $assignment->user->name . ' ' . $assignment->user->surname;
                    })->join(', '), // Show all users who have this region
                    'user_id' => $firstAssignment->user_id, // Keep first user_id for compatibility
                    'all_user_ids' => $assignments->pluck('user_id')->toArray(), // All user IDs with this region
                    'all_users' => $assignments->map(function($assignment) {
                        return [
                            'id' => $assignment->user_id,
                            'name' => $assignment->user->name . ' ' . $assignment->user->surname
                        ];
                    })->toArray()
                ];
            });
        
        // Get list of Regional Admins for re-assignment dropdown
        $regionalAdminsList = User::where('role', 'Regional Admin')
            ->get(['id', 'name', 'surname'])
            ->map(function ($admin) {
                return [
                    'id' => $admin->id,
                    'name' => $admin->name . ' ' . $admin->surname
                ];
            });

        return Inertia::render('Admin/UserRegionManagement', [
            'regionalAdmins' => $regionalAdmins,
            'allRegions' => $allRegions,
            'assignedRegions' => $assignedRegions,
            'regionalAdminsList' => $regionalAdminsList,
            'user' => $user
        ]);
    }
}