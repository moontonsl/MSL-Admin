<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Get footer data from settings
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

        return [
            ...parent::share($request),
            'auth' => [
                'user' => \Illuminate\Support\Facades\Auth::guard('admin')->user() ?? $request->user(),
            ],
            'footer' => $footerData,
        ];
    }
}
