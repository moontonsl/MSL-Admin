<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CampusTournament extends Model
{
    protected $fillable = [
        'school_name',
        'sl_name',
        'sl_id',
        'start_date',
        'end_date',
        'status',
        'rejection_reason',
        'approved_by',
        'approved_at',
        'results_submitted',
        'results_submitted_at',
        'tournament_type',
        'registration_locked',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'approved_at' => 'datetime',
        'results_submitted' => 'boolean',
        'results_submitted_at' => 'datetime',
        'registration_locked' => 'boolean',
    ];

    /**
     * Get the Student Leader who created this tournament
     */
    public function studentLeader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sl_id');
    }

    /**
     * Get the Regional Admin who approved/rejected this tournament
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the teams registered for this tournament
     */
    public function teams(): HasMany
    {
        return $this->hasMany(CampusTournamentTeam::class, 'tournament_id');
    }

    /**
     * Scope for pending tournaments
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for approved tournaments
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope for rejected tournaments
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}
