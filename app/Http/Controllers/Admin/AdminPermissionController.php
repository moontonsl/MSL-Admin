<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPermissionController extends Controller
{
    /**
     * List of available tabs and their details
     */
    public static function getAvailableTabs()
    {
        return [
            ['id' => 'admin.dashboard', 'name' => 'Dashboard'],
            ['id' => 'admin.users.pending', 'name' => 'Account Management'],
            ['id' => 'admin.sl-management', 'name' => 'SL Management'],
            ['id' => 'admin.regional-admin-management', 'name' => 'Regional Admin Management'],
            ['id' => 'admin.news', 'name' => 'News Management'],
            ['id' => 'admin.carousel', 'name' => 'Carousel Management'],
            ['id' => 'admin.event-photos', 'name' => 'Buffs and Support'],
            ['id' => 'admin.msl-events.index', 'name' => 'MSL Event Management'],
            ['id' => 'admin.mcc-seasons.index', 'name' => 'MCC Season Management'],
            ['id' => 'admin.events', 'name' => 'Event Calendar'],
            ['id' => 'admin.footer', 'name' => 'Footer Management'],
            ['id' => 'admin.share-links.index', 'name' => 'Share Link'],
            ['id' => 'admin.oppo-settings.index', 'name' => 'Oppo Settings'],
            ['id' => 'admin.violation-reports.index', 'name' => 'Violation Reports'],
            ['id' => 'admin.settings', 'name' => 'Settings'],
        ];
    }

    public function index()
    {
        $adminUsers = AdminUser::select('id', 'name', 'email', 'role', 'permissions')
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('Admin/Permissions/Index', [
            'adminUsers' => $adminUsers,
            'availableTabs' => self::getAvailableTabs(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $adminUser = AdminUser::findOrFail($id);

        if ($adminUser->email === 'admin@msl.com') {
            return redirect()->back()->with('error', 'Cannot alter Super Admin permissions.');
        }

        $request->validate([
            'permissions' => 'present|array',
            'permissions.*' => 'string',
        ]);

        $adminUser->update([
            'permissions' => $request->permissions,
        ]);

        return redirect()->back()->with('success', 'Permissions updated successfully.');
    }
}
