<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OppoRoadshowSchool extends Model
{
    protected $fillable = ['school_id'];

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
