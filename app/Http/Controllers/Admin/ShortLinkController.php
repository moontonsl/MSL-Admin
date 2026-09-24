<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShortLink;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ShortLinkController extends Controller
{
    /**
     * Display a listing of the short links.
     *
     * @return Response
     */
    public function index(): Response
    {
        $shortLinks = ShortLink::orderBy('created_at', 'desc')->get()->map(function ($link) {
            $link->short_url = url('/s/' . $link->code);
            return $link;
        });

        return Inertia::render('Admin/ShareLink/Index', [
            'shortLinks' => $shortLinks,
        ]);
    }

    /**
     * Store a newly created short link.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'original_url' => 'required|string|max:2048',
            'code' => 'nullable|string|alpha_dash|max:50|unique:short_links,code',
        ], [
            'code.unique' => 'This short code/alias is already in use. Please choose a different one.',
            'code.alpha_dash' => 'The short code may only contain letters, numbers, dashes, and underscores.',
        ]);

        $originalUrl = $validated['original_url'];
        if (!preg_match("~^(?:f|ht)tps?://~i", $originalUrl)) {
            $originalUrl = "https://" . $originalUrl;
        }

        $code = $validated['code'];
        if (empty($code)) {
            do {
                $code = Str::random(6);
            } while (ShortLink::where('code', $code)->exists());
        }

        ShortLink::create([
            'original_url' => $originalUrl,
            'code' => $code,
        ]);

        return redirect()->back()->with('success', 'Share link created successfully.');
    }

    /**
     * Update the specified short link.
     *
     * @param Request $request
     * @param ShortLink $shortLink
     * @return RedirectResponse
     */
    public function update(Request $request, ShortLink $shortLink): RedirectResponse
    {
        $validated = $request->validate([
            'original_url' => 'required|string|max:2048',
            'code' => 'required|string|alpha_dash|max:50|unique:short_links,code,' . $shortLink->id,
        ], [
            'code.unique' => 'This short code/alias is already in use. Please choose a different one.',
            'code.alpha_dash' => 'The short code may only contain letters, numbers, dashes, and underscores.',
        ]);

        $originalUrl = $validated['original_url'];
        if (!preg_match("~^(?:f|ht)tps?://~i", $originalUrl)) {
            $originalUrl = "https://" . $originalUrl;
        }

        $shortLink->update([
            'original_url' => $originalUrl,
            'code' => $validated['code'],
        ]);

        return redirect()->back()->with('success', 'Share link updated successfully.');
    }

    /**
     * Remove the specified short link.
     *
     * @param ShortLink $shortLink
     * @return RedirectResponse
     */
    public function destroy(ShortLink $shortLink): RedirectResponse
    {
        $shortLink->delete();

        return redirect()->back()->with('success', 'Share link deleted successfully.');
    }
}
