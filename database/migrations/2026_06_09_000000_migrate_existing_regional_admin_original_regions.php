<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\UserRegion;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get all Regional Admin users
        $regionalAdmins = User::where('role', 'Regional Admin')->get();

        foreach ($regionalAdmins as $admin) {
            if ($admin->region) {
                // Find region name using the ID
                $regionName = DB::table('regions')->where('id', $admin->region)->value('name');
                
                if ($regionName) {
                    // Check if already assigned in user_regions
                    $exists = UserRegion::where('user_id', $admin->id)
                        ->where('region_name', $regionName)
                        ->exists();
                    
                    if (!$exists) {
                        UserRegion::create([
                            'user_id' => $admin->id,
                            'region_name' => $regionName
                        ]);
                    }
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No down operation needed as this is a one-way data migration and we don't want to lose manually assigned regions
    }
};
