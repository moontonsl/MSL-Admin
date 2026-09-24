<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MCCSeason;
use App\Models\MCCSeasonContent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MCCSeasonController extends Controller
{
    /**
     * Display a listing of all MCC seasons.
     */
    public function index()
    {
        $seasons = MCCSeason::withCount('content')
            ->orderBy('season_number', 'desc')
            ->get();

        return Inertia::render('Admin/MCCSeasons/Index', [
            'seasons' => $seasons
        ]);
    }

    /**
     * Show the form for creating a new season.
     */
    public function create()
    {
        // Get the next season number
        $nextSeasonNumber = MCCSeason::max('season_number') + 1;

        return Inertia::render('Admin/MCCSeasons/Create', [
            'nextSeasonNumber' => $nextSeasonNumber,
            'contentTypes' => MCCSeasonContent::getContentTypes()
        ]);
    }

    /**
     * Store a newly created season in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'season_number' => 'required|integer|unique:mcc_seasons,season_number',
            'season_name' => 'required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'route_slug' => 'required|string|unique:mcc_seasons,route_slug',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $season = MCCSeason::create($validated);

        // If this season is set as active, deactivate others
        if ($validated['is_active'] ?? false) {
            $season->setAsActive();
        }

        return redirect()->route('admin.mcc-seasons.edit', $season->id)
            ->with('success', 'Season created successfully. Now add content to your season.');
    }

    /**
     * Show the form for editing the specified season.
     */
    public function edit($id)
    {
        $season = MCCSeason::with('content')->findOrFail($id);

        return Inertia::render('Admin/MCCSeasons/Edit', [
            'season' => $season,
            'formattedContent' => $season->getFormattedContent(),
            'contentTypes' => MCCSeasonContent::getContentTypes()
        ]);
    }

    /**
     * Update the specified season in storage.
     */
    public function update(Request $request, $id)
    {
        $season = MCCSeason::findOrFail($id);

        $validated = $request->validate([
            'season_number' => 'required|integer|unique:mcc_seasons,season_number,' . $id,
            'season_name' => 'required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'route_slug' => 'required|string|unique:mcc_seasons,route_slug,' . $id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $season->update($validated);

        // If this season is set as active, deactivate others
        if ($validated['is_active'] ?? false) {
            $season->setAsActive();
        }

        return redirect()->route('admin.mcc-seasons.index')
            ->with('success', 'Season updated successfully.');
    }

    /**
     * Remove the specified season from storage.
     */
    public function destroy($id)
    {
        $season = MCCSeason::findOrFail($id);
        
        // Don't allow deleting the active season
        if ($season->is_active) {
            return back()->with('error', 'Cannot delete the active season. Please set another season as active first.');
        }

        $season->delete();

        return redirect()->route('admin.mcc-seasons.index')
            ->with('success', 'Season deleted successfully.');
    }

    /**
     * Toggle the active status of a season.
     */
    public function toggleActive($id)
    {
        $season = MCCSeason::findOrFail($id);
        $season->setAsActive();

        return back()->with('success', "Season {$season->season_number} is now active.");
    }

    /**
     * Upload an image for a season.
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'season_id' => 'required|exists:mcc_seasons,id',
            'content_type' => 'required|string',
            'content_key' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        $season = MCCSeason::findOrFail($request->season_id);
        $file = $request->file('image');

        // Create directory path
        $directory = "images/MCC/S{$season->season_number}";
        
        // Generate filename
        $filename = Str::slug($request->content_key) . '_' . time() . '.' . $file->getClientOriginalExtension();
        
        // Store the file
        $path = $file->storeAs($directory, $filename, 'public');

        // Create or update content record
        $content = MCCSeasonContent::updateOrCreate(
            [
                'season_id' => $season->id,
                'content_key' => $request->content_key,
            ],
            [
                'content_type' => $request->content_type,
                'content_value' => ['path' => $path],
            ]
        );

        return response()->json([
            'success' => true,
            'path' => $path,
            'url' => Storage::url($path),
            'content' => $content
        ]);
    }

    /**
     * Update or create content for a season.
     */
    public function updateContent(Request $request, $id)
    {
        $season = MCCSeason::findOrFail($id);

        $request->validate([
            'content_type' => 'required|string',
            'content_key' => 'required|string',
            'content_value' => 'required',
            'display_order' => 'nullable|integer',
        ]);

        $content = MCCSeasonContent::updateOrCreate(
            [
                'season_id' => $season->id,
                'content_key' => $request->content_key,
            ],
            [
                'content_type' => $request->content_type,
                'content_value' => $request->content_value,
                'display_order' => $request->display_order ?? 0,
            ]
        );

        return response()->json([
            'success' => true,
            'content' => $content
        ]);
    }

    /**
     * Delete content from a season.
     */
    public function deleteContent($seasonId, $contentId)
    {
        $content = MCCSeasonContent::where('season_id', $seasonId)
            ->where('id', $contentId)
            ->firstOrFail();

        // If content has an image, delete it
        if (isset($content->content_value['path'])) {
            Storage::disk('public')->delete($content->content_value['path']);
        }

        $content->delete();

        return response()->json([
            'success' => true,
            'message' => 'Content deleted successfully.'
        ]);
    }
}
