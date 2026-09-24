<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ViolationReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'school',
        'incident_type',
        'description',
        'evidence',
        'is_anonymous',
        'status',
    ];
}
