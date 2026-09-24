<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventPhoto extends Model
{
    protected $fillable = [
        'event_name',
        'school_name',
        'picture',
    ];

    /**
     * Get the full URL path for the picture
     */
    public function getPictureAttribute($value)
    {
        if (!$value) {
            return null;
        }

        // If the value already starts with /, it's already a full path
        if (strpos($value, '/') === 0) {
            return $value;
        }

        // Otherwise, prepend the EventPhotos directory path
        return '/images/EventPhotos/' . $value;
    }
}
