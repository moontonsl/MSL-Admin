<?php

namespace App\Http\Controllers;

use App\Models\MslEvent;
use App\Models\MCCSeason;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventsController extends Controller
{
    public function index()
    {
        $events = MslEvent::activeAndFeatured()->get();
        
        // Get active MCC season
        $activeMccSeason = MCCSeason::active()->first();
        
        return Inertia::render('Events/Events', [
            'events' => $events,
            'activeMccSeason' => $activeMccSeason ? [
                'season_number' => $activeMccSeason->season_number,
                'season_name' => $activeMccSeason->season_name,
                'route_slug' => $activeMccSeason->route_slug,
            ] : null,
        ]);
    }

    public function show($event)
    {
        // If $event is a string (canonical URL), find the event by canonical
        if (is_string($event)) {
            $mslEvent = MslEvent::where('event_canonical', $event)
                ->orWhere('event_canonical', '/' . $event)
                ->first();
            
            if (!$mslEvent) {
                abort(404, 'Event not found');
            }
            
            $event = $mslEvent;
        }
        
        // Check if this event has a dynamic redirect URL configured
        if ($event->redirect_url) {
            $redirectUrl = $event->redirect_url;
            // Ensure the URL starts with / if it's internal and not a full URL
            if (!str_starts_with($redirectUrl, '/') && !str_starts_with($redirectUrl, 'http')) {
                $redirectUrl = '/' . $redirectUrl;
            }
            return redirect($redirectUrl);
        }
        
        // For all other events, redirect to the custom canonical URL
        // This allows the programmer to create the actual event page later
        $canonicalUrl = $event->event_canonical;
        if (!$canonicalUrl) {
            abort(404, 'Event link not configured');
        }
        
        // Ensure the URL starts with /
        if (!str_starts_with($canonicalUrl, '/')) {
            $canonicalUrl = '/' . $canonicalUrl;
        }
        
        return redirect($canonicalUrl);
    }
}
