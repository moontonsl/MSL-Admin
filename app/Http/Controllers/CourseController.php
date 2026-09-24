<?php

namespace App\Http\Controllers;

use App\Models\MslCourse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Get all courses
     */
    public function index()
    {
        try {
            $courses = MslCourse::orderBy('program')->get();
            return response()->json($courses);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch courses'], 500);
        }
    }

    /**
     * Search courses by program name
     */
    public function search(Request $request)
    {
        try {
            $query = $request->get('query', '');
            
            if (empty($query)) {
                return response()->json([]);
            }

            $courses = MslCourse::where('program', 'LIKE', '%' . $query . '%')
                ->orderBy('program')
                ->get();

            return response()->json($courses);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to search courses'], 500);
        }
    }

    /**
     * Get courses by level
     */
    public function getByLevel($level)
    {
        try {
            $courses = MslCourse::where('level', $level)
                ->orderBy('program')
                ->get();

            return response()->json($courses);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch courses by level'], 500);
        }
    }
} 