<?php

namespace App\Http\Controllers;

use App\Models\MCCSeason;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MCCSeasonPublicController extends Controller
{
    /**
     * Redirect to the active season.
     */
    public function redirectToActive()
    {
        $activeSeason = MCCSeason::active()->first();

        if (!$activeSeason) {
            // If no active season, redirect to the latest season
            $latestSeason = MCCSeason::orderBy('season_number', 'desc')->first();
            
            if ($latestSeason) {
                return redirect()->route('MCC.season', $latestSeason->route_slug);
            }

            // If no seasons exist at all, show a message
            return Inertia::render('MCC/NoSeasons');
        }

        return redirect()->route('MCC.season', $activeSeason->route_slug);
    }

    /**
     * Display a specific season.
     */
    public function show($slug)
    {
        $season = MCCSeason::where('route_slug', $slug)
            ->with('content')
            ->firstOrFail();

        // Get all seasons for the dropdown
        $allSeasons = MCCSeason::orderBy('season_number', 'desc')
            ->get(['id', 'season_number', 'season_name', 'route_slug', 'is_active']);

        return Inertia::render('MCC/SeasonPage', [
            'season' => $season,
            'content' => $season->getFormattedContent(),
            'allSeasons' => $allSeasons,
        ]);
    }

    /**
     * Get the active season number for the Events page.
     */
    public function getActiveSeason()
    {
        $activeSeason = MCCSeason::active()->first();

        if (!$activeSeason) {
            return response()->json([
                'season_number' => null,
                'route_slug' => null,
            ]);
        }

        return response()->json([
            'season_number' => $activeSeason->season_number,
            'season_name' => $activeSeason->season_name,
            'route_slug' => $activeSeason->route_slug,
        ]);
    }

    /**
     * Get all seasons for dropdown.
     */
    public function getAllSeasons()
    {
        $seasons = MCCSeason::orderBy('season_number', 'desc')
            ->get(['id', 'season_number', 'season_name', 'route_slug', 'is_active']);

        return response()->json($seasons);
    }
}
