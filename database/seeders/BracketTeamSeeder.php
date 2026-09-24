<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Bracket;
use App\Models\BracketTeam;

class BracketTeamSeeder extends Seeder
{
    public function run()
    {
        $brackets = [
            'MINDANAO BRACKET' => [
                'status' => Bracket::STATUS_CLOSED,
                'teams' => [
                    ['team_name' => 'UR Team 1', 'image_path' => '/images/MCC/MINDANAO/M_UR1.png', 'team_order' => 1],
                    ['team_name' => 'MA Team', 'image_path' => '/images/MCC/MINDANAO/M_MA.png', 'team_order' => 2],
                    ['team_name' => 'WIL Team', 'image_path' => '/images/MCC/MINDANAO/M_WIL.png', 'team_order' => 3],
                    ['team_name' => 'UR Team 2', 'image_path' => '/images/MCC/MINDANAO/M_UR2.png', 'team_order' => 4],
                    ['team_name' => 'FEB Team', 'image_path' => '/images/MCC/MINDANAO/M_FEB.png', 'team_order' => 5],
                ]
            ],
            'VISAYAS BRACKET' => [
                'status' => Bracket::STATUS_UPCOMING,
                'teams' => [
                    ['team_name' => 'UR Team 1', 'image_path' => '/images/MCC/VISAYAS/V_UR1.png', 'team_order' => 1],
                    ['team_name' => 'MA Team', 'image_path' => '/images/MCC/VISAYAS/V_MA.png', 'team_order' => 2],
                    ['team_name' => 'WIL Team', 'image_path' => '/images/MCC/VISAYAS/V_WIL.png', 'team_order' => 3],
                    ['team_name' => 'UR Team 2', 'image_path' => '/images/MCC/VISAYAS/V_UR2.png', 'team_order' => 4],
                    ['team_name' => 'FEB Team', 'image_path' => '/images/MCC/VISAYAS/V_FEB.png', 'team_order' => 5],
                ]
            ],
            'LUZON A BRACKET' => [
                'status' => Bracket::STATUS_OPEN,
                'teams' => [
                    ['team_name' => 'UR Team 1', 'image_path' => '/images/MCC/LUZON A/LA_UR1.png', 'team_order' => 1],
                    ['team_name' => 'MA Team', 'image_path' => '/images/MCC/LUZON A/LA_MA.png', 'team_order' => 2],
                    ['team_name' => 'WIL Team', 'image_path' => '/images/MCC/LUZON A/LA_WIL.png', 'team_order' => 3],
                    ['team_name' => 'UR Team 2', 'image_path' => '/images/MCC/LUZON A/LA_UR2.png', 'team_order' => 4],
                    ['team_name' => 'FEB Team', 'image_path' => '/images/MCC/LUZON A/LA_FEB.png', 'team_order' => 5],
                ]
            ],
            'LUZON B BRACKET' => [
                'status' => Bracket::STATUS_OPEN,
                'teams' => [
                    ['team_name' => 'MA Team', 'image_path' => '/images/MCC/LUZON B/LB_MA.png', 'team_order' => 1],
                    ['team_name' => 'WIL Team', 'image_path' => '/images/MCC/LUZON B/LB_WIL.png', 'team_order' => 2],
                    ['team_name' => 'UR Team 1', 'image_path' => '/images/MCC/LUZON B/LB_UR1.png', 'team_order' => 3],
                    ['team_name' => 'UR Team 2', 'image_path' => '/images/MCC/LUZON B/LB_UR2.png', 'team_order' => 4],
                    ['team_name' => 'FEB Team', 'image_path' => '/images/MCC/LUZON B/LB_FEB.png', 'team_order' => 5],
                ]
            ],
        ];

        foreach ($brackets as $bracketName => $bracketData) {
            // Create the bracket
            $bracket = Bracket::create([
                'name' => $bracketName,
                'status' => $bracketData['status']
            ]);

            // Create the teams for this bracket
            foreach ($bracketData['teams'] as $team) {
                BracketTeam::create([
                    'bracket_id' => $bracket->id,
                    'team_name' => $team['team_name'],
                    'image_path' => $team['image_path'],
                    'team_order' => $team['team_order']
                ]);
            }
        }
    }
} 