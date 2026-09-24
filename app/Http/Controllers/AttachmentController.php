<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AttachmentController extends Controller
{
    /**
     * Display the specified user's proof of enrollment.
     */
    public function show(User $user)
    {
        $currentUser = Auth::user();
        
        $canView = false;

        if ($currentUser->id === $user->id) {
            $canView = true;
        } elseif (in_array($currentUser->role, ['Admin', 'Super Admin', 'Regional Admin', 'SL'])) {
            $canView = true;
        }

        \Log::info('Attachment access check', [
            'user_id' => $currentUser->id,
            'target_user_id' => $user->id,
            'role' => $currentUser->role,
            'can_view' => $canView
        ]);

        if (!$canView) {
            abort(403, 'Unauthorized access to this attachment.');
        }

        if (!$user->proofOfEnrollment) {
            abort(404, 'No proof of enrollment found.');
        }

        $path = $user->proofOfEnrollment;

        if (Storage::disk('local')->exists($path)) {
            \Log::info('File found in local disk: ' . $path);
            $storage = Storage::disk('local');
        } 
    
        elseif (Storage::disk('public')->exists($path)) {
            \Log::info('File found in public disk: ' . $path);
            $storage = Storage::disk('public');
        } else {
            \Log::error('File not found in either disk: ' . $path);
            abort(404, 'File not found.');
        }

        $mimeType = $storage->mimeType($path);
        \Log::info('Serving attachment', ['path' => $path, 'mime' => $mimeType]);

        return $storage->response($path, null, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline',
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma' => 'no-cache',
        ]);
    }
}
