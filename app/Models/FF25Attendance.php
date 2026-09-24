<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FF25Attendance extends Model
{
    use HasFactory;

    protected $table = 'ff25_attendances';

    protected $fillable = [
        'has_msl_account',
        'region',
        'school',
        'msl_username',
        'full_name',
        'email',
        'mlbb_id',
        'mlbb_server',
        'event_date',
    ];
}

