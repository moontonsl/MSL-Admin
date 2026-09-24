<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JBFlexSubmission extends Model
{
    protected $table = 'jb_flex_submissions';

    protected $fillable = [
        'name',
        'school',
        'ml_id',
        'server_id',
        'facebook_profile_link',
        'post_link'
    ];
}
