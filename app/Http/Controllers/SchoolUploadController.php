<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SchoolUploadController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->input('schools');

        DB::beginTransaction();

        try {
            $idCounters = [
                'islands' => 1, 'regions' => 1, 'provinces' => 1,
                'municipalities' => 1, 'school_types' => 1
            ];
            $lookups = ['islands' => [], 'regions' => [], 'provinces' => [], 'municipalities' => [], 'school_types' => []];

            foreach ($data as $item) {
                $island = $item['island'];
                $region = $item['region'];
                $province = $item['province'] ?? $item['provice'] ?? null;
                $municipality = $item['municipality'] ?? $item['municipality city'] ?? null;
                $type = $item['type'];

                if (!isset($lookups['islands'][$island])) {
                    $id = $idCounters['islands']++;
                    DB::table('islands')->insert(['id' => $id, 'name' => $island]);
                    $lookups['islands'][$island] = $id;
                }
                $islandId = $lookups['islands'][$island];

                if (!isset($lookups['regions'][$region])) {
                    $id = $idCounters['regions']++;
                    DB::table('regions')->insert(['id' => $id, 'name' => $region, 'island_id' => $islandId]);
                    $lookups['regions'][$region] = $id;
                }
                $regionId = $lookups['regions'][$region];

                if (!isset($lookups['provinces'][$province])) {
                    $id = $idCounters['provinces']++;
                    DB::table('provinces')->insert(['id' => $id, 'name' => $province]);
                    $lookups['provinces'][$province] = $id;
                }
                $provinceId = $lookups['provinces'][$province];

                if (!isset($lookups['municipalities'][$municipality])) {
                    $id = $idCounters['municipalities']++;
                    DB::table('municipalities')->insert([
                        'id' => $id,
                        'name' => $municipality,
                        'province_id' => $provinceId
                    ]);
                    $lookups['municipalities'][$municipality] = $id;
                }
                $municipalityId = $lookups['municipalities'][$municipality];

                if (!isset($lookups['school_types'][$type])) {
                    $id = $idCounters['school_types']++;
                    DB::table('school_types')->insert(['id' => $id, 'type_name' => $type]);
                    $lookups['school_types'][$type] = $id;
                }
                $typeId = $lookups['school_types'][$type];

                DB::table('schools')->insert([
                    'name' => $item['name'],
                    'municipality_id' => $municipalityId,
                    'region_id' => $regionId,
                    'type_id' => $typeId
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Schools uploaded successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Upload failed: ' . $e->getMessage()], 500);
        }
    }
}
