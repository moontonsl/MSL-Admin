<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JollibeeSubmission extends Model
{
    protected $fillable = [
        'name',
        'school',
        'ml_id',
        'server_id',
        'facebook_profile_link',
        'post_link'
    ];
}
