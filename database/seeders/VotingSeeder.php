<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Voting;
use App\Models\User;

class VotingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // pang get ng user or pang create ng user kung wala
        $user = User::first() ?? User::factory()->create();

        // sampledata
        $brackets = [
            'MINDANAO BRACKET' => [
                [
                    'image' => '/images/MCC/MINDANAO/M_UR1.png',
                    'team' => 'UR Team 1'
                ],
                [
                    'image' => '/images/MCC/MINDANAO/M_MA.png',
                    'team' => 'MA Team'
                ]
            ],
            'VISAYAS BRACKET' => [
                [
                    'image' => '/images/MCC/VISAYAS/V_UR1.png',
                    'team' => 'UR Team 1'
                ],
                [
                    'image' => '/images/MCC/VISAYAS/V_WIL.png',
                    'team' => 'WIL Team'
                ]
            ],
            'LUZON A BRACKET' => [
                [
                    'image' => '/images/MCC/LUZON A/LA_UR1.png',
                    'team' => 'UR Team 1'
                ],
                [
                    'image' => '/images/MCC/LUZON A/LA_FEB.png',
                    'team' => 'FEB Team'
                ]
            ],
            'LUZON B BRACKET' => [
                [
                    'image' => '/images/MCC/LUZON B/LB_MA.png',
                    'team' => 'MA Team'
                ],
                [
                    'image' => '/images/MCC/LUZON B/LB_WIL.png',
                    'team' => 'WIL Team'
                ]
            ]
        ];

        // pang create ng sample votes
        foreach ($brackets as $bracket => $teams) {
            foreach ($teams as $team) {
                Voting::create([
                    'user_id' => $user->id,
                    'bracket' => $bracket,
                    'image' => $team['image'],
                    'team' => $team['team'],
                    'created_at' => now()
                ]);
            }
        }
    }
} 