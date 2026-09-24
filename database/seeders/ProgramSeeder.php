<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the JSON data
        $jsonData = json_decode(file_get_contents(public_path('json/courses.json')), true);
        
        // Get all education levels for mapping
        $educationLevels = DB::table('education_levels')
            ->select('id', 'name')
            ->get()
            ->keyBy('name');

        foreach ($jsonData as $program) {
            // Skip if education level doesn't exist
            if (!isset($educationLevels[$program['Level']])) {
                continue;
            }

            $name = $program['program'];
            
            // Extract program code if it exists in parentheses
            $code = null;
            if (preg_match('/\(([^)]+)\)/', $name, $matches)) {
                $code = $matches[1];
                // Remove the code from the name
                $name = trim(preg_replace('/\s*\([^)]*\)/', '', $name));
            }

            // Clean up the name
            $name = $this->cleanProgramName($name);

            DB::table('programs')->insert([
                'education_level_id' => $educationLevels[$program['Level']]->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'code' => $code,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Clean up program name by removing common prefixes and standardizing format
     */
    private function cleanProgramName(string $name): string
    {
        // Remove common prefixes
        $prefixes = [
            'Bachelor of ',
            'Bachelor in ',
            'BS in ',
            'BA in ',
            'BFA in ',
            'BSEd in ',
            'BEED in ',
            'BTVTEd in ',
            'BET in ',
            'Graduate Studies: ',
            'SHS: ',
        ];

        $name = str_replace($prefixes, '', $name);

        // Remove any remaining "Major in" or "Major In"
        $name = preg_replace('/\s*Major\s+in\s+/i', '', $name);

        // Remove any remaining "With Option in" or similar phrases
        $name = preg_replace('/\s*With\s+Option\s+in\s+.*$/', '', $name);

        // Remove any remaining "– Level II" or "– Level III" or similar
        $name = preg_replace('/\s*[–-]\s*Level\s+[IV]+$/', '', $name);

        // Trim any extra spaces
        $name = trim($name);

        return $name;
    }
} 