<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class AdminAccountController extends Controller
{
    public function index()
    {
        $adminUsers = AdminUser::select('id', 'name', 'email', 'role', 'permissions', 'created_at')
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('Admin/AdminAccounts/Index', [
            'adminUsers' => $adminUsers,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admin_users',
            'password' => ['required', 'string', 'min:8'],
            'role' => 'required|string|max:255',
        ]);

        AdminUser::create([
            'name' => $request->name,
            'email' => strtolower($request->email),
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'permissions' => [], // Default to empty, can be assigned in Permissions tab
        ]);

        return redirect()->back()->with('success', 'Admin account created successfully.');
    }

    public function destroy($id)
    {
        $adminUser = AdminUser::findOrFail($id);

        if ($adminUser->email === 'admin@msl.com') {
            return redirect()->back()->with('error', 'Cannot delete the Super Admin account.');
        }

        $adminUser->delete();

        return redirect()->back()->with('success', 'Admin account deleted successfully.');
    }
}
