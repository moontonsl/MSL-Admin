<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ViolationReport;
use Inertia\Inertia;

class ViolationReportController extends Controller
{
    // Public: Submit a report
    public function store(Request $request)
    {
        $validated = $request->validate([
            'incidentType' => 'required|string',
            'description' => 'required|string',
            'evidence' => 'nullable|string',
            'attested' => 'required|accepted',
            'isAnonymous' => 'boolean',
            // Conditional validation based on anonymity
            'name' => 'required_if:isAnonymous,false|nullable|string',
            'school' => 'required_if:isAnonymous,false|nullable|string',
        ]);

        ViolationReport::create([
            'incident_type' => $validated['incidentType'],
            'description' => $validated['description'],
            'evidence' => $validated['evidence'],
            'is_anonymous' => $request->isAnonymous ?? false,
            'name' => $request->isAnonymous ? null : $request->name,
            'school' => $request->isAnonymous ? null : $request->school,
            'status' => 'Pending',
        ]);

        return redirect()->back()->with('success', 'Report submitted successfully.');
    }

    // Admin: List reports
    public function index()
    {
        $reports = ViolationReport::latest()->paginate(10);
        return Inertia::render('Admin/ViolationReports/Index', [
            'reports' => $reports
        ]);
    }

    // Admin: Update status
    public function update(Request $request, ViolationReport $report)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Reviewed,Resolved,Dismissed',
        ]);

        $report->update($validated);

        return redirect()->back()->with('success', 'Report status updated.');
    }
}
