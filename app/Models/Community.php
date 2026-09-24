<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Community extends Model
{
    protected $fillable = [
        'school_id',
        'location',
        'island',
        'map_code',
        'school_link',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
