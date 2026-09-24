<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OppoRoadshowSchool;
use App\Models\OppoRoadshowDate;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OppoSettingsController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'Super Admin') {
            abort(403, 'Unauthorized');
        }

        $selectedSchools = OppoRoadshowSchool::with('school.region')->get();
        $selectedDates = OppoRoadshowDate::orderBy('event_date', 'asc')->get();

        return Inertia::render('Admin/OppoSettings/Index', [
            'selectedSchools' => $selectedSchools,
            'selectedDates' => $selectedDates
        ]);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'Super Admin') {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'school_id' => 'required|integer|exists:schools,id'
        ]);

        OppoRoadshowSchool::firstOrCreate([
            'school_id' => $request->school_id
        ]);

        return redirect()->back()->with('success', 'School added to Roadshow list.');
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'Super Admin') {
            abort(403, 'Unauthorized');
        }

        $school = OppoRoadshowSchool::findOrFail($id);
        $school->delete();

        return redirect()->back()->with('success', 'School removed from Roadshow list.');
    }

    /* Date Management */
    public function storeDate(Request $request)
    {
        if ($request->user()->role !== 'Super Admin') {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'event_date' => 'required|string'
        ]);

        OppoRoadshowDate::create([
            'event_date' => $request->event_date
        ]);

        return redirect()->back()->with('success', 'Date added successfully.');
    }

    public function destroyDate(Request $request, $id)
    {
        if ($request->user()->role !== 'Super Admin') {
            abort(403, 'Unauthorized');
        }

        $date = OppoRoadshowDate::findOrFail($id);
        $date->delete();

        return redirect()->back()->with('success', 'Date removed successfully.');
    }

    // Public API for the dropdowns
    public function getRoadshowSchools()
    {
        $schools = OppoRoadshowSchool::with('school')->get()->pluck('school.name');
        return response()->json($schools);
    }

    public function getRoadshowData()
    {
        $schools = OppoRoadshowSchool::with('school')->get()->map(function($item) {
            return $item->school->name;
        });
        
        $dates = OppoRoadshowDate::where('is_active', true)
            ->orderBy('event_date', 'asc')
            ->get()
            ->pluck('event_date');

        return response()->json([
            'schools' => $schools,
            'dates' => $dates
        ]);
    }
}
