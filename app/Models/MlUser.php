<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MlUser extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ml_id',
        'server_id',
        'ign',
        'is_active',
        'last_active_at',
        'moonton_token'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_active_at' => 'datetime',
    ];

    /**
     * Get the votings for the ML user.
     */
    public function votings()
    {
        return $this->hasMany(Voting::class, 'ml_id', 'ml_id');
    }
} 