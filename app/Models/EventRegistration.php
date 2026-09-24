<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventRegistration extends Model
{
    use HasFactory;

    protected $table = 'event_registrations';

    protected $fillable = [
        'event_name',
        'full_name',
        'region',
        'venue',
        'event_date',
        'email',
        'mlbb_id',
        'mlbb_server',
        'attendance_mode',
        'facebook_link',
        'community',
        'school',
        'post_link',
        'proof_link',
    ];
}
