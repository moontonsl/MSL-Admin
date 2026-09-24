<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key');
        return Inertia::render('Admin/Settings', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'website_name' => 'nullable|string|max:255',
            'website_title' => 'nullable|string|max:255',
            'maintenance_mode' => 'nullable|boolean',
            'maintenance_message' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
            'favicon' => 'nullable|image|max:512',
        ]);

        Setting::setValue('website_name', $data['website_name'] ?? '', 'string');
        Setting::setValue('website_title', $data['website_title'] ?? '', 'string');
        Setting::setValue('maintenance_mode', $data['maintenance_mode'] ?? false, 'boolean');
        Setting::setValue('maintenance_message', $data['maintenance_message'] ?? '', 'string');

        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('public/settings');
            Setting::setValue('logo', $logoPath, 'file');
        }
        if ($request->hasFile('favicon')) {
            $faviconPath = $request->file('favicon')->store('public/settings');
            Setting::setValue('favicon', $faviconPath, 'file');
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
