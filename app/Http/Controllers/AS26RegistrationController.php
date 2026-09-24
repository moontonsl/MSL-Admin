<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AS26RegistrationController extends Controller
{
    const SETTING_KEY = 'as26_venues';
    const DATES_KEY   = 'as26_event_dates';

    const DEFAULT_DATES = [
        ['value' => '2026-01-23', 'label' => 'January 23, 2026', 'disabled' => true],
        ['value' => '2026-01-24', 'label' => 'January 24, 2026', 'disabled' => true],
        ['value' => '2026-01-25', 'label' => 'January 25, 2026', 'disabled' => false],
    ];

    const DEFAULT_VENUES = [
        'Luzon' => [
            'Online' => [
                'Philippine Normal University Manila',
                'Urdaneta City University',
            ],
            'Onsite' => [
                'Colegio de Muntinlupa',
                'PHINMA Saint Jude College - Manila',
                'Lyceum of Subic Bay',
                'Laguna State Polytechnic University - Los Baños Campus',
            ],
        ],
        'Visayas' => [
            'Online' => [
                'Northwest Samar State University',
                'Eastern Visayas State University - Ormoc City Campus',
                'University of Cebu - Banilad',
            ],
            'Onsite' => [
                'Visayas State University Main',
                'University of Saint La Salle',
                'University of San Carlos',
                'Southwestern University PHINMA',
                'Cebu Institute of Technology - University',
                'Iloilo Science and Technology University - La Paz Campus',
                'West Visayas State University - Main Campus',
            ],
        ],
        'Mindanao' => [
            'Online' => [
                'PHINMA Cagayan de Oro College',
                'University of Southern Mindanao Kabacan Main Campus',
                'ACLC College of Bukidnon',
                'Surigao Del Norte State University',
                'Josefina Herrera Cerilles State College',
            ],
            'Onsite' => [
                'Mindanao State University - Iligan Institute of Technology',
                'Davao Del Norte State College',
                'Father Saturnino Urios University',
                'Caraga State University - Main Campus',
                'Ateneo De Davao University',
                'Holy Cross Davao College',
                'University of Immaculate Conception',
            ],
        ],
    ];

    private function getVenues(): array
    {
        $stored = Setting::getValue(self::SETTING_KEY);
        if ($stored) {
            return json_decode($stored, true) ?? self::DEFAULT_VENUES;
        }
        return self::DEFAULT_VENUES;
    }

    private function saveVenues(array $venues): void
    {
        Setting::setValue(self::SETTING_KEY, json_encode($venues));
    }

    private function getEventDates(): array
    {
        $stored = Setting::getValue(self::DATES_KEY);
        if ($stored) {
            return json_decode($stored, true) ?? self::DEFAULT_DATES;
        }
        return self::DEFAULT_DATES;
    }

    private function saveEventDates(array $dates): void
    {
        Setting::setValue(self::DATES_KEY, json_encode($dates));
    }

    public function index()
    {
        return Inertia::render('ExternalEvents/AS26WP/Pages/AS26WPRegistration', [
            'regionsData' => $this->getVenues(),
            'eventDates'  => $this->getEventDates(),
        ]);
    }

    public function schools()
    {
        return Inertia::render('ExternalEvents/AS26WP/Pages/AS26WPSchools', [
            'regionsData' => $this->getVenues(),
        ]);
    }

    public function dates()
    {
        return Inertia::render('ExternalEvents/AS26WP/Pages/AS26WPDates', [
            'eventDates' => $this->getEventDates(),
        ]);
    }

    public function addDate(Request $request)
    {
        $request->validate([
            'value'    => 'required|date_format:Y-m-d',
            'label'    => 'required|string|max:100',
            'disabled' => 'required|boolean',
        ]);

        $dates = $this->getEventDates();

        foreach ($dates as $d) {
            if ($d['value'] === $request->value) {
                return back()->withErrors(['value' => 'This date already exists.']);
            }
        }

        $dates[] = [
            'value'    => $request->value,
            'label'    => trim($request->label),
            'disabled' => (bool) $request->disabled,
        ];

        usort($dates, fn($a, $b) => strcmp($a['value'], $b['value']));
        $this->saveEventDates($dates);

        return back()->with('message', 'Date added successfully.');
    }

    public function updateDate(Request $request)
    {
        $request->validate([
            'old_value' => 'required|string',
            'value'     => 'required|date_format:Y-m-d',
            'label'     => 'required|string|max:100',
            'disabled'  => 'required|boolean',
        ]);

        $dates = $this->getEventDates();

        $dates = array_map(function ($d) use ($request) {
            if ($d['value'] === $request->old_value) {
                return [
                    'value'    => $request->value,
                    'label'    => trim($request->label),
                    'disabled' => (bool) $request->disabled,
                ];
            }
            return $d;
        }, $dates);

        usort($dates, fn($a, $b) => strcmp($a['value'], $b['value']));
        $this->saveEventDates($dates);

        return back()->with('message', 'Date updated successfully.');
    }

    public function deleteDate(Request $request)
    {
        $request->validate(['value' => 'required|string']);

        $dates = array_values(
            array_filter($this->getEventDates(), fn($d) => $d['value'] !== $request->value)
        );

        $this->saveEventDates($dates);

        return back()->with('message', 'Date deleted successfully.');
    }

    public function searchSchools(Request $request)
    {
        $island = $request->get('island', '');
        $query  = $request->get('q', '');

        $schools = \App\Models\School::whereHas('region.island', function ($q) use ($island) {
                $q->where('name', $island);
            })
            ->when($query, function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%");
            })
            ->orderByRaw("CASE WHEN name LIKE ? THEN 0 ELSE 1 END, name", [$query . '%'])
            ->limit(8)
            ->pluck('name');

        return response()->json($schools);
    }

    public function addSchool(Request $request)
    {
        $request->validate([
            'region' => 'required|string',
            'mode'   => 'required|in:Online,Onsite',
            'name'   => 'required|string|max:255',
        ]);

        $venues = $this->getVenues();
        $region = $request->region;
        $mode   = $request->mode;
        $name   = trim($request->name);

        if (!isset($venues[$region])) {
            $venues[$region] = ['Online' => [], 'Onsite' => []];
        }

        if (in_array($name, $venues[$region][$mode])) {
            return back()->withErrors(['name' => 'This school already exists in this region and mode.']);
        }

        $venues[$region][$mode][] = $name;
        $this->saveVenues($venues);

        return back()->with('message', 'School added successfully.');
    }

    public function updateSchool(Request $request)
    {
        $request->validate([
            'old_region' => 'required|string',
            'old_mode'   => 'required|in:Online,Onsite',
            'old_name'   => 'required|string',
            'new_region' => 'required|string',
            'new_mode'   => 'required|in:Online,Onsite',
            'new_name'   => 'required|string|max:255',
        ]);

        $venues    = $this->getVenues();
        $oldRegion = $request->old_region;
        $oldMode   = $request->old_mode;
        $oldName   = $request->old_name;
        $newRegion = $request->new_region;
        $newMode   = $request->new_mode;
        $newName   = trim($request->new_name);

        $venues[$oldRegion][$oldMode] = array_values(
            array_filter($venues[$oldRegion][$oldMode], fn($v) => $v !== $oldName)
        );

        if (!isset($venues[$newRegion])) {
            $venues[$newRegion] = ['Online' => [], 'Onsite' => []];
        }

        if (!in_array($newName, $venues[$newRegion][$newMode])) {
            $venues[$newRegion][$newMode][] = $newName;
        }

        $this->saveVenues($venues);

        return back()->with('message', 'School updated successfully.');
    }

    public function deleteSchool(Request $request)
    {
        $request->validate([
            'region' => 'required|string',
            'mode'   => 'required|in:Online,Onsite',
            'name'   => 'required|string',
        ]);

        $venues = $this->getVenues();
        $region = $request->region;
        $mode   = $request->mode;
        $name   = $request->name;

        $venues[$region][$mode] = array_values(
            array_filter($venues[$region][$mode], fn($v) => $v !== $name)
        );

        $this->saveVenues($venues);

        return back()->with('message', 'School deleted successfully.');
    }
}
