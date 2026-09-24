<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AllStarColorSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'school',
        'ml_id',
        'server_id',
        'facebook_profile_link',
        'post_link',
    ];
}
