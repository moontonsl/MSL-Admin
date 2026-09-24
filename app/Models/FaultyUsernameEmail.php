<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FaultyUsernameEmail extends Model
{
    protected $fillable = ['user_id', 'sent_at'];

    protected $casts = ['sent_at' => 'datetime'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
