<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MCCSeason extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'mcc_seasons';

    protected $fillable = [
        'season_number',
        'season_name',
        'is_active',
        'start_date',
        'end_date',
        'route_slug',
        'description',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get the content for this season.
     */
    public function content()
    {
        return $this->hasMany(MCCSeasonContent::class, 'season_id');
    }

    /**
     * Scope to get only active season.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get content by type.
     */
    public function getContentByType($type)
    {
        return $this->content()
            ->where('content_type', $type)
            ->orderBy('display_order')
            ->get();
    }

    /**
     * Get specific content by key.
     */
    public function getContentByKey($key)
    {
        return $this->content()
            ->where('content_key', $key)
            ->first();
    }

    /**
     * Set a season as active and deactivate all others.
     */
    public function setAsActive()
    {
        // Deactivate all seasons
        self::query()->update(['is_active' => false]);
        
        // Activate this season
        $this->update(['is_active' => true]);
    }

    /**
     * Get all content formatted for frontend.
     */
    public function getFormattedContent()
    {
        $content = $this->content;
        $formatted = [];

        foreach ($content as $item) {
            if (!isset($formatted[$item->content_type])) {
                $formatted[$item->content_type] = [];
            }
            $formatted[$item->content_type][$item->content_key] = $item->content_value;
        }

        return $formatted;
    }
}
