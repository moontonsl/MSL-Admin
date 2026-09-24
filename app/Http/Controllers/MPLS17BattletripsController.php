<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MPLS17BattletripsController extends Controller
{
    private function defaultTopics()
    {
        return [
            [
                'name' => 'Building Your Brand in Esports',
                'description' => 'Learn the fundamentals of social media and content creation to grow your audience, establish your personal brand, and unlock opportunities in the esports industry.',
                'status' => 'OPEN',
            ],
            [
                'name' => 'Career at Moonton Games',
                'description' => 'Explore the many career paths beyond playing professionally and learn how different disciplines come together to create world-class esports experiences.',
                'status' => 'OPEN',
            ],
            [
                'name' => 'Data Wins Championships',
                'description' => 'Learn how MPL coaches leverage data, analytics, and strategic preparation to make informed decisions, refine team performance, and gain a competitive edge in today\'s esports industry.',
                'status' => 'OPEN',
            ],
            [
                'name' => 'Esports Journalism',
                'description' => 'Learn how journalists cover the fast-paced world of esports by telling compelling stories, reporting accurately, and documenting the people, teams, and moments that shape the industry.',
                'status' => 'OPEN',
            ],
            [
                'name' => 'Finding Your Voice in Esports',
                'description' => 'Discover how MPL casters develop their unique on-air identity, build confidence behind the microphone, and connect with audiences through authentic storytelling and effective communication.',
                'status' => 'OPEN',
            ],
            [
                'name' => 'Leveling Up Philippine Esports',
                'description' => 'Explore how organizations like GAB and PESO are shaping the future of Philippine esports through athlete development, governance, and initiatives that support a sustainable and competitive industry.',
                'status' => 'OPEN',
            ],
            [
                'name' => 'Pathway to Pro: Pressure Makes Players',
                'description' => 'Discover what it takes to succeed in the world\'s strongest MLBB region as an MPL player shares the challenges, sacrifices, and lessons that transform aspiring competitors into professional champions.',
                'status' => 'OPEN',
            ],
            [
                'name' => 'Powering the Future of Esports',
                'description' => 'Discover how technology, connectivity, and innovation are transforming the esports experience and empowering players, fans, and communities to compete and connect like never before.',
                'status' => 'OPEN',
            ],
        ];
    }

    public function index()
    {
        $topics = json_decode(Setting::getValue('mpl_battle_trips_topics', json_encode($this->defaultTopics())), true) ?: $this->defaultTopics();

        return Inertia::render('ExternalEvents/MPLS17BattleTrips/Pages/MPLS17Battletrips', [
            'topics' => $topics,
        ]);
    }

    public function update(Request $request)
    {
        $topics = json_decode(Setting::getValue('mpl_battle_trips_topics', json_encode($this->defaultTopics())), true) ?: $this->defaultTopics();

        return Inertia::render('ExternalEvents/MPLS17BattleTrips/Pages/Update', [
            'currentTopics' => $topics,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'topics' => 'required|array|min:1',
            'topics.*.name' => 'required|string',
            'topics.*.description' => 'nullable|string',
            'topics.*.status' => 'required|in:OPEN,FULL,CLOSED',
        ]);

        if ($request->code !== '3054') {
            return back()->withErrors(['code' => 'Invalid access code.']);
        }

        Setting::setValue('mpl_battle_trips_topics', json_encode($request->topics, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), 'json');

        return back()->with('message', 'Settings updated successfully!');
    }
}
