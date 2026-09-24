<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JBFlexSubmission;
use Illuminate\Support\Facades\Log;

class JBFlexController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'school' => 'required|string|max:255',
                'uid' => 'required|max:255',
                'server' => 'required|max:255',
                'facebookProfileLink' => 'required|url|max:500',
                'postLink' => 'required|url|max:500',
            ]);

            JBFlexSubmission::create([
                'name' => $validated['name'],
                'school' => $validated['school'],
                'ml_id' => $validated['uid'],
                'server_id' => $validated['server'],
                'facebook_profile_link' => $validated['facebookProfileLink'],
                'post_link' => $validated['postLink'],
            ]);

            return response()->json(['success' => true, 'message' => 'Entry submitted successfully!']);
        } catch (\Exception $e) {
            Log::error('JBFlex Submission Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error submitting entry: ' . $e->getMessage()], 500);
        }
    }
}
