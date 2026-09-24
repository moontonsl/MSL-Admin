<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Account Creation/Register');
        // return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request['name'] = $request->firstName;
        $request['password_confirmation'] = $request->confirmPassword;
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'username' => ['required', 'string', 'min:5', 'max:15', 'unique:'.User::class, 'regex:/^(?!.*[._\-].*[._\-])[a-zA-Z1-9][a-zA-Z0-9._\-]{3,13}[a-zA-Z0-9]$/'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'password_confirmation' => ['required', 'same:password'],
            'proofOfEnrollment' => 'required|file|mimes:jpeg,png,jpg,pdf,doc,docx|max:5120',
            'userId' => 'required|string|unique:users,ml_id',
        ]);
        // dd($request);
        
        // Convert region name to region ID
        $regionId = null;
        if ($request->region) {
            $region = DB::table('regions')
                ->where('name', $request->region)
                ->first();
            
            if ($region) {
                $regionId = $region->id;
            }
        }
        
        $user = User::create([
            'name' => $request->firstName,
            "surname" => $request->lastName,
            'email' => $request->email,
            "username" => $request->username,
            'password' => Hash::make($request->password),
            "suffix" => $request->suffix,
            "gender" => $request->gender,
            "age" => $request->age,
            "contact_number" => $request->contactNo,
            "facebook_link" => $request->facebookLink,
            "year_level" => $request->yearLevel,
            "region" => $regionId,
            "island" => $request->island,
            "studentId" => $request->studentId,
            "course" => $request->course,
            "university" => $request->university,
            "ml_id" => $request->userId,
            "ml_server" => $request->serverId,
            "squadName" => $request->squadName,
            "squadAbbreviation" => $request->squadAbbreviation,
            "rank" => $request->rank,
            "inGameRole" => $request->inGameRole,
            "mainHero" => $request->mainHero,
            "ml_ign" => $request->ign,
            "birthday" => $request->birthday,
        ]);        
        event(new Registered($user));
       
        if ($request->hasFile('proofOfEnrollment')) {
            $file = $request->file('proofOfEnrollment');
            $fileName = $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $filePath = 'users/proofOfEnrollment/' . $user->id;
            $stored = $file->storeAs($filePath, $fileName, 'local');
        
            if ($stored) {
                $user->proofOfEnrollment = $filePath . '/' . $fileName;
                $user->save();
            }
        }
        Auth::login($user);
        
       
        return redirect()->intended(route('SLStudent', absolute: false));
        
    }
}
