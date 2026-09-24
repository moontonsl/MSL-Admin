<?php

namespace App\Http\Controllers;

use App\Models\CampusTournament;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;


class CampusTournamentController extends Controller
{
    /**
     * Display tournaments for SL (Student Leader)
     */
    public function slIndex()
    {
        $user = Auth::user();

        // Automatic Lock Check:
        // Check for any approved tournaments for this school that have passed their end_date but aren't locked yet.
        $expiredTournaments = CampusTournament::where('school_name', $user->university)
            ->where('status', 'approved')
            ->where('registration_locked', false)
            ->whereDate('end_date', '<', now())
            ->get();

        foreach ($expiredTournaments as $et) {
            $this->performRegistrationLock($et->id);
        }

        // Get tournaments for this SL's school with teams and members
        $tournaments = CampusTournament::where('school_name', $user->university)
            ->with(['teams' => function($query) {
                $query->whereIn('status', ['registered', 'assembling']);
            }, 'teams.members' => function($query) {
                $query->select('id', 'team_id', 'player_id', 'role', 'lane_role', 'status')
                      ->orderByRaw("CASE WHEN role = 'captain' THEN 1 ELSE 2 END")
                      ->orderBy('id', 'asc');
            }, 'teams.members.player'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Debug: Log the tournaments to see the actual data
        \Log::info('Tournaments for SL:', $tournaments->toArray());
            
        return Inertia::render('Campus Tournament/CampusTournament SL', [
            'tournaments' => $tournaments,
            'user' => $user
        ]);
    }

    // Removed separate SL pending view; integrated pending list within SL dashboard

    /**
     * Display tournament requests for Regional Admin
     */
    public function regionalAdminIndex()
    {
        $user = Auth::user();
        
        // Get pending tournament requests for this region
        $query = CampusTournament::with(['studentLeader'])
            ->where('status', 'pending');
            
        // Filter by region only for Regional Admins
        if ($user->role === 'Regional Admin') {
            $assignedRegionIds = $user->getAssignedRegionIds();
            if (!empty($assignedRegionIds)) {
                $query->whereHas('studentLeader', function($q) use ($assignedRegionIds) {
                    $q->whereIn('region', $assignedRegionIds);
                });
            } else {
                $query->whereHas('studentLeader', function($q) use ($user) {
                    $q->where('region', $user->region);
                });
            }
        }
        // Super Admins see all pending requests (no filter applied)
        
        $tournaments = $query->orderBy('created_at', 'desc')->get();
        
        // Get approved tournaments with teams and members for the Ongoing Tournaments section
        // Show all approved tournaments (both active and completed) so we can filter them on frontend
        $approvedQuery = CampusTournament::with([
            'teams' => function($query) {
                $query->whereIn('status', ['registered', 'assembling']);
            },
            'teams.members' => function($query) {
                $query->select('id', 'team_id', 'player_id', 'role', 'lane_role', 'status')
                      ->orderByRaw("CASE WHEN role = 'captain' THEN 1 ELSE 2 END")
                      ->orderBy('id', 'asc');
            },
            'teams.members.player',
            'studentLeader'
        ])->where('status', 'approved');
        
        // Filter by region only for Regional Admins
        if ($user->role === 'Regional Admin') {
            $assignedRegionIds = $user->getAssignedRegionIds();
            if (!empty($assignedRegionIds)) {
                $approvedQuery->whereHas('studentLeader', function($q) use ($assignedRegionIds) {
                    $q->whereIn('region', $assignedRegionIds);
                });
            } else {
                $approvedQuery->whereHas('studentLeader', function($q) use ($user) {
                    $q->where('region', $user->region);
                });
            }
        }
        // Super Admins see all approved tournaments
        
        $approvedTournaments = $approvedQuery->orderBy('start_date', 'desc')->get();
        
        // Debug: Log the tournaments to see the actual data
        \Log::info('Tournaments for Regional/Super Admin:', $tournaments->toArray());
        
        return Inertia::render('Campus Tournament/Regional Admin', [
            'tournaments' => $tournaments,
            'approvedTournaments' => $approvedTournaments,
            'user' => $user
        ]);
    }

    /**
     * Store a new tournament request
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        // Only SL can create tournaments
        if ($user->role !== 'SL') {
            return response()->json(['error' => 'Only Student Leaders can create tournaments'], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'tournament_type' => 'required|in:Online,Onsite',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if a tournament already exists for this school with overlapping dates
        $existingTournament = CampusTournament::where('school_name', $user->university)
            ->where('status', '!=', 'rejected')
            ->where(function ($query) use ($request) {
                $query->where('start_date', '<=', $request->end_date)
                      ->where('end_date', '>=', $request->start_date);
            })
            ->exists();
            
        if ($existingTournament) {
            return response()->json(['error' => 'A tournament is already scheduled completely or partially on these dates.'], 422);
        }
        
        $tournament = CampusTournament::create([
            'school_name' => $user->university,
            'sl_name' => $user->name . ' ' . $user->surname,
            'sl_id' => $user->id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'tournament_type' => $request->tournament_type,
            'status' => 'pending',
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Tournament request submitted successfully',
            'tournament' => $tournament
        ]);
    }

    /**
     * Approve a tournament request
     */
    public function approve(Request $request, $id)
    {
        $user = Auth::user();
        
        // Only Regional Admin or Super Admin can approve
        if ($user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Only Regional Admins or Super Admins can approve tournaments'], 403);
        }
        
        $tournament = CampusTournament::findOrFail($id);
        
        // Check if user has access to this region
        $hasAccess = false;
        if ($user->role === 'Super Admin') {
            $hasAccess = true;
        } elseif ($user->role === 'Regional Admin') {
            $assignedRegionIds = $user->getAssignedRegionIds();
            
            // Fix: Explicitly include user's own region to handle potential lookup failures
            if ($user->region && !in_array($user->region, $assignedRegionIds)) {
                $assignedRegionIds[] = $user->region;
            }

            if (!empty($assignedRegionIds)) {
                $hasAccess = in_array($tournament->studentLeader->region, $assignedRegionIds);
            } else {
                $hasAccess = $tournament->studentLeader->region == $user->region;
            }
        }
        
        if (!$hasAccess) {
            return response()->json(['error' => 'Access denied to this tournament'], 403);
        }
        
        $tournament->update([
            'status' => 'approved',
            'approved_by' => $user->id,
            'approved_at' => now(),
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Tournament approved successfully'
        ]);
    }

    /**
     * Reject a tournament request
     */
    public function reject(Request $request, $id)
    {
        $user = Auth::user();
        
        // Only Regional Admin or Super Admin can reject
        if ($user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Only Regional Admins or Super Admins can reject tournaments'], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'rejection_reason' => 'required|string|max:1000',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $tournament = CampusTournament::findOrFail($id);
        
        // Check if user has access to this region
        $hasAccess = false;
        if ($user->role === 'Super Admin') {
            $hasAccess = true;
        } elseif ($user->role === 'Regional Admin') {
            $assignedRegionIds = $user->getAssignedRegionIds();
            
            // Fix: Explicitly include user's own region to handle potential lookup failures
            if ($user->region && !in_array($user->region, $assignedRegionIds)) {
                $assignedRegionIds[] = $user->region;
            }

            if (!empty($assignedRegionIds)) {
                $hasAccess = in_array($tournament->studentLeader->region, $assignedRegionIds);
            } else {
                $hasAccess = $tournament->studentLeader->region == $user->region;
            }
        }
        
        if (!$hasAccess) {
            return response()->json(['error' => 'Access denied to this tournament'], 403);
        }
        
        $tournament->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
            'approved_by' => $user->id,
            'approved_at' => now(),
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Tournament rejected successfully'
        ]);
    }

    /**
     * Extend tournament registration deadline
     */
    public function extendRegistration(Request $request, $id)
    {
        $user = Auth::user();
        
        // Only Regional Admin or Super Admin can extend
        if ($user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Only Regional Admins or Super Admins can extend tournaments'], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'end_date' => 'required|date|after_or_equal:today',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $tournament = CampusTournament::findOrFail($id);
        
        // Check if user has access to this region
        $hasAccess = false;
        if ($user->role === 'Super Admin') {
            $hasAccess = true;
        } elseif ($user->role === 'Regional Admin') {
            $assignedRegionIds = $user->getAssignedRegionIds();
            
            // Fix: Explicitly include user's own region to handle potential lookup failures
            if ($user->region && !in_array($user->region, $assignedRegionIds)) {
                $assignedRegionIds[] = $user->region;
            }

            if (!empty($assignedRegionIds)) {
                $hasAccess = in_array($tournament->studentLeader->region, $assignedRegionIds);
            } else {
                $hasAccess = $tournament->studentLeader->region == $user->region;
            }
        }
        
        if (!$hasAccess) {
            return response()->json(['error' => 'Access denied to this tournament'], 403);
        }
        
        // Update the end_date and unlock registration
        $tournament->update([
            'end_date' => $request->end_date,
            'registration_locked' => false,
        ]);

        // Restore any teams that were archived during the previous lock
        // so players can continue assembling their rosters
        \App\Models\CampusTournamentTeam::where('tournament_id', $tournament->id)
            ->where('status', 'archived')
            ->update(['status' => 'assembling']);

        return response()->json([
            'success' => true,
            'message' => 'Tournament registration extended successfully',
            'tournament' => $tournament
        ]);
    }

    /**
     * Extend registration deadline for ALL ongoing tournaments
     */
    public function bulkExtendRegistration(Request $request)
    {
        $user = Auth::user();
        
        // Only Super Admin can bulk extend
        if ($user->role !== 'Super Admin') {
            return response()->json(['error' => 'Only Super Admins can bulk extend tournaments'], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'end_date' => 'required|date|after_or_equal:today',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Update all "approved" tournaments that are not yet "completed" (results submitted)
        $affectedTournaments = CampusTournament::where('status', 'approved')
            ->where('results_submitted', false)
            ->get();

        $affectedRows = $affectedTournaments->count();

        CampusTournament::whereIn('id', $affectedTournaments->pluck('id'))
            ->update([
                'end_date' => $request->end_date,
                'registration_locked' => false,
            ]);

        // Restore archived teams for all affected tournaments
        \App\Models\CampusTournamentTeam::whereIn('tournament_id', $affectedTournaments->pluck('id'))
            ->where('status', 'archived')
            ->update(['status' => 'assembling']);

        return response()->json([
            'success' => true,
            'message' => "Successfully updated {$affectedRows} tournament(s) end date.",
        ]);
    }

    /**
     * Delete a tournament (only SL who created it)
     */
    public function destroy($id)
    {
        $user = Auth::user();
        
        $tournament = CampusTournament::findOrFail($id);
        
        // Allow Regional Admin and Super Admin to delete
        if ($user->role === 'Regional Admin' || $user->role === 'Super Admin') {
            // Authorized
        } elseif ($tournament->sl_id !== $user->id || !in_array($tournament->status, ['pending', 'rejected'])) {
            return response()->json(['error' => 'You can only delete your own pending or rejected tournaments'], 403);
        }
        
        $tournament->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Tournament deleted successfully'
        ]);
    }

    /**
     * Display all approved tournaments with teams (for testing purposes)
     */
    public function publicIndex()
    {
        // Get all approved tournaments with teams and members
        $tournaments = CampusTournament::where('status', 'approved')
            ->with([
                'teams' => function($query) {
                    $query->where('status', 'registered');
                },
                'teams.members' => function($query) {
                    $query->orderByRaw("CASE WHEN role = 'captain' THEN 1 ELSE 2 END");
                }, 
                'teams.members.player', 
                'studentLeader'
            ])
            ->orderBy('start_date', 'desc')
            ->get();
            
        return Inertia::render('Campus Tournament/CampusTournament SL', [
            'tournaments' => $tournaments,
            'user' => null
        ]);
    }

    /**
     * Submit tournament results
     */
    public function submitResults(Request $request, $id)
    {
        $user = Auth::user();
        
        // Only SL can submit results
        if ($user->role !== 'SL') {
            return response()->json(['error' => 'Only Student Leaders can submit results'], 403);
        }
        
        $tournament = CampusTournament::with(['teams' => function($query) {
            $query->where('status', 'registered');
        }])->findOrFail($id);
        
        // Check if user's school matches the tournament's school
        if ($tournament->school_name !== $user->university) {
            return response()->json(['error' => 'You can only submit results for tournaments in your school'], 403);
        }
        
        // Check if tournament is approved
        if ($tournament->status !== 'approved') {
            return response()->json(['error' => 'Only approved tournaments can have results submitted'], 400);
        }
        
        // Check if results are already submitted
        if ($tournament->results_submitted) {
            return response()->json(['error' => 'Results have already been submitted for this tournament'], 400);
        }
        
        $validator = Validator::make($request->all(), [
            'results' => 'required|array',
            'results.*.team_id' => 'required|integer|exists:campus_tournament_teams,id',
            'results.*.result' => 'required|in:participant,1st,2nd,3rd,4th',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $tournamentTeamIds = $tournament->teams->pluck('id')->toArray();
        
        // Filter out any results that are for non-registered teams (like pending) 
        // to prevent submission blockage.
        $results = array_filter($request->results, function($result) use ($tournamentTeamIds) {
            return in_array($result['team_id'], $tournamentTeamIds);
        });
        
        $resultTeamIds = array_column($results, 'team_id');
        
        if (count($tournamentTeamIds) !== count($resultTeamIds) || 
            !empty(array_diff($tournamentTeamIds, $resultTeamIds))) {
            return response()->json(['error' => 'Results must be provided for all registered teams in the tournament'], 422);
        }
        
        $registeredTeamsCount = count($tournamentTeamIds);
        
        // Bracket validation logic based on the image mapping
        $maxFirst = 1; $maxSecond = 1; $maxThird = 0; $maxFourth = 0;
        
        if ($registeredTeamsCount <= 7) {
             $maxFirst = 1; $maxSecond = 1; $maxThird = 0; $maxFourth = 0;
        } elseif ($registeredTeamsCount >= 8 && $registeredTeamsCount <= 15) {
             $maxFirst = 1; $maxSecond = 1; $maxThird = 1; $maxFourth = 0;
        } elseif ($registeredTeamsCount >= 16 && $registeredTeamsCount <= 23) {
             $maxFirst = 1; $maxSecond = 1; $maxThird = 1; $maxFourth = 1;
        } elseif ($registeredTeamsCount >= 24 && $registeredTeamsCount <= 31) {
             $maxFirst = 2; $maxSecond = 2; $maxThird = 2; $maxFourth = 1;
        } elseif ($registeredTeamsCount >= 32 && $registeredTeamsCount <= 39) {
             $maxFirst = 2; $maxSecond = 2; $maxThird = 2; $maxFourth = 2;
        } elseif ($registeredTeamsCount >= 40 && $registeredTeamsCount <= 47) {
             $maxFirst = 3; $maxSecond = 3; $maxThird = 3; $maxFourth = 2;
        } else {
             $maxFirst = 3; $maxSecond = 3; $maxThird = 3; $maxFourth = 3;
        }

        // Onsite tournaments always have at least 1st-4th if teams are available
        if ($tournament->tournament_type === 'Onsite') {
            if ($registeredTeamsCount >= 3) {
                $maxThird = max($maxThird, 1);
            }
            if ($registeredTeamsCount >= 4) {
                $maxFourth = max($maxFourth, 1);
            }
        }
        
        $firstCount = count(array_filter($results, function($r) { return $r['result'] === '1st'; }));
        $secondCount = count(array_filter($results, function($r) { return $r['result'] === '2nd'; }));
        $thirdCount = count(array_filter($results, function($r) { return $r['result'] === '3rd'; }));
        $fourthCount = count(array_filter($results, function($r) { return $r['result'] === '4th'; }));
        
        if ($firstCount !== $maxFirst) {
            return response()->json(['error' => "You must select exactly {$maxFirst} 1st place team(s) based on {$registeredTeamsCount} registered teams."], 422);
        }
        if ($secondCount !== $maxSecond) {
            return response()->json(['error' => "You must select exactly {$maxSecond} 2nd place team(s)."], 422);
        }
        if ($thirdCount !== $maxThird) {
            return response()->json(['error' => ($maxThird > 0 ? "You must select exactly {$maxThird} 3rd place team(s)." : "3rd place is not available for this bracket.")], 422);
        }
        if ($fourthCount !== $maxFourth) {
            return response()->json(['error' => ($maxFourth > 0 ? "You must select exactly {$maxFourth} 4th place team(s)." : "4th place is not available for this bracket.")], 422);
        }
        
        try {
            // Update team results
            foreach ($results as $result) {
                $team = $tournament->teams->find($result['team_id']);
                if ($team) {
                    $team->update(['result' => $result['result']]);
                }
            }
            
            // Mark tournament as results submitted
            $tournament->update([
                'results_submitted' => true,
                'results_submitted_at' => now(),
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Tournament results submitted successfully'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error submitting tournament results: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to submit results. Please try again.'], 500);
        }
    }

    /**
     * Update already submitted tournament results
     */
    public function updateResults(Request $request, $id)
    {
        $user = Auth::user();
        
        // Allow SL, Regional Admin, and Super Admin
        if ($user->role !== 'SL' && $user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Unauthorized to update results'], 403);
        }
        
        $tournament = CampusTournament::with(['teams' => function($query) {
            $query->where('status', 'registered');
        }])->findOrFail($id);
        
        // Check permissions
        if ($user->role === 'SL') {
            // SL's school must match the tournament's school
            if ($tournament->school_name !== $user->university) {
                return response()->json(['error' => 'You can only update results for tournaments in your school'], 403);
            }
        }
        // Regional Admins/Super Admins bypass the sl_id check (Region check is implicitly handled by what they can see/access, 
        // strictly we should check region again but for this edit feature we assume access if they have the ID)
        
        // Check if tournament is approved
        if ($tournament->status !== 'approved') {
            return response()->json(['error' => 'Only approved tournaments can have results updated'], 400);
        }
        
        // Check if results are submitted (this endpoint is specifically for editing submitted results)
        if (!$tournament->results_submitted) {
            return response()->json(['error' => 'Results have not been submitted yet. Use submit endpoint instead.'], 400);
        }
        
        $validator = Validator::make($request->all(), [
            'results' => 'required|array',
            'results.*.team_id' => 'required|integer|exists:campus_tournament_teams,id',
            'results.*.result' => 'required|in:participant,1st,2nd,3rd,4th',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $tournamentTeamIds = $tournament->teams->pluck('id')->toArray();
        
        // Filter out any results that are for non-registered teams (like pending) 
        // to prevent submission blockage.
        $results = array_filter($request->results, function($result) use ($tournamentTeamIds) {
            return in_array($result['team_id'], $tournamentTeamIds);
        });
        
        $resultTeamIds = array_column($results, 'team_id');
        
        if (count($tournamentTeamIds) !== count($resultTeamIds) || 
            !empty(array_diff($tournamentTeamIds, $resultTeamIds))) {
            return response()->json(['error' => 'Results must be provided for all registered teams in the tournament'], 422);
        }
        
        $registeredTeamsCount = count($tournamentTeamIds);
        
        // Bracket validation logic based on the image mapping
        $maxFirst = 1; $maxSecond = 1; $maxThird = 0; $maxFourth = 0;
        
        if ($registeredTeamsCount <= 7) {
             $maxFirst = 1; $maxSecond = 1; $maxThird = 0; $maxFourth = 0;
        } elseif ($registeredTeamsCount >= 8 && $registeredTeamsCount <= 15) {
             $maxFirst = 1; $maxSecond = 1; $maxThird = 1; $maxFourth = 0;
        } elseif ($registeredTeamsCount >= 16 && $registeredTeamsCount <= 23) {
             $maxFirst = 1; $maxSecond = 1; $maxThird = 1; $maxFourth = 1;
        } elseif ($registeredTeamsCount >= 24 && $registeredTeamsCount <= 31) {
             $maxFirst = 2; $maxSecond = 2; $maxThird = 2; $maxFourth = 1;
        } elseif ($registeredTeamsCount >= 32 && $registeredTeamsCount <= 39) {
             $maxFirst = 2; $maxSecond = 2; $maxThird = 2; $maxFourth = 2;
        } elseif ($registeredTeamsCount >= 40 && $registeredTeamsCount <= 47) {
             $maxFirst = 3; $maxSecond = 3; $maxThird = 3; $maxFourth = 2;
        } else {
             $maxFirst = 3; $maxSecond = 3; $maxThird = 3; $maxFourth = 3;
        }

        // Onsite tournaments always have at least 1st-4th if teams are available
        if ($tournament->tournament_type === 'Onsite') {
            if ($registeredTeamsCount >= 3) {
                $maxThird = max($maxThird, 1);
            }
            if ($registeredTeamsCount >= 4) {
                $maxFourth = max($maxFourth, 1);
            }
        }
        
        $firstCount = count(array_filter($results, function($r) { return $r['result'] === '1st'; }));
        $secondCount = count(array_filter($results, function($r) { return $r['result'] === '2nd'; }));
        $thirdCount = count(array_filter($results, function($r) { return $r['result'] === '3rd'; }));
        $fourthCount = count(array_filter($results, function($r) { return $r['result'] === '4th'; }));
        
        if ($firstCount !== $maxFirst) {
            return response()->json(['error' => "You must select exactly {$maxFirst} 1st place team(s) based on {$registeredTeamsCount} registered teams."], 422);
        }
        if ($secondCount !== $maxSecond) {
            return response()->json(['error' => "You must select exactly {$maxSecond} 2nd place team(s)."], 422);
        }
        if ($thirdCount !== $maxThird) {
            return response()->json(['error' => ($maxThird > 0 ? "You must select exactly {$maxThird} 3rd place team(s)." : "3rd place is not available for this bracket.")], 422);
        }
        if ($fourthCount !== $maxFourth) {
            return response()->json(['error' => ($maxFourth > 0 ? "You must select exactly {$maxFourth} 4th place team(s)." : "4th place is not available for this bracket.")], 422);
        }
        
        try {
            // Update team results
            foreach ($results as $result) {
                $team = $tournament->teams->find($result['team_id']);
                if ($team) {
                    $team->update(['result' => $result['result']]);
                }
            }
            
            // Touch the tournament timestamp/results_submitted_at if needed
            $tournament->update([
                'results_submitted_at' => now(), // Update the submitted time to show it was edited
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Tournament results updated successfully'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error updating tournament results: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update results. Please try again.'], 500);
        }
    }

    /**
     * Show team view for registered team members
     */
    /**
     * Show team view for registered team members
     */
    public function teamView(\Illuminate\Http\Request $request)
    {
        // 1. Priority: Check for Signed URL (Invite Link)
        // The user wants the Invite Link to ALWAYS show the Login Page first,
        // even if the user is already logged in.
        if ($request->has('signature')) {
            if (!$request->hasValidSignature()) {
                abort(403, 'Invalid or expired invite link.');
            }

            // Valid Signature (Team Invite): Render Login Page with Team Invite Context.
            $inviteTeamId = $request->query('invite_team_id');
            return Inertia::render('Campus Tournament/Registration', [
                'inviteTeamId' => $inviteTeamId
            ]);
        }

        // 2. Standard Access: Must be Authenticated
        if (Auth::check()) {
            $user = Auth::user();
        } else {
            // Unauthenticated and NO signature -> Block.
            abort(403, 'Unauthorized access.');
        }
        
        if (!$user) {
            return Inertia::render('Campus Tournament/Campus Tournament Team', [
                'team' => null,
                'user' => null,
                'message' => 'User not found or access denied.'
            ]);
        }
        
        // Find the team where this user is a member
        // Prioritize teams in active tournaments (results not submitted) and recent teams
        $teamMember = \App\Models\CampusTournamentTeamMember::where('player_id', $user->id)
            ->whereIn('status', ['accepted', 'pending'])
            ->whereHas('team.tournament', function($query) {
                $query->where('status', 'approved')
                     // Prefer active tournaments first, so we don't show old ones
                      ->orderBy('results_submitted', 'asc') 
                      ->orderBy('end_date', 'desc');
            })
            ->with(['team.tournament', 'team.members' => function($query) {
                // Sorting logic for members
                $query->orderByRaw("CASE WHEN role = 'captain' THEN 1 ELSE 2 END")
                      ->orderBy('id', 'asc');
            }, 'team.members.player' => function($query) {
                // Include facebook_link in player data
                $query->select('id', 'name', 'surname', 'username', 'facebook_link');
            }])
            // Order by creation time to get the NEWEST team (resolves duplicate issue)
            ->latest() 
            ->first();
        
        if (!$teamMember) {
            return Inertia::render('Campus Tournament/Campus Tournament Team', [
                'team' => null,
                'user' => $user,
                'message' => 'You are not registered in any team.'
            ]);
        }
        
        $team = $teamMember->team;
        $isCaptain = $teamMember->role === 'captain';
        
        // Auto-register: if all members have accepted, set team status to registered
        if ($team->status === 'assembling') {
            $allAccepted = $team->members->every(fn($m) => $m->status === 'accepted');
            if ($allAccepted && $team->members->count() >= 5) {
                $team->update(['status' => 'registered']);
                $team->refresh();
            }
        }
        
        return Inertia::render('Campus Tournament/Campus Tournament Team', [
            'team' => $team,
            'user' => $user,
            'isCaptain' => $isCaptain
        ]);
    }



    /**
     * Finalize and submit a team
     */
    /**
     * Finalize and submit a team
     */
    public function submitTeam(Request $request, $id)
    {
        // Allow manual user_id override for guest access
        $userId = $request->input('user_id');
        $user = $userId ? \App\Models\User::find($userId) : Auth::user();

        if (!$user) {
             return redirect()->back()->withErrors(['message' => 'Unauthorized: User not found']);
        }

        $team = \App\Models\CampusTournamentTeam::with('members')->findOrFail($id);
        
        // 1. Check if user is the captain
        $captainMember = $team->members()->where('role', 'captain')->where('player_id', $user->id)->first();
        if (!$captainMember) {
            return redirect()->back()->withErrors(['message' => 'Only the team captain can submit the team.']);
        }
        
        // 2. Check if team is already registered
        if ($team->status === 'registered') {
             return redirect()->back()->withErrors(['message' => 'Team is already registered.']);
        }

        // 3. Check if we have 5 members
        if ($team->members()->count() !== 5) {
             return redirect()->back()->withErrors(['message' => 'Team must have exactly 5 members.']);
        }
        
        // 4. Check if all members have accepted
        $pendingCount = $team->members()->where('status', '!=', 'accepted')->count();
        if ($pendingCount > 0) {
             return redirect()->back()->withErrors(['message' => 'All team members must accept their invites before submitting.']);
        }
        
        // 5. Update status
        $team->update(['status' => 'registered']);
        
        return redirect()->back()->with('message', 'Team submitted successfully! Your roster is now final.');
    }

    /**
     * Generate a unique invite code for a team
     */
    public function generateInviteCode(Request $request, $id)
    {
        $userId = $request->input('user_id');
        $user = $userId ? \App\Models\User::find($userId) : Auth::user();

        if (!$user) {
             return response()->json(['error' => 'Unauthorized: User not found'], 401);
        }

        $team = \App\Models\CampusTournamentTeam::findOrFail($id);
        
        // Only captain can generate code
        if ($team->captain_id !== $user->id) {
            return response()->json(['error' => 'Only the team captain can generate an invite code.'], 403);
        }

        // Generate unique alphanumeric 6-character code
        do {
            $code = strtoupper(substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 6));
        } while (\App\Models\CampusTournamentTeam::where('invite_code', $code)->exists());

        $team->update(['invite_code' => $code]);

        return redirect()->back()->with('message', 'Team Invite Code generated successfully!');
    }

    /**
     * Update an existing team
     */
    public function updateTeam(Request $request, $teamId)
    {
        // 1. Validate the request
        $request->validate([
            'teamName' => 'required|string|max:50',
            'discordId' => 'nullable|string|max:50',
            'captain' => 'required|array',
            'captain.id' => 'required|integer',
            'players' => 'required|array',
            'players.captain' => 'required|array',
            'players.player2' => 'required|array',
            'players.player3' => 'required|array',
            'players.player4' => 'required|array',
            'players.player5' => 'required|array',
        ]);
        
        $captain = $request->captain;
        
        if (!Auth::check()) {
            return redirect()->back()->withErrors(['message' => 'Unauthorized']);
        }
        $user = Auth::user();
        
        // 2. Find the existing team
        $team = \App\Models\CampusTournamentTeam::find($teamId);
        if (!$team) {
            return redirect()->back()->withErrors(['message' => 'Team not found']);
        }
        
        // 3. Check if current user is the captain
        if ($team->captain_id !== $user->id) {
            return redirect()->back()->withErrors(['message' => 'Only the team captain can edit the team']);
        }
        
        // 4. IMPORTANT: Check if team can be updated
        $tournament = $team->tournament;
        $now = now();
        // Since dates are 'date' casts, start_date is midnight. end_date is also midnight of that day.
        $isWithinRegistration = $tournament && 
            $now->gte($tournament->start_date) && 
            $now->lte(\Carbon\Carbon::parse($tournament->end_date)->endOfDay());
        
        if ($team->status === 'registered' && !$isWithinRegistration) {
             return redirect()->back()->withErrors(['message' => 'Team cannot be updated after the registration period has ended.']);
        }

        // 5. Check if team name already exists (Case-Insensitive)
        $existingTeamName = \App\Models\CampusTournamentTeam::whereRaw('LOWER(team_name) = ?', [strtolower($request->teamName)])
            ->where('tournament_id', $team->tournament_id)
            ->where('id', '!=', $teamId)
            ->first();
        
        if ($existingTeamName) {
            return redirect()->back()->withErrors(['message' => 'Team Name Already Taken']);
        }
        
        \DB::beginTransaction();
        try {
            // 6. Update team details
            $team->update([
                'team_name' => $request->teamName,
                'discord_id' => $request->discordId,
            ]);
            
            // 8. Handle Members Update
            $currentMembers = \App\Models\CampusTournamentTeamMember::where('team_id', $teamId)->get()->keyBy('player_id');
            
            $players = [
                $request->players['captain'],
                $request->players['player2'],
                $request->players['player3'],
                $request->players['player4'],
                $request->players['player5'],
            ];
            
            $newPlayerIds = [];
            
            foreach ($players as $player) {
                if (isset($player['id'])) {
                    $newPlayerIds[] = $player['id'];
                    $playerId = $player['id'];
                    
                    // Safety: Determine if this player is the captain based on the team's captain_id
                    // This ensures that even if the request is inconsistent, the database stays correct.
                    $role = ($playerId == $team->captain_id || $playerId == $captain['id']) ? 'captain' : 'member';
                    
                    if (isset($currentMembers[$playerId])) {
                         $currentMembers[$playerId]->update(['role' => $role]);
                    } else {
                        \App\Models\CampusTournamentTeamMember::create([
                            'team_id' => $team->id,
                            'player_id' => $playerId,
                            'role' => $role,
                            'status' => ($role == 'captain') ? 'accepted' : 'pending',
                        ]);
                    }
                }
            }
            
            // 9. Remove members not in the new list
            \App\Models\CampusTournamentTeamMember::where('team_id', $teamId)
                ->whereNotIn('player_id', $newPlayerIds)
                ->delete();
            
            \DB::commit();
            
            // Redirect to Team View (campus.team) instead of back()
            // Pass user_id if we have it (for guest/unauth context flow)
            $params = [];
            if ($user) {
                $params['user_id'] = $user->id;
            }
            
            return redirect()->route('campus.team', $params)->with('message', 'Team updated successfully');
            
        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('Team update error: ' . $e->getMessage());
            return redirect()->back()->withErrors(['message' => 'Update failed. ' . $e->getMessage()]);
        }
    }

    /**
     * Export tournament results to Excel
     */
    public function exportToExcel($id)
    {
        try {
            $user = Auth::user();

            // Allow SL, Regional Admin, and Super Admin
            if ($user->role !== 'SL' && $user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
                return response()->json(['error' => 'Unauthorized to export results'], 403);
            }

            // Increase limits for export reliability.
            if (function_exists('ini_set')) {
                @ini_set('memory_limit', '512M');
                @ini_set('max_execution_time', '300');
            }
            if (function_exists('set_time_limit')) {
                @set_time_limit(300);
            }

            $tournament = CampusTournament::with(['teams' => function($query) {
                $query->where('status', 'registered');
            }, 'teams.members.player'])->findOrFail($id);

            // Check permissions
            if ($user->role === 'SL') {
                // SL's school must match the tournament's school
                if ($tournament->school_name !== $user->university) {
                    return response()->json(['error' => 'You can only export results for tournaments in your school'], 403);
                }
            }

            // Check if results are submitted
            if (!$tournament->results_submitted) {
                return response()->json(['error' => 'Results must be submitted before exporting'], 400);
            }

            // Create new Spreadsheet
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
        
        // Add Tournament Info at the top
        $sheet->setCellValue('A2', 'Registration Start Date:');
        $sheet->setCellValue('B2', $tournament->start_date ? $tournament->start_date->format('F d, Y') : '-');

        $sheet->setCellValue('A3', 'Registration End Date:');
        $sheet->setCellValue('B3', $tournament->end_date ? $tournament->end_date->format('F d, Y') : '-');

        $sheet->setCellValue('A4', 'Results Submitted:');
        $sheet->setCellValue('B4', $tournament->results_submitted_at ? $tournament->results_submitted_at->format('F d, Y h:i A') : '-');

        $sheet->setCellValue('A5', 'Submitted By:');
        $sheet->setCellValue('B5', $tournament->sl_name ?? '-');

        $sheet->setCellValue('A6', 'Tournament Type:');
        $sheet->setCellValue('B6', $tournament->tournament_type ? ucwords($tournament->tournament_type) : '-');

        // Calculate Bracket Type
        $registeredTeamsCount = $tournament->teams->count();
        $bracketType = '-';
        if ($registeredTeamsCount >= 4 && $registeredTeamsCount <= 7) $bracketType = '4 to 8 Teams';
        elseif ($registeredTeamsCount >= 8 && $registeredTeamsCount <= 15) $bracketType = '8 to 15 Teams';
        elseif ($registeredTeamsCount >= 16 && $registeredTeamsCount <= 23) $bracketType = '16 to 23 Teams';
        elseif ($registeredTeamsCount >= 24 && $registeredTeamsCount <= 31) $bracketType = '24 to 31 Teams';
        elseif ($registeredTeamsCount == 32) $bracketType = '32 Teams';
        elseif ($registeredTeamsCount >= 33 && $registeredTeamsCount <= 39) $bracketType = '33 to 39 Teams';
        elseif ($registeredTeamsCount >= 40 && $registeredTeamsCount <= 47) $bracketType = '40 to 47 Teams';
        elseif ($registeredTeamsCount >= 48) $bracketType = '48 Teams';
        else $bracketType = '< 4 Teams';

        $sheet->setCellValue('A7', 'Bracket Type:');
        $sheet->setCellValue('B7', $bracketType);

        // Style the labels
        $sheet->getStyle('A2:A7')->getFont()->setBold(true);

        // School Name at top right (Column F)
        $sheet->setCellValue('F1', strtoupper($tournament->school_name));
        $sheet->getStyle('F1')->getFont()->setBold(true);
        $sheet->getStyle('F1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);

        // Headers (starting at Row 9)
        $headers = ['Rank', 'Team Name', 'Player Name', 'IGN', 'Server', 'UID'];
        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '9', $header);
            $sheet->getStyle($col . '9')->getFont()->setBold(true);
            $sheet->getStyle($col . '9')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $col++;
        }
        
        // Sort teams by result
        $teams = $tournament->teams->sortBy(function($team) {
            $order = ['1st' => 1, '2nd' => 2, '3rd' => 3, '4th' => 4, 'participant' => 5];
            return $order[$team->result] ?? 6;
        });
        
        // Data rows starting at Row 10
        $row = 10;
        foreach ($teams as $team) {
            // Determine rank display text and color
            $result = $team->result ?? 'participant';
            $rankString = 'Participant';
            $rankColor = null;

            if ($result === '1st') {
                $rankString = '1st';
                $rankColor = 'FFFFCC00'; // Yellow/Gold
            } elseif ($result === '2nd') {
                $rankString = '2nd';
                $rankColor = 'FFC0C0C0'; // Silver
            } elseif ($result === '3rd') {
                $rankString = '3rd';
                $rankColor = 'FFCD7F32'; // Bronze
            } elseif ($result === '4th') {
                $rankString = '4th';
                $rankColor = 'FF90EE90'; // Light Green (or null if preferred, but adding a subtle color helps distinguish it)
            }

            // Get members sorted: Captain first, then others
            $members = $team->members->sortBy('role', SORT_REGULAR, true);

            foreach ($members as $member) {
                $player = $member->player;
                
                // Set Row Values
                $sheet->setCellValue('A' . $row, $rankString);
                $sheet->setCellValueExplicit('B' . $row, $team->team_name, \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
                $sheet->setCellValueExplicit('C' . $row, $player ? trim($player->name . ' ' . $player->surname) : 'Unknown', \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
                $sheet->setCellValueExplicit('D' . $row, $player ? $player->ml_ign : '-', \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
                $sheet->setCellValueExplicit('E' . $row, $player ? $player->ml_server : '-', \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
                $sheet->setCellValueExplicit('F' . $row, $player ? $player->ml_id : '-', \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);

                // Apply rank color to the rank and team name columns (A and B) as per image
                if ($rankColor) {
                    $sheet->getStyle('A' . $row . ':B' . $row)->getFill()
                        ->setFillType(Fill::FILL_SOLID)
                        ->getStartColor()->setARGB($rankColor);
                }

                $row++;
            }
        }
        
        // Auto-size columns A to F
        foreach (range('A', 'F') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }
        
        // Add borders to the table (starting from row 8)
        $lastRow = $row - 1;
        $sheet->getStyle('A9:F' . $lastRow)->getBorders()->getAllBorders()
            ->setBorderStyle(Border::BORDER_THIN);
        
        // Center alignment for certain columns
        $sheet->getStyle('A9:A' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('E9:F' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
        
            // Create a safe filename (avoid header-breaking characters).
            $safeSchoolName = preg_replace('/[^A-Za-z0-9_\-]/', '_', (string) $tournament->school_name);
            $safeSchoolName = trim($safeSchoolName, '_');
            if ($safeSchoolName === '') {
                $safeSchoolName = 'School';
            }
            $filename = 'Tournament_Results_' . $safeSchoolName . '_' . date('Y-m-d') . '.xlsx';

            // Create writer and save to output
            $writer = new Xlsx($spreadsheet);

            return response()->streamDownload(function() use ($writer) {
                // Prevent stray output from corrupting XLSX stream.
                while (ob_get_level() > 0) {
                    ob_end_clean();
                }
                $writer->save('php://output');
            }, $filename, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Cache-Control' => 'max-age=0',
            ]);
        } catch (\Throwable $e) {
            \Log::error('Campus tournament export failed', [
                'tournament_id' => $id,
                'user_id' => Auth::id(),
                'message' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Failed to export tournament results. Please try again.'], 500);
        }
    }
    /**
     * Export pre-registration data to Excel (Super Admin only)
     * Fetches ALL approved tournaments for the given island within a date range
     */
    public function exportPreReg(\Illuminate\Http\Request $request)
    {
        $user = Auth::user();

        // Only Super Admin can generate pre-registration export
        if ($user->role !== 'Super Admin') {
            return response()->json(['error' => 'Only Super Admins can generate pre-registration exports'], 403);
        }

        // Validate inputs
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'island'     => 'required|string',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Increase memory and execution limits for large exports
        if (function_exists('ini_set')) {
            @ini_set('memory_limit', '1024M');
            @ini_set('max_execution_time', '300');
        }
        if (function_exists('set_time_limit')) {
            @set_time_limit(300);
        }

        $island    = $request->island;
        $startDate = $request->start_date;
        $endDate   = $request->end_date;

        // Fetch ALL approved tournaments for the given island within the date range
        // Disable query log to save memory
        \DB::disableQueryLog();

        $query = CampusTournament::with([
                'teams' => function ($query) {
                    $query->whereIn('status', ['registered', 'assembling', 'pending']);
                },
                'teams.members' => function ($query) {
                    $query->with('player')
                          ->orderByRaw("CASE WHEN role = 'captain' THEN 1 ELSE 2 END")
                          ->orderBy('id', 'asc');
                },
                'studentLeader',
            ])
            ->where('status', 'approved')
            ->whereHas('studentLeader', function ($q) use ($island) {
                if ($island !== 'All') {
                    $q->where('island', $island);
                }
            })
            ->where(function ($q) use ($startDate, $endDate) {
                $q->whereBetween('start_date', [$startDate, $endDate])
                  ->orWhereBetween('end_date', [$startDate, $endDate]);
            })
            ->orderBy('start_date', 'asc');

        // Check if there are any results before creating the spreadsheet
        if ($query->count() === 0) {
            return response()->json(['error' => 'No approved tournaments found for the selected island and date range.'], 404);
        }

        // Create Spreadsheet
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Header info rows — show the user-selected date range
        $sheet->setCellValue('A1', 'Registration Start Date:');
        $sheet->setCellValue('B1', \Carbon\Carbon::parse($startDate)->format('F d, Y'));
        $sheet->setCellValue('A2', 'Registration End Date:');
        $sheet->setCellValue('B2', \Carbon\Carbon::parse($endDate)->format('F d, Y'));

        $sheet->getStyle('A1:A2')->getFont()->setBold(true);

        // Blank row 3, headers on row 4
        $headers = ['Island', 'School', 'Team Name', 'Player Name', 'IGN', 'Server', 'UID'];
        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '4', $header);
            $sheet->getStyle($col . '4')->getFont()->setBold(true);
            $sheet->getStyle($col . '4')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $col++;
        }

        // Data rows starting at row 5 — iterate ALL tournaments in chunks
        $row = 5;
        
        $query->chunk(50, function ($tournaments) use ($island, $sheet, &$row) {
            foreach ($tournaments as $tournament) {
                foreach ($tournament->teams as $team) {
                    $members = $team->members; // Already sorted by query

                    foreach ($members as $member) {
                        $player = $member->player;
                        // Use player island, fallback to SL island, then filter island
                        $playerIsland = ($player && $player->island) ? $player->island : ($tournament->studentLeader->island ?? $island);

                        $sheet->setCellValue('A' . $row, $playerIsland);
                        $sheet->setCellValue('B' . $row, $player ? $player->university : ($tournament->school_name ?? '-'));
                        $sheet->setCellValue('C' . $row, $team->team_name);
                        $sheet->setCellValue('D' . $row, $player ? trim($player->name . ' ' . $player->surname) : 'Unknown');
                        $sheet->setCellValueExplicit('E' . $row, $player ? $player->ml_ign : '-', \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
                        $sheet->setCellValueExplicit('F' . $row, $player ? $player->ml_server : '-', \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
                        $sheet->setCellValueExplicit('G' . $row, $player ? $player->ml_id : '-', \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);

                        $row++;
                    }
                }
            }
        });

        // Restore query log
        \DB::enableQueryLog();

        // Auto-size columns A-G
        foreach (range('A', 'G') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Add borders to table (row 4 onwards)
        $lastRow = $row - 1;
        if ($lastRow >= 4) {
            $sheet->getStyle('A4:G' . $lastRow)->getBorders()->getAllBorders()
                ->setBorderStyle(Border::BORDER_THIN);
        }

        // Center alignment for Island, IGN, Server, UID columns
        $sheet->getStyle('A4:A' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('E4:G' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);

        // Filename includes date range
        $filename = 'PreReg_' . str_replace(' ', '_', $island) . '_' . $startDate . '_to_' . $endDate . '.xlsx';

        $writer = new Xlsx($spreadsheet);

        return response()->streamDownload(function() use ($writer) {
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Cache-Control' => 'max-age=0',
        ]);
    }

    /**
     * Generate a signed invite link for a specific player
     */
    /**
     * Generate a signed invite link for the TEAM
     */
    public function generateInviteLink($teamId)
    {
        $user = Auth::user();
        
        // Find member record for auth user in this team
        $authMember = \App\Models\CampusTournamentTeamMember::where('player_id', $user->id)
            ->where('team_id', $teamId)
            ->where('role', 'captain')
            ->first();
            
        if (!$authMember) {
            return response()->json(['error' => 'Unauthorized. Only the team captain can generate links.'], 403);
        }

        // Generate Signed URL for the TEAM (valid for 7 days)
        // We use 'invite_team_id' to distinguish it from the old 'user_id' logic
        $url = \Illuminate\Support\Facades\URL::temporarySignedRoute(
            'campus.team',
            now()->addDays(7),
            ['invite_team_id' => $teamId]
        );
        
        return response()->json(['url' => $url]);
    }

    /**
     * Lock registration and fuse incomplete rosters
     */
    public function lockRegistration(Request $request, $id)
    {
        $user = Auth::user();
        $tournament = CampusTournament::findOrFail($id);

        // Authorization check
        if ($user->role !== 'Super Admin' && ($user->role !== 'SL' || $tournament->sl_id !== $user->id)) {
            return response()->json(['error' => 'Unauthorized to lock registration.'], 403);
        }

        return $this->performRegistrationLock($id);
    }

    /**
     * Core logic for locking registration and fusing rosters
     */
    protected function performRegistrationLock($id)
    {
        $tournament = CampusTournament::with(['teams' => function($q) {
            $q->where('status', 'assembling');
        }, 'teams.members'])->findOrFail($id);

        if ($tournament->registration_locked) {
            return response()->json(['error' => 'Registration is already locked.'], 422);
        }

        \DB::beginTransaction();
        try {
            // 1. Mark as locked
            $tournament->update(['registration_locked' => true]);

            // 2. Collect solo player pool BEFORE archiving (prioritise larger groups)
            $assemblingTeams = $tournament->teams;

            $sortedTeams = $assemblingTeams->filter(fn($t) => $t->type === 'solo')
                ->sortByDesc(fn($t) => $t->members->count());

            $playerPool = [];
            foreach ($sortedTeams as $team) {
                foreach ($team->members as $member) {
                    $playerPool[] = $member->player_id;
                }
            }

            // Deduplicate player pool (prevents players appearing in multiple fused teams)
            $playerPool = array_unique($playerPool);
            $playerPool = array_values($playerPool); // Re-index array after unique

            // 3. Archive all assembling teams instead of deleting them.
            //    They will be restored to 'assembling' if the tournament is extended.
            foreach ($assemblingTeams as $team) {
                $team->update(['status' => 'archived']);
            }

            // 4. Form teams of 5 from the solo pool (already sorted to keep groups together)
            $chunks = array_chunk($playerPool, 5);
            $fusedCount = 0;
            $standardRoles = ['Jungler', 'Roam', 'Gold Laner', 'Exp Laner', 'Mid Laner'];

            foreach ($chunks as $index => $chunk) {
                $teamName = "Fused Team " . ($index + 1) . " - " . date('md');

                $newTeam = \App\Models\CampusTournamentTeam::create([
                    'tournament_id' => $tournament->id,
                    'team_name' => $teamName,
                    'captain_id' => $chunk[0],
                    'status' => count($chunk) >= 5 ? 'registered' : 'assembling',
                    'type' => 'solo'
                ]);

                // Randomly assign roles for this team
                $teamRoles = $standardRoles;
                shuffle($teamRoles);

                foreach ($chunk as $cIndex => $playerId) {
                    \App\Models\CampusTournamentTeamMember::create([
                        'team_id' => $newTeam->id,
                        'player_id' => $playerId,
                        'role' => $cIndex === 0 ? 'captain' : 'member',
                        'lane_role' => $teamRoles[$cIndex] ?? 'Member',
                        'status' => 'accepted'
                    ]);
                }
                $fusedCount++;
            }

            \DB::commit();
            return response()->json([
                'success' => true, 
                'message' => "Registration locked! {$fusedCount} teams were fused/formed."
            ]);

        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('Registration lock error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to lock registration and fuse rosters.'], 500);
        }
    }

    /**
     * Solo Player Dashboard
     */
    public function soloDashboard()
    {
        $user = Auth::user();
        
        // Find active tournament for this school
        $tournament = \App\Models\CampusTournament::where('school_name', $user->university)
            ->where('status', 'approved')
            ->where('results_submitted', false)
            ->whereDate('end_date', '>=', now())
            ->first();

        $teams = [];
        if ($tournament) {
            $teams = \App\Models\CampusTournamentTeam::where('tournament_id', $tournament->id)
                ->where('type', 'solo')
                ->with(['members.player' => function($q) {
                    $q->select('id', 'name', 'surname', 'username', 'ml_ign', 'facebook_link');
                }])
                ->get();

            // Sanity check: ensure full teams are marked as registered
            foreach ($teams as $team) {
                if ($team->status === 'assembling' && $team->members->count() >= 5) {
                    $team->update(['status' => 'registered']);
                    $team->status = 'registered'; // Update local instance for immediate render
                }
            }
        }

        return Inertia::render('Campus Tournament/TournamentJoinDashboard', [
            'tournament' => $tournament,
            'teams' => $teams,
            'user' => $user
        ]);
    }

    /**
     * Create a new Solo Team
     */
    public function createSoloTeam(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'team_name' => 'required|string|max:50',
            'role' => 'required|string|in:Jungler,Roam,Gold Laner,Exp Laner,Mid Laner',
            'tournament_id' => 'required|exists:campus_tournaments,id',
        ]);

        // Same university check
        $tournament = \App\Models\CampusTournament::findOrFail($request->tournament_id);
        if ($tournament->school_name !== $user->university) {
            return response()->json(['error' => 'You can only create teams for your own university.'], 403);
        }

        // Roster Lock Check
        if ($tournament->registration_locked) {
            return response()->json(['error' => 'Registration is locked for this tournament.'], 403);
        }

        if (now()->gt(\Carbon\Carbon::parse($tournament->end_date)->endOfDay())) {
            return response()->json(['error' => 'Registration period has ended.'], 403);
        }

        // Existing membership check
        $existingMembership = \App\Models\CampusTournamentTeamMember::where('player_id', $user->id)
            ->whereHas('team.tournament', function($q) {
                $q->where('results_submitted', false)
                  ->whereDate('end_date', '>=', now());
            })->exists();

        if ($existingMembership) {
            return response()->json(['error' => 'You are already in a team.'], 422);
        }

        // Check if team name exists in this tournament
        $nameExists = \App\Models\CampusTournamentTeam::where('tournament_id', $tournament->id)
            ->where('team_name', $request->team_name)
            ->exists();
        
        if ($nameExists) {
            return response()->json(['error' => 'Team name already exists.'], 422);
        }

        \DB::beginTransaction();
        try {
            $team = \App\Models\CampusTournamentTeam::create([
                'tournament_id' => $tournament->id,
                'team_name' => $request->team_name,
                'captain_id' => $user->id,
                'status' => 'assembling',
                'type' => 'solo'
            ]);

            \App\Models\CampusTournamentTeamMember::create([
                'team_id' => $team->id,
                'player_id' => $user->id,
                'role' => 'captain',
                'lane_role' => $request->role, // I'll use lane_role to store the specific solo role
                'status' => 'accepted'
            ]);

            \DB::commit();
            return response()->json(['success' => true, 'message' => 'Team created successfully!']);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['error' => 'Failed to create team.'], 500);
        }
    }

    /**
     * Join an existing Solo Team
     */
    public function joinSoloTeam(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'team_id' => 'required|exists:campus_tournament_teams,id',
            'role' => 'required|string|in:Jungler,Roam,Gold Laner,Exp Laner,Mid Laner',
        ]);

        $team = \App\Models\CampusTournamentTeam::with('members', 'tournament')->findOrFail($request->team_id);
        $tournament = $team->tournament;

        // Roster Lock Check
        if ($tournament->registration_locked) {
            return response()->json(['error' => 'Registration is locked for this tournament.'], 403);
        }

        if (now()->gt(\Carbon\Carbon::parse($tournament->end_date)->endOfDay())) {
            return response()->json(['error' => 'Registration period has ended.'], 403);
        }
        
        // Same university check
        if ($team->tournament->school_name !== $user->university) {
            return back()->withErrors(['error' => 'You can only join teams from your own university.']);
        }

        // Solo team check
        if ($team->type !== 'solo') {
            return back()->withErrors(['error' => 'This is not a solo matchmaking team.']);
        }

        // Existing membership check
        $existingMembership = \App\Models\CampusTournamentTeamMember::where('player_id', $user->id)
            ->whereHas('team.tournament', function($q) {
                $q->where('results_submitted', false)
                  ->whereDate('end_date', '>=', now());
            })->exists();

        if ($existingMembership) {
            return response()->json(['error' => 'You are already in a team.'], 422);
        }

        // Check if role is taken in this team
        // Note: I'm assuming 'lane_role' exists or I should add it. 
        // In the migration plan I didn't mention lane_role, but solo players need distinct roles.
        // Wait, the members table has a 'role' column which usually stores 'captain' or 'member'.
        // I should probably add another column for the lane role if it doesn't exist.
        // Let's check the schema of campus_tournament_team_members.
        
        // Actually, the user's plan says: "Update the team list to show all 5 roles for solo teams."
        // And "Make vacant role slots clickable to 'Join' (Lock Role)."
        
        $roleTaken = $team->members()->where('lane_role', $request->role)->exists();
        if ($roleTaken) {
            return back()->withErrors(['error' => 'This role is already taken.']);
        }

        if ($team->members()->count() >= 5) {
            return back()->withErrors(['error' => 'Team is full.']);
        }

        \App\Models\CampusTournamentTeamMember::create([
            'team_id' => $team->id,
            'player_id' => $user->id,
            'role' => 'member',
            'lane_role' => $request->role,
            'status' => 'accepted'
        ]);

        // Auto-register if 5 members
        if ($team->members()->count() >= 5) {
            $team->update(['status' => 'registered']);
        }

        return back()->with('success', 'Joined team successfully!');
    }

    /**
     * Leave a Solo Team
     */
    public function leaveSoloTeam(Request $request)
    {
        $user = Auth::user();
        
        $member = \App\Models\CampusTournamentTeamMember::where('player_id', $user->id)
            ->whereHas('team', function($q) {
                $q->where('type', 'solo');
            })
            ->first();

        if (!$member) {
            return back()->withErrors(['error' => 'You are not in a solo team.']);
        }

        $team = $member->team;
        $tournament = $team->tournament;

        // Roster Lock Check
        if ($tournament && $tournament->registration_locked) {
            return response()->json(['error' => 'Registration is locked. You cannot leave the team now.'], 403);
        }

        if ($tournament && now()->gt(\Carbon\Carbon::parse($tournament->end_date)->endOfDay())) {
            return response()->json(['error' => 'Registration period has ended. You cannot leave the team now.'], 403);
        }

        \DB::beginTransaction();
        try {
            $member->delete();

            // Handle captain-ship or team deletion
            if ($member->role === 'captain') {
                $nextMember = $team->members()->first();
                if ($nextMember) {
                    $nextMember->update(['role' => 'captain']);
                    $team->update(['captain_id' => $nextMember->player_id]);
                } else {
                    $team->delete();
                }
            }

            // Update status back to assembling if it was registered
            if ($team->status === 'registered') {
                $team->update(['status' => 'assembling']);
            }

            \DB::commit();
            return back()->with('success', 'Left team successfully!');
        } catch (\Exception $e) {
            \DB::rollBack();
            return back()->withErrors(['error' => 'Failed to leave team.']);
        }
    }
}

