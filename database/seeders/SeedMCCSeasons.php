<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MCCSeason;
use App\Models\MCCSeasonContent;

class SeedMCCSeasons extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Check if seasons already exist
        if (MCCSeason::where('season_number', 1)->exists()) {
            $this->command->info('Seasons already exist. Skipping seeding.');
            return;
        }

        // Create Season 1
        $season1 = MCCSeason::create([
            'season_number' => 1,
            'season_name' => 'Season 1',
            'is_active' => false,
            'start_date' => '2024-01-01',
            'end_date' => '2024-06-30',
            'route_slug' => 'S1',
            'description' => 'The inaugural season of MSL Collegiate Cup',
        ]);

        // Add Season 1 content placeholders
        $this->createSeasonContent($season1->id, 'hero_images', 'hero_left', ['path' => 'images/MCC S2/Joy.png']);
        $this->createSeasonContent($season1->id, 'hero_images', 'hero_right', ['path' => 'images/MCC S2/YZhong 1.png']);
        $this->createSeasonContent($season1->id, 'logos', 'mcc_logo', ['path' => 'images/MCC S2/MCCLOGO.png']);
        $this->createSeasonContent($season1->id, 'backgrounds', 'main_bg', ['path' => 'images/MCC S2/Main BG.png']);
        $this->createSeasonContent($season1->id, 'backgrounds', 'hero_bg', ['path' => 'images/MCC S2/PHINMA.jpg']);
        $this->createSeasonContent($season1->id, 'backgrounds', 'knockout_bg', ['path' => 'images/MCC S2/Knockout BG.png']);

        // Create Season 2 (Active)
        $season2 = MCCSeason::create([
            'season_number' => 2,
            'season_name' => 'Pamantasang Lakas',
            'is_active' => true,
            'start_date' => '2024-07-01',
            'end_date' => null,
            'route_slug' => 'S2',
            'description' => 'The second season of MSL Collegiate Cup - Pamantasang Lakas',
        ]);

        // Add Season 2 content
        $this->createSeasonContent($season2->id, 'hero_images', 'hero_left', ['path' => 'images/MCC S2/Joy.png']);
        $this->createSeasonContent($season2->id, 'hero_images', 'hero_right', ['path' => 'images/MCC S2/YZhong 1.png']);
        $this->createSeasonContent($season2->id, 'logos', 'mcc_logo', ['path' => 'images/MCC S2/MCCLOGO.png']);
        $this->createSeasonContent($season2->id, 'logos', 'title_image', ['path' => 'images/MCC S2/Pamantasang lakas MSL COLLEGIATE CUP S2.png']);
        $this->createSeasonContent($season2->id, 'backgrounds', 'main_bg', ['path' => 'images/MCC S2/Main BG.png']);
        $this->createSeasonContent($season2->id, 'backgrounds', 'hero_bg', ['path' => 'images/MCC S2/PHINMA.jpg']);
        $this->createSeasonContent($season2->id, 'backgrounds', 'knockout_bg', ['path' => 'images/MCC S2/Knockout BG.png']);
        $this->createSeasonContent($season2->id, 'backgrounds', 'red_element', ['path' => 'images/MCC S2/RED 1.png']);
        
        // Button images
        $this->createSeasonContent($season2->id, 'buttons', 'registration', ['path' => 'images/MCC S2/Registration Button.png']);
        $this->createSeasonContent($season2->id, 'buttons', 'rules', ['path' => 'images/MCC S2/Rules Button.png']);
        $this->createSeasonContent($season2->id, 'buttons', 'calendar', ['path' => 'images/MCC S2/Calendar Button.png']);
        $this->createSeasonContent($season2->id, 'buttons', 'favourites', ['path' => 'images/MCC S2/Favourites Button.png']);
        
        // Bottom images
        $this->createSeasonContent($season2->id, 'backgrounds', 'bottom_thumbnail', ['path' => 'images/MCC S2/BOTTOM.png']);
        
        // Playoff bracket
        $this->createSeasonContent($season2->id, 'backgrounds', 'playoffs_bracket', ['path' => 'images/MCC S2/PLayoffs bracket.png']);
        
        // Team logo
        $this->createSeasonContent($season2->id, 'teams', 'nu_logo', ['path' => 'images/MCC S2/NU logo.png']);
        
        // Text content
        $this->createSeasonContent($season2->id, 'text_content', 'about_title', ['text' => 'MLBB COLLEGIATE CUP']);
        $this->createSeasonContent($season2->id, 'text_content', 'about_description', [
            'text' => 'MSL Collegiate Cup (MCC) is the trademark collegiate tournament of Moonton Student Leaders Philippines (MSL Philippines). Established in 2021 through its predecessor —  the School Rivals — and recently rebranded as MCC in 2023, it stands tall and proud as the premier and one of the biggest nationwide collegiate tournaments that shares the opportunity for a higher scale of competitive gaming.'
        ]);

        $this->command->info('MCC Seasons seeded successfully!');
    }

    /**
     * Helper method to create season content.
     */
    private function createSeasonContent($seasonId, $contentType, $contentKey, $contentValue, $displayOrder = 0)
    {
        MCCSeasonContent::create([
            'season_id' => $seasonId,
            'content_type' => $contentType,
            'content_key' => $contentKey,
            'content_value' => $contentValue,
            'display_order' => $displayOrder,
        ]);
    }
}
