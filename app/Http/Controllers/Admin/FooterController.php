<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FooterController extends Controller
{
    public function index()
    {
        // Get all footer settings
        $footerData = [
            'description' => Setting::getValue('footer_description', 'This website is under the use of Moonton Student Leaders Philippines supervised and monitored by the SERP Department. For inquiries and website concerns, send it to us using this link or you may contact us through contact@moontonslph.org'),
            'copyright' => Setting::getValue('footer_copyright', '© 2025 — Moonton Student Leaders Philippines'),
            'logo' => Setting::getValue('footer_logo', '/msl-logo.png'),
            'facebook_url' => Setting::getValue('footer_facebook_url', 'https://www.facebook.com/MSLPhilippines'),
            'youtube_url' => Setting::getValue('footer_youtube_url', 'https://www.youtube.com/@MSLPhilippines'),
            'mlbb_logo' => Setting::getValue('footer_mlbb_logo', '/mlbb-logo.png'),
            'moonton_logo' => Setting::getValue('footer_moonton_logo', '/moonton-logo.png'),
            'nav_sections' => json_decode(Setting::getValue('footer_nav_sections', json_encode([
                [
                    'title' => 'Explore',
                    'links' => [
                        ['label' => 'Events', 'href' => '/Events'],
                        ['label' => 'News', 'href' => '/news'],
                        ['label' => 'Program', 'href' => '/Programs'],
                        ['label' => 'Resources', 'href' => '/resources']
                    ]
                ],
                [
                    'title' => 'Legal',
                    'links' => [
                        ['label' => 'Privacy Policy', 'href' => '/PrivacyPolicy'],
                        ['label' => 'Terms of Use', 'href' => '/TermsAndConditions']
                    ]
                ]
            ])), true),
        ];

        return Inertia::render('Admin/Footer/Index', [
            'footer' => $footerData,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'description' => 'nullable|string|max:1000',
            'copyright' => 'nullable|string|max:255',
            'logo' => 'nullable|string|max:255',
            'facebook_url' => 'nullable|url|max:255',
            'youtube_url' => 'nullable|url|max:255',
            'mlbb_logo' => 'nullable|string|max:255',
            'moonton_logo' => 'nullable|string|max:255',
            'nav_sections' => 'nullable|array',
            'nav_sections.*.title' => 'required|string|max:255',
            'nav_sections.*.links' => 'required|array',
            'nav_sections.*.links.*.label' => 'required|string|max:255',
            'nav_sections.*.links.*.href' => 'required|string|max:255',
        ]);

        // Update settings
        Setting::setValue('footer_description', $validated['description'] ?? '', 'text');
        Setting::setValue('footer_copyright', $validated['copyright'] ?? '', 'text');
        Setting::setValue('footer_logo', $validated['logo'] ?? '/msl-logo.png', 'string');
        Setting::setValue('footer_facebook_url', $validated['facebook_url'] ?? '', 'url');
        Setting::setValue('footer_youtube_url', $validated['youtube_url'] ?? '', 'url');
        Setting::setValue('footer_mlbb_logo', $validated['mlbb_logo'] ?? '/mlbb-logo.png', 'string');
        Setting::setValue('footer_moonton_logo', $validated['moonton_logo'] ?? '/moonton-logo.png', 'string');
        Setting::setValue('footer_nav_sections', json_encode($validated['nav_sections'] ?? []), 'json');

        return redirect()->back()->with('success', 'Footer updated successfully.');
    }
}

