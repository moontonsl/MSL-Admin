<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MCCSeasonContent extends Model
{
    use HasFactory;

    protected $table = 'mcc_season_content';

    protected $fillable = [
        'season_id',
        'content_type',
        'content_key',
        'content_value',
        'display_order',
    ];

    protected $casts = [
        'content_value' => 'array',
    ];

    /**
     * Get the season that owns this content.
     */
    public function season()
    {
        return $this->belongsTo(MCCSeason::class, 'season_id');
    }

    /**
     * Content type constants.
     */
    const TYPE_HERO_IMAGES = 'hero_images';
    const TYPE_LOGOS = 'logos';
    const TYPE_BACKGROUNDS = 'backgrounds';
    const TYPE_BUTTONS = 'buttons';
    const TYPE_TEXT_CONTENT = 'text_content';
    const TYPE_TEAMS = 'teams';
    const TYPE_STANDINGS = 'standings';
    const TYPE_MATCHES = 'matches';

    /**
     * Get all available content types.
     */
    public static function getContentTypes()
    {
        return [
            self::TYPE_HERO_IMAGES,
            self::TYPE_LOGOS,
            self::TYPE_BACKGROUNDS,
            self::TYPE_BUTTONS,
            self::TYPE_TEXT_CONTENT,
            self::TYPE_TEAMS,
            self::TYPE_STANDINGS,
            self::TYPE_MATCHES,
        ];
    }
}
