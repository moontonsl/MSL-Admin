<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventPhotoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $eventPhotos = [
            [
                'event_name' => 'Fuego League "Clash of Champions"',
                'school_name' => 'De La Salle Lipa',
                'picture' => null,
            ],
            [
                'event_name' => 'SWU NURSING DAYS 2024',
                'school_name' => 'Southwestern University PHINMA',
                'picture' => null,
            ],
            [
                'event_name' => 'DACS MLBB Esports League',
                'school_name' => 'Ateneo de Davao University',
                'picture' => null,
            ],
            [
                'event_name' => 'NDMU CEAC WEEK',
                'school_name' => 'Notre Dame of Marbel University',
                'picture' => null,
            ],
            [
                'event_name' => 'Alangaang 2024: Iisang Himpapawid, Iisang Bagwis, Sama-samang Mamamayagpag Tungo sa Mithiing Pagtayog',
                'school_name' => 'Laguna States Polytechnic University',
                'picture' => null,
            ],
            [
                'event_name' => 'STI COLLEGE BACOOR FOUNDING ANNIVERSARY CELEBRATION- MLBB ESPORTS COMPETITION',
                'school_name' => 'STI COLLEGE BACOOR',
                'picture' => null,
            ],
        ];

        foreach ($eventPhotos as $photo) {
            DB::table('event_photos')->insert($photo);
        }
    }
}
