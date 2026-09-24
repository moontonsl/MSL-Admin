<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bracket extends Model
{
    const STATUS_OPEN = 'open';
    const STATUS_CLOSED = 'closed';
    const STATUS_UPCOMING = 'upcoming';

    protected $fillable = [
        'name',
        'status'
    ];

    protected $casts = [
        'status' => 'string'
    ];

    public function teams()
    {
        return $this->hasMany(BracketTeam::class);
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