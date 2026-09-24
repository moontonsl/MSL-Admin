<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BracketTeam extends Model
{
    const STATUS_OPEN = 'open';
    const STATUS_CLOSED = 'closed';
    const STATUS_UPCOMING = 'upcoming';

    protected $fillable = [
        'bracket_id',
        'team_name',
        'image_path',
        'team_order',
        'status'
    ];

    protected $casts = [
        'status' => 'string'
    ];

    public function bracket()
    {
        return $this->belongsTo(Bracket::class);
    }

    public function scopeByBracket($query, $bracketName)
    {
        return $query->whereHas('bracket', function($q) use ($bracketName) {
            $q->where('name', $bracketName);
        })->orderBy('team_order');
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function isOpen()
    {
        return $this->status === self::STATUS_OPEN;
    }

    public function isClosed()
    {
        return $this->status === self::STATUS_CLOSED;
    }

    public function isUpcoming()
    {
        return $this->status === self::STATUS_UPCOMING;
    }
} 