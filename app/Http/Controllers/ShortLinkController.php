<?php

namespace App\Http\Controllers;

use App\Models\ShortLink;
use Illuminate\Http\RedirectResponse;

class ShortLinkController extends Controller
{
    /**
     * Redirect the short code to its original URL.
     *
     * @param string $code
     * @return RedirectResponse
     */
    public function redirect(string $code): RedirectResponse
    {
        $shortLink = ShortLink::where('code', $code)->firstOrFail();
        
        // Increment the clicks count
        $shortLink->increment('clicks');

        // Redirect to the original URL
        return redirect()->away($shortLink->original_url);
    }
}
