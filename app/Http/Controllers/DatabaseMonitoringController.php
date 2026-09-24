<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class DatabaseMonitoringController extends Controller
{
    public function index()
    {
        return response()->json([
            'username'   => $this->getUsernameStats(),
            'states'     => $this->getStateStats(),
            'status'     => $this->getStatusStats(),
            'year_level' => $this->getYearLevelStats(),
            'regions'    => $this->getRegionStats(),
        ]);
    }

    private function getUsernameStats(): array
    {
        // Valid: matches registration rule — alpha_num, 4–15 chars
        $valid = User::whereNotNull('username')
            ->whereRaw("username REGEXP '^[a-zA-Z0-9]{4,15}$'")
            ->count();

        $total   = User::count();
        $invalid = $total - $valid;

        return compact('valid', 'invalid', 'total');
    }

    private function getStateStats(): array
    {
        // users.status enum: active | inactive
        $active   = User::where('status', 'active')->count();
        $inactive = User::where('status', 'inactive')->count();
        $total    = $active + $inactive;

        return compact('active', 'inactive', 'total');
    }

    private function getStatusStats(): array
    {
        // users.state: New | Renew | Verified | Inactive | Blocked | ...
        $known  = ['New', 'Renew', 'Verified', 'Inactive', 'Blocked'];
        $counts = User::selectRaw('state, COUNT(*) as count')
            ->groupBy('state')
            ->pluck('count', 'state')
            ->toArray();

        $result = [];
        $others = 0;
        foreach ($counts as $state => $count) {
            if (in_array($state, $known)) {
                $result[$state] = (int) $count;
            } else {
                $others += (int) $count;
            }
        }

        foreach ($known as $k) {
            $result[$k] = $result[$k] ?? 0;
        }

        $result['Others'] = $others;
        $result['total']  = (int) array_sum(array_values($counts));

        return $result;
    }

    private function getYearLevelStats(): array
    {
        $map = [
            'Grade 11'  => 'Grade 11%',
            'Grade 12'  => 'Grade 12%',
            'Freshmen'  => 'Freshmen%',
            'Sophomore' => 'Sophomore%',
            'Junior'    => 'Junior%',
            'Senior'    => 'Senior%',
            'Masters'   => 'Masters%',
            'Doctorate' => 'Doctorate%',
            'Alumni'    => 'Alumni%',
        ];

        $result  = [];
        $counted = 0;

        foreach ($map as $label => $pattern) {
            $count           = User::where('year_level', 'LIKE', $pattern)->count();
            $result[$label]  = $count;
            $counted        += $count;
        }

        $total            = User::count();
        $result['Others'] = max(0, $total - $counted);
        $result['total']  = $total;

        return $result;
    }

    private function getRegionStats(): array
    {
        // Ordered by region ID so index maps to sheet rows p3–p19
        $rows = DB::table('users')
            ->join('regions', 'users.region', '=', 'regions.id')
            ->selectRaw('regions.id, regions.name, COUNT(*) as count')
            ->groupBy('regions.id', 'regions.name')
            ->orderBy('regions.id')
            ->get()
            ->pluck('count', 'name')
            ->toArray();

        $knownRegions = [
            '13 - Nat. Capital Region',
            '04 - CALABARZON',
            '03 - Central Luzon',
            '06 - Western Visayas',
            '01 - Ilocos Region',
            '02 - Cagayan Valley',
            '05 - Bicol Region',
            '07 - Central Visayas',
            '08 - Eastern Visayas',
            '09 - Zamboanga Peninsula',
            '10 - Northern Mindanao',
            '11 - Davao Region',
            '12 - Soccsksargen',
            '14 - Cordillera Adm. Region',
            '15 - Bangsamoro Autonomous Region in Muslim Mindanao',
            '16 - Caraga',
            '17 - MIMAROPA',
        ];

        $result  = [];
        $counted = 0;
        foreach ($knownRegions as $name) {
            $count          = (int) ($rows[$name] ?? 0);
            $result[$name]  = $count;
            $counted       += $count;
        }

        $totalUsers       = User::count();
        $result['Others'] = max(0, $totalUsers - $counted);
        $result['total']  = $totalUsers;

        return $result;
    }
}
