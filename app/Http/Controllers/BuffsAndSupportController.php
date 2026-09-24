<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EventPhoto;
use Inertia\Inertia;

class BuffsAndSupportController extends Controller
{
    public function index()
    {
        $eventPhotos = EventPhoto::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('BuffsAndSupport/BuffsAndSupport', [
            'eventPhotos' => $eventPhotos
        ]);
    }
}
