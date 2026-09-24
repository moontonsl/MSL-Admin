<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Island;

class Region extends Model
{
    public function island()
    {
        return $this->belongsTo(Island::class);
    }    
}
