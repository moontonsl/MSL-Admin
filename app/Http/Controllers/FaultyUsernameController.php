<?php

namespace App\Http\Controllers;

use App\Jobs\SendFaultyUsernameEmails;
use App\Mail\FaultyUsernameMail;
use App\Models\FaultyUsernameEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class FaultyUsernameController extends Controller
{
    /**
     * Display the faulty username management panel
     */
    public function index(Request $request)
    {
        $issueType = $request->get('issue_type', 'all');
        $perPage = $request->get('per_page', 25);
        $search = $request->get('search');

        // Get users with faulty usernames
        $query = $this->buildQuery($issueType);
        
        // Apply search filter if provided
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('surname', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('username', 'like', '%' . $search . '%')
                  ->orWhere(DB::raw("CONCAT(name, ' ', COALESCE(surname, ''))"), 'like', '%' . $search . '%');
            });
        }
        
        $faultyUsers = $query->paginate($perPage);

        // Collect user IDs on this page and load their latest email sent timestamps
        $pageUserIds = $faultyUsers->getCollection()->pluck('id')->toArray();
        $emailSentMap = FaultyUsernameEmail::whereIn('user_id', $pageUserIds)
            ->orderBy('sent_at', 'desc')
            ->get()
            ->groupBy('user_id')
            ->map(fn($records) => $records->first()->sent_at);

        // Add issue type and email sent timestamp to each user
        $faultyUsers->getCollection()->transform(function ($user) use ($emailSentMap) {
            $user->issue_type = $this->determineIssueType($user);
            $user->username_length = strlen($user->username ?? '');
            $user->email_sent_at = $emailSentMap->get($user->id);
            return $user;
        });

        // Get statistics
        $stats = $this->getFaultyUsernameStats();

        return view('admin.faulty-username', compact('faultyUsers', 'stats', 'issueType', 'search'));
    }

    /**
     * Send email to a specific user
     */
    public function sendEmailToUser(Request $request, $userId)
    {
        try {
            $user = User::findOrFail($userId);
            $issueType = $this->determineIssueType($user);
            
            if ($issueType) {
                Mail::to($user->email)->send(new FaultyUsernameMail($user, $issueType));

                $sentAt = now();
                FaultyUsernameEmail::create(['user_id' => $user->id, 'sent_at' => $sentAt]);

                return response()->json([
                    'success' => true,
                    'message' => "Email sent successfully to {$user->name} ({$user->email})",
                    'sent_at' => $sentAt->toISOString(),
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'No username issue found for this user'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send email: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Send emails to selected users
     */
    public function sendEmailToSelected(Request $request)
    {
        $userIds = $request->input('user_ids', []);
        
        if (empty($userIds)) {
            return response()->json([
                'success' => false,
                'message' => 'No users selected'
            ]);
        }

        try {
            // Send emails immediately instead of queueing
            $successCount = 0;
            $errorCount = 0;
            
            foreach ($userIds as $userId) {
                try {
                    $user = User::find($userId);
                    if ($user) {
                        $issueType = $this->determineIssueType($user);
                        if ($issueType) {
                            Mail::to($user->email)->send(new FaultyUsernameMail($user, $issueType));
                            FaultyUsernameEmail::create(['user_id' => $user->id, 'sent_at' => now()]);
                            $successCount++;
                        }
                    }
                } catch (\Exception $e) {
                    $errorCount++;
                }
            }

            $message = "Sent emails to {$successCount} users.";
            if ($errorCount > 0) {
                $message .= " {$errorCount} failed.";
            }

            return response()->json([
                'success' => true,
                'message' => $message
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send emails: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Send emails to all users with faulty usernames
     */
    public function sendEmailToAll(Request $request)
    {
        $issueType = $request->input('issue_type', 'all');
        
        try {
            $query = $this->buildQuery($issueType);
            $userIds = $query->pluck('id')->toArray();
            
            if (empty($userIds)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No users found with the specified issue type'
                ]);
            }

            // Send emails immediately
            $successCount = 0;
            $errorCount = 0;
            
            foreach ($userIds as $userId) {
                try {
                    $user = User::find($userId);
                    if ($user) {
                        $issueType = $this->determineIssueType($user);
                        if ($issueType) {
                            Mail::to($user->email)->send(new FaultyUsernameMail($user, $issueType));
                            FaultyUsernameEmail::create(['user_id' => $user->id, 'sent_at' => now()]);
                            $successCount++;
                        }
                    }
                } catch (\Exception $e) {
                    $errorCount++;
                }
            }

            $message = "Sent emails to {$successCount} users.";
            if ($errorCount > 0) {
                $message .= " {$errorCount} failed.";
            }

            return response()->json([
                'success' => true,
                'message' => $message
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to queue emails: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Get statistics for the dashboard
     */
    public function getStats()
    {
        $stats = $this->getFaultyUsernameStats();
        return response()->json($stats);
    }

    /**
     * Build query based on issue type
     */
    private function buildQuery(string $issueType)
    {
        $query = User::select('id', 'name', 'surname', 'email', 'username', 'created_at')
                    ->orderBy('created_at', 'desc');

        switch ($issueType) {
            case 'short':
                return $query->where(function ($q) {
                    $q->whereNotNull('username')
                      ->where(DB::raw('CHAR_LENGTH(username)'), '<', 5);
                });

            case 'spaces':
                return $query->where(function ($q) {
                    $q->whereNotNull('username')
                      ->where('username', 'LIKE', '% %');
                });

            case 'long':
                return $query->where(function ($q) {
                    $q->whereNotNull('username')
                      ->where(DB::raw('CHAR_LENGTH(username)'), '>', 15);
                });

            case 'empty':
                return $query->where(function ($q) {
                    $q->whereNull('username')
                      ->orWhere('username', '')
                      ->orWhere(DB::raw('TRIM(username)'), '');
                });

            case 'invalid_start':
                return $query->where(function ($q) {
                    $q->whereNotNull('username')
                      ->whereRaw("username REGEXP '^[0._-]'");
                });

            case 'invalid_end':
                return $query->where(function ($q) {
                    $q->whereNotNull('username')
                      ->whereRaw("username REGEXP '[._-]$'");
                });

            case 'multiple_special':
                return $query->where(function ($q) {
                    $q->whereNotNull('username')
                      ->whereRaw("username REGEXP '[._-].*[._-]'");
                });

            case 'invalid_chars':
                return $query->where(function ($q) {
                    $q->whereNotNull('username')
                      ->whereRaw("username REGEXP '[^a-zA-Z0-9._-]'");
                });

            case 'all':
            default:
                return $query->where(function ($q) {
                    $q->whereNull('username')
                      ->orWhere('username', '')
                      ->orWhere(DB::raw('TRIM(username)'), '')
                      ->orWhere(DB::raw('CHAR_LENGTH(username)'), '<', 5)
                      ->orWhere(DB::raw('CHAR_LENGTH(username)'), '>', 15)
                      ->orWhereRaw("username REGEXP '^[0._-]'")
                      ->orWhereRaw("username REGEXP '[._-]$'")
                      ->orWhereRaw("username REGEXP '[._-].*[._-]'")
                      ->orWhereRaw("username REGEXP '[^a-zA-Z0-9._-]'");
                });
        }
    }

    /**
     * Determine the type of username issue
     */
    private function determineIssueType(User $user): ?string
    {
        $username = $user->username;

        if (is_null($username) || trim($username) === '') {
            return 'Empty/NULL username';
        }

        if (strlen($username) < 5) {
            return 'Too short (<5 chars)';
        }

        if (strlen($username) > 15) {
            return 'Too long (>15 chars)';
        }

        if (strpos($username, ' ') !== false) {
            return 'Contains spaces';
        }

        if (preg_match('/^[0._-]/', $username)) {
            return 'Invalid start (cannot start with 0, dot, underscore, or dash)';
        }

        if (preg_match('/[._-]$/', $username)) {
            return 'Invalid end (cannot end with dot, underscore, or dash)';
        }

        if (preg_match('/[._-].*[._-]/', $username)) {
            return 'Multiple special characters (only one . _ - allowed total)';
        }

        if (preg_match('/[^a-zA-Z0-9._-]/', $username)) {
            return 'Invalid characters (only letters, numbers, dot, underscore, dash allowed)';
        }

        return null;
    }

    /**
     * Get statistics about faulty usernames
     */
    private function getFaultyUsernameStats(): array
    {
        $stats = [
            'empty_count' => 0,
            'short_count' => 0,
            'spaces_count' => 0,
            'long_count' => 0,
            'invalid_start_count' => 0,
            'invalid_end_count' => 0,
            'multiple_special_count' => 0,
            'invalid_chars_count' => 0,
            'total_faulty' => 0,
            'total_users' => 0,
        ];

        $stats['total_users'] = User::count();

        $stats['empty_count'] = User::where(function ($query) {
            $query->whereNull('username')
                  ->orWhere('username', '')
                  ->orWhere(DB::raw('TRIM(username)'), '');
        })->count();

        $stats['short_count'] = User::whereNotNull('username')
                                   ->where(DB::raw('CHAR_LENGTH(username)'), '<', 5)
                                   ->count();

        $stats['spaces_count'] = User::whereNotNull('username')
                                    ->where('username', 'LIKE', '% %')
                                    ->count();

        $stats['long_count'] = User::whereNotNull('username')
                                  ->where(DB::raw('CHAR_LENGTH(username)'), '>', 15)
                                  ->count();

        $stats['invalid_start_count'] = User::whereNotNull('username')
                                           ->whereRaw("username REGEXP '^[0._-]'")
                                           ->count();

        $stats['invalid_end_count'] = User::whereNotNull('username')
                                         ->whereRaw("username REGEXP '[._-]$'")
                                         ->count();

        $stats['multiple_special_count'] = User::whereNotNull('username')
                                              ->whereRaw("username REGEXP '[._-].*[._-]'")
                                              ->count();

        $stats['invalid_chars_count'] = User::whereNotNull('username')
                                           ->whereRaw("username REGEXP '[^a-zA-Z0-9._-]'")
                                           ->count();

        $stats['total_faulty'] = User::where(function ($query) {
            $query->whereNull('username')
                  ->orWhere('username', '')
                  ->orWhere(DB::raw('TRIM(username)'), '')
                  ->orWhere(DB::raw('CHAR_LENGTH(username)'), '<', 5)
                  ->orWhere(DB::raw('CHAR_LENGTH(username)'), '>', 15)
                  ->orWhereRaw("username REGEXP '^[0._-]'")
                  ->orWhereRaw("username REGEXP '[._-]$'")
                  ->orWhereRaw("username REGEXP '[._-].*[._-]'")
                  ->orWhereRaw("username REGEXP '[^a-zA-Z0-9._-]'");
        })->count();

        return $stats;
    }
    /**
     * Show the form for updating the username
     */
    public function showUpdateForm(Request $request, User $user)
    {
        // Ensure the signed URL is for this user
        if (!$request->hasValidSignature()) {
            abort(403, 'Invalid or expired link.');
        }

        return view('auth.update-username', compact('user'));
    }

    /**
     * Update the username
     */
    public function updateUsername(Request $request, User $user)
    {
        $request->validate([
            'username' => [
                'required',
                'string',
                'min:5',
                'max:15',
                'unique:users,username,' . $user->id,
                'regex:/^(?!.*[._\-].*[._\-])[a-zA-Z1-9][a-zA-Z0-9._\-]{3,13}[a-zA-Z0-9]$/',
            ],
        ], [
            'username.regex' => 'Username must be 5–15 characters, start with a letter or 1–9, end with a letter or digit, and contain at most one dot, underscore, or dash.',
            'username.min' => 'The username must be at least 5 characters.',
            'username.max' => 'The username must not be greater than 15 characters.',
        ]);

        $user->username = $request->username;
        $user->save();

        return redirect()->route('login')->with('status', 'Username updated successfully! You can now login.');
    }
}
 