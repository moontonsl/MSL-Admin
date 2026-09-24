<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\School;
use App\Models\Island;
use App\Models\Region;
use App\Models\Province;

class CampusController extends Controller
{
    public function index(Request $request)
    {
        // Get the selected filters from request
        $selectedIslandName = $request->get('island'); // 'Luzon', 'Visayas', 'Mindanao'
        
        // Build the communities query
        $query = \App\Models\Community::with(['school.municipality.province']);
        
        // Filter by island name if selected
        if ($selectedIslandName) {
            $query->where('island', $selectedIslandName);
        }
        
        // Sort by school name (accessed via relationship)
        $query->select('communities.*')
              ->join('schools', 'communities.school_id', '=', 'schools.id')
              ->orderBy('schools.name');
            
        // Get paginated results (10 per page as requested)
        $communities = $query->paginate(10)->withQueryString();
        
        return Inertia::render('campus/index', [
            'communities' => $communities,
            'selectedIsland' => $selectedIslandName,
        ]);
    }
}
