<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\School;

class SchoolController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->query('query');
        $regionId = $request->query('region_id');

        if (!$query) {
            return response()->json([]);
        }

        $schoolsQuery = School::with('region.island')
                ->where('name', 'like', $query . '%');

        // Filter by region if provided
        if ($regionId) {
            $schoolsQuery->where('region_id', $regionId);
        }

        $schools = $schoolsQuery->select('id', 'name', 'region_id')
                ->limit(20)
                ->get();

        $formatted = $schools->map(function ($school) {
            return [
                'id' => $school->id,
                'name' => $school->name,
                'island' => $school->region->island->name ?? '',
                'region' => $school->region->name ?? '',
            ];
        });
                

        return response()->json($formatted);
    }

    public function getRegions()
    {
        $regions = \App\Models\Region::orderBy('name')->get(['id', 'name']);
        return response()->json($regions);
    }

}
