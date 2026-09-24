<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Province;

class Municipality extends Model
{
    public function province()
    {
        return $this->belongsTo(Province::class);
    }
    
    public function schools()
    {
        return $this->hasMany(School::class);
    }
}
