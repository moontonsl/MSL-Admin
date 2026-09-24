<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Add rate limiting: 1 request per minute per email

        // Rate limiting check
        $key = 'password_reset_' . $request->email;
        $attempts = cache()->get($key, 0);
        
        if ($attempts >= 1) {
            throw ValidationException::withMessages([
                'email' => ['Please wait 1 minute before requesting another password reset link.'],
            ]);
        }

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        $status = Password::sendResetLink(
            $request->only('email')
        );  

        if ($status == Password::RESET_LINK_SENT) {
            // Increment attempt counter and set 1 minute expiration
            cache()->put($key, $attempts + 1, now()->addMinute());
            
            return back()->with('status', __($status));
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
    public function forgotUsername(): Response
    {
        return Inertia::render('Auth/ForgotUsername', [
            'status' => session('status'),
        ]);
    }
    public function forgotUsernameLink(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->with('status', 'Email not found');
        }
        $username = $user->username;
        $email = $user->email;
        $subject = 'MSL Account: Username Recovery Request';
        $body = 'Your username is: ' . $username;
        Mail::to($email)->send(new \App\Mail\UsernameRecovery($username, $email, $subject, $body));
        return back()->with('status', 'Please check your email for your username.');
    }
}
