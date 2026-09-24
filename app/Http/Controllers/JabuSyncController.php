<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class JabuSyncController extends Controller
{
    /**
     * Display the sync dashboard.
     */
    public function index(Request $request)
    {
        if (!$request->session()->get('jabu_sync_authorized')) {
            return view('jabu-sync', ['is_authorized' => false]);
        }

        return view('jabu-sync', ['is_authorized' => true]);
    }

    /**
     * Verify the passcode.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'passcode' => 'required|string'
        ]);

        if ($request->passcode === '0404') {
            $request->session()->put('jabu_sync_authorized', true);
            return redirect()->route('jabu.sync.index');
        }

        return back()->withErrors(['passcode' => 'Incorrect passcode. Access Denied.']);
    }

    /**
     * Run the bulk sync artisan command.
     */
    public function sync(Request $request)
    {
        if (!$request->session()->get('jabu_sync_authorized')) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        try {
            // Push to queue so the web request doesn't timeout for 30k users
            Artisan::queue('users:sync-to-sheets');
            
            return response()->json([
                'success' => true,
                'message' => 'Bulk Sync has been started in the background. It will process 30,000+ users safely.',
            ]);
        } catch (\Exception $e) {
            Log::error('JabuSync Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Sync failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process pending jobs in the queue.
     */
    public function processQueue(Request $request)
    {
        if (!$request->session()->get('jabu_sync_authorized')) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        try {
            // Process queue jobs until empty
            Artisan::call('queue:work', ['--stop-when-empty' => true]);
            $output = Artisan::output();

            return response()->json([
                'success' => true,
                'message' => 'Queue jobs processed successfully!',
                'output' => $output
            ]);
        } catch (\Exception $e) {
            Log::error('JabuSync Queue Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Queue processing failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Logout from the sync panel.
     */
    public function logout(Request $request)
    {
        $request->session()->forget('jabu_sync_authorized');
        return redirect()->route('jabu.sync.index');
    }
}
