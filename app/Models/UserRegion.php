<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRegion extends Model
{
    protected $fillable = [
        'user_id',
        'region_name'
    ];

    /**
     * Get the user that owns the region assignment
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}