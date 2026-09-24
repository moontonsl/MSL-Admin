<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AwardNomination extends Model
{
    use HasFactory;

    protected $fillable = [
        'ml_id',
        'award_id',
        'award_type',
        'nominator_name',
        'nominee_name',
        'reason',
    ];
}
