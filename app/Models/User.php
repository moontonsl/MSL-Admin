<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Passwords\CanResetPassword;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, CanResetPassword;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'ml_id',
        'ml_server',
        'ml_ign',
        'status',
        'user_type',
        'facebook_link',
        'surname',
        'lastName',
        'suffix',
        'birthday',
        'age',
        'gender',
        'contact_number',
        'course',
        'university',
        'year_level',
        'region',
        'island',
        'squadAbbreviation',
        'squadName',
        'inGameRole',
        'mainHero',
        'rank',
        'studentId',
        'proofOfEnrollment',
        'role',
        'state',
        'blocked_reason',
        'blocked_at',
        'blocked_by',
        'verified_by',
        'verified_date',
        'squad_name_last_changed',
        'year_level_last_changed',
        'ml_account_last_changed',
        'promotion_expires_at',
        'renew_date'
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::saved(function ($user) {
            // Define roles to exclude
            $excludedRoles = ['student', 'user'];
            
            // Check if user has a valid role and it's not in the excluded list
            $role = strtolower($user->role ?? '');
            if (!empty($role) && !in_array($role, $excludedRoles)) {
                \App\Jobs\SyncUserToGoogleSheet::dispatch($user);
            }
        });
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'verified_date' => 'datetime',
            'email_verification_code_expires_at' => 'datetime',
            'squad_name_last_changed' => 'datetime',
            'year_level_last_changed' => 'datetime',
            'ml_account_last_changed' => 'datetime',
            'promotion_expires_at' => 'datetime',
            'renew_date' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user who verified this user
     */
    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Get the users verified by this user
     */
    public function verifiedUsers()
    {
        return $this->hasMany(User::class, 'verified_by');
    }

    /**
     * Get the regions assigned to this user (for Regional Admins)
     */
    public function assignedRegions()
    {
        return $this->hasMany(UserRegion::class);
    }

    /**
     * Get the region names assigned to this user
     */
    public function getAssignedRegionNames()
    {
        $assignedRegions = $this->assignedRegions()->pluck('region_name')->toArray();
        
        // Include original region as a default/fallback only if they have no custom assigned regions yet
        if (empty($assignedRegions) && $this->role === 'Regional Admin' && $this->region) {
            $originalRegionName = \Illuminate\Support\Facades\DB::table('regions')
                ->where('id', $this->region)
                ->value('name');
            
            if ($originalRegionName) {
                $assignedRegions[] = $originalRegionName;
            }
        }
        
        return $assignedRegions;
    }

    /**
     * Check if user has access to a specific region
     */
    public function hasAccessToRegion($regionName)
    {
        if ($this->role === 'Super Admin') {
            return true; // Super Admin has access to all regions
        }
        
        if ($this->role === 'Regional Admin') {
            return $this->assignedRegions()->where('region_name', $regionName)->exists();
        }
        
        return false;
    }

    /**
     * Get region IDs for assigned region names (for database queries)
     */
    public function getAssignedRegionIds()
    {
        $regionNames = $this->getAssignedRegionNames();
        if (empty($regionNames)) {
            // If no assigned regions, return original region ID if exists
            if ($this->role === 'Regional Admin' && $this->region) {
                return [$this->region];
            }
            return [];
        }
        
        // Convert region names to IDs
        $regionIds = \Illuminate\Support\Facades\DB::table('regions')
            ->whereIn('name', $regionNames)
            ->pluck('id')
            ->toArray();
        return $regionIds;
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $url = url(route('password.reset', [
            'token' => $token,
            'email' => $this->getEmailForPasswordReset(),
        ], false));

        \Illuminate\Support\Facades\Mail::to($this->email)->send(new \App\Mail\ResetPasswordMail($this, $url));
    }
}
