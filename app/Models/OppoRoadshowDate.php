<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OppoRoadshowDate extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_date',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
