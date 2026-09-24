<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AwardNomination;

class AwardNominationController extends Controller
{
    public function store(Request $request)
    {
        // Require ML user session to be present
        if (!session()->has('ml_user')) {
            return response()->json([
                'success' => false,
                'message' => 'Please verify your MLBB account first.',
                'needs_verification' => true
            ], 401);
        }

        $mlUser = session('ml_user');

        $request->validate([
            'award_id' => 'required|string',
            'award_type' => 'required|string|in:organization,student,individual',
            'nominator_name' => 'required|string|max:255',
            'nominee_name' => 'required|string|max:255',
            'reason' => 'required|string',
        ]);

        // Check if user has already nominated this exact nominee for this specific award
        $existing = AwardNomination::where('ml_id', $mlUser->ml_id)
            ->where('award_id', $request->award_id)
            ->where('nominee_name', $request->nominee_name)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'You have already nominated this person/organization for this award category.'
            ], 400);
        }

        try {
            $nomination = AwardNomination::create([
                'ml_id' => $mlUser->ml_id,
                'award_id' => $request->award_id,
                'award_type' => $request->award_type,
                'nominator_name' => $request->nominator_name,
                'nominee_name' => $request->nominee_name,
                'reason' => $request->reason,
            ]);

            // Automatically sync to Google Sheets
            try {
                app(\App\Http\Controllers\GoogleSheetAwardNominationsController::class)->exportToGoogleSheet();
            } catch (\Exception $sheetException) {
                \Log::error('Failed to sync nomination to Google Sheets: ' . $sheetException->getMessage());
                // We still return success to the user since the DB save worked
            }

            return response()->json([
                'success' => true,
                'message' => 'Your nomination has been successfully submitted!',
                'data' => $nomination
            ]);
        } catch (\Exception $e) {
            // Handle race conditions where uniqueness constraint fails
            if ($e->getCode() == 23000) { // Integrity constraint violation
                return response()->json([
                    'success' => false,
                    'message' => 'You have already nominated this person/organization for this award category.'
                ], 400);
            }

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while submitting your nomination.'
            ], 500);
        }
    }
}
