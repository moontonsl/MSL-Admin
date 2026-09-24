<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\CampusTournamentTeam;
use App\Models\CampusTournamentTeamMember;

$team = CampusTournamentTeam::where('team_name', 'Shuffle Team A')->where('tournament_id', 133)->first();

if ($team) {
    // Add 5th player
    $username = "complete_user_5";
    $user = User::firstOrCreate(['username' => $username], [
        'name' => "Complete", 'surname' => "Player", 'email' => "$username@test.com", 'password' => 'X', 'university' => 'Laguna University', 'role' => 'Player'
    ]);
    
    CampusTournamentTeamMember::create([
        'team_id' => $team->id,
        'player_id' => $user->id,
        'role' => 'member',
        'lane_role' => 'Mid Laner',
        'status' => 'accepted'
    ]);
    
    // Set status to registered
    $team->status = 'registered';
    $team->save();
    
    echo "Completed Shuffle Team A!";
} else {
    echo "Shuffle Team A not found";
}
