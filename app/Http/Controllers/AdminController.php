<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\News;
use App\Models\Event;
use App\Models\MslEvent;
use App\Models\Carousel;
use App\Models\EventPhoto;
use App\Services\AnalyticsService;
use App\Services\GoogleAnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Generate a URL-friendly slug from a title
     */
    private function generateSlug($title)
    {
        // Convert to lowercase and replace spaces with hyphens
        $slug = strtolower($title);
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug); // Remove special characters
        $slug = preg_replace('/[\s-]+/', '-', $slug); // Replace spaces and multiple hyphens with single hyphen
        $slug = trim($slug, '-'); // Remove leading/trailing hyphens
        
        // Limit length to 100 characters
        $slug = substr($slug, 0, 100);
        
        return $slug;
    }
    protected $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function dashboard()
    {
        // Get real analytics data (with Google Analytics if available)
        $analytics = $this->analyticsService->getKeyMetrics();
        $pageViewsData = $this->analyticsService->getPageViewsLast7Days();
        $topPages = $this->analyticsService->getTopPages();
        $realTimeData = $this->analyticsService->getRealTimeData();

        return Inertia::render('Admin/Dashboard', [
            'pendingUsers' => User::where('email_verified_at', null)->count(),
            'totalNews' => News::count(),
            'upcomingEvents' => Event::where('start_date', '>=', now())->count(),
            'analytics' => [
                'pageViews' => $pageViewsData,
                'metrics' => $analytics,
                'topPages' => $topPages,
                'realTime' => $realTimeData
            ],
            'tournaments' => "1"
        ]);
    }

    public function pendingUsers()
    {
        return Inertia::render('Admin/PendingUsers', [
            'users' => User::where('email_verified_at', null)
                ->select('id', 'name', 'email', 'ml_id', 'created_at')
                ->paginate(10)
        ]);
    }

    public function verifyUser(User $user)
    {
        $user->email_verified_at = now();
        $user->save();

        return back()->with('success', 'User verified successfully');
    }

    public function manageNews()
    {
        return Inertia::render('Admin/News/Index', [
            'news' => News::orderBy('news_published', 'desc')->paginate(10)
        ]);
    }

    public function createNews()
    {
        return Inertia::render('Admin/News/Create');
    }

    public function storeNews(Request $request)
    {
        $validated = $request->validate([
            'news_title' => 'required|string|max:255',
            'news_subtitle' => 'required|string',
            'news_canonical' => 'required|string',
            'news_author' => 'required|string|max:255',
            'news_state' => 'required|string',
            'news_img1' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'news_img2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'news_img3' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $validated['news_writer'] = $validated['news_author'];
        $validated['news_published'] = now();

        // Set default values for image fields
        $validated['news_content'] = $validated['news_canonical']; // Map content to canonical field
        
        // Generate proper canonical URL slug from title
        $validated['news_canonical'] = $this->generateSlug($validated['news_title']);

        // Handle image uploads
        $imageFields = ['news_img1', 'news_img2', 'news_img3'];
        
        // Ensure news directory exists in storage
        $newsPath = storage_path('app/public/news');
        if (!file_exists($newsPath)) {
            mkdir($newsPath, 0755, true);
        }

        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $image = $request->file($field);
                $imageName = time() . '_' . $field . '_' . $image->getClientOriginalName();
                
                // Move to storage/app/public/news
                $image->move($newsPath, $imageName);
                $validated[$field] = $imageName;
            } else {
                $validated[$field] = '';
            }
        }

        News::create($validated);

        return redirect()->route('admin.news')->with('success', 'News created successfully');
    }

    private function resolveImageUrl(?string $filename): string
    {
        if (empty($filename)) {
            return '';
        }
        
        // Check multiple possible locations
        // We check the physical paths but return the public URLs
        
        // 1. Storage path (new)
        if (file_exists(storage_path('app/public/news/' . $filename))) {
            return '/storage/news/' . $filename;
        }
        
        // 2. Public path (legacy)
        $candidates = [
            '/images/MCC/IndivNews/' . $filename,
            '/images/MCC/News/' . $filename,
            '/images/MCC/News/Carousel/' . $filename,
            '/images/MCC/' . $filename,
        ];
        
        foreach ($candidates as $candidate) {
            if (file_exists(public_path($candidate))) {
                return $candidate;
            }
        }
        
        return '';
    }

    public function editNews(News $news)
    {
        // Resolve image URLs for the frontend
        $news->image1_url = $this->resolveImageUrl($news->news_img1);
        $news->image2_url = $this->resolveImageUrl($news->news_img2);
        $news->image3_url = $this->resolveImageUrl($news->news_img3);

        return Inertia::render('Admin/News/Edit', [
            'news' => $news
        ]);
    }

    public function updateNews(Request $request, News $news)
    {
        $validated = $request->validate([
            'news_title' => 'required|string|max:255',
            'news_subtitle' => 'required|string',
            'news_canonical' => 'required|string',
            'news_author' => 'required|string|max:255',
            'news_state' => 'required|string',
            'news_img1' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'news_img2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'news_img3' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $validated['news_writer'] = $validated['news_author'];

        // Set default values for content if not provided
        if (!isset($validated['news_content'])) {
            $validated['news_content'] = $validated['news_canonical'];
        }
        
        // Generate proper canonical URL slug from title if it's being updated
        if (isset($validated['news_title'])) {
            $validated['news_canonical'] = $this->generateSlug($validated['news_title']);
        }

        // Handle image uploads
        $imageFields = ['news_img1', 'news_img2', 'news_img3'];
        
        // Ensure news directory exists in storage
        $newsPath = storage_path('app/public/news');
        if (!file_exists($newsPath)) {
            mkdir($newsPath, 0755, true);
        }

        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                // Delete old image if it exists
                // Check both storage and legacy public path
                if ($news->$field) {
                    $oldStoragePath = storage_path('app/public/news/' . $news->$field);
                    $oldPublicPath = public_path('images/MCC/IndivNews/' . $news->$field);
                    
                    if (file_exists($oldStoragePath)) {
                        unlink($oldStoragePath);
                    } elseif (file_exists($oldPublicPath)) {
                        unlink($oldPublicPath);
                    }
                }
                
                $image = $request->file($field);
                $imageName = time() . '_' . $field . '_' . $image->getClientOriginalName();
                
                // Move to storage/app/public/news
                $image->move($newsPath, $imageName);
                $validated[$field] = $imageName;
            } else {
                // Keep existing image if no new one uploaded
                $validated[$field] = $news->$field ?: '';
            }
        }

        $news->update($validated);

        return redirect()->route('admin.news')->with('success', 'News updated successfully');
    }

    public function deleteNews(News $news)
    {
        $news->delete();
        return back()->with('success', 'News deleted successfully');
    }

    public function manageCarousel()
    {
        \Log::info('Carousel management page accessed');
        
        try {
            $carousels = \App\Models\Carousel::ordered()->get();
            
            \Log::info('Carousel data loaded for admin page', [
                'count' => $carousels->count(),
                'carousels' => $carousels->map(function($carousel) {
                    return [
                        'id' => $carousel->id,
                        'title' => $carousel->title,
                        'image_path' => $carousel->image_path,
                        'order' => $carousel->order,
                        'is_active' => $carousel->is_active,
                        'web_url' => '/storage/carousel/' . $carousel->image_path,
                        'file_exists' => \Storage::exists('public/carousel/' . $carousel->image_path),
                        'storage_link_exists' => is_link(public_path('storage'))
                    ];
                })->toArray()
            ]);
            
            return Inertia::render('Admin/Carousel/Index', [
                'carousels' => $carousels
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to load carousel management page', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return Inertia::render('Admin/Carousel/Index', [
                'carousels' => collect(),
                'error' => 'Failed to load carousel data: ' . $e->getMessage()
            ]);
        }
    }

    public function storeCarousel(Request $request)
    {
        \Log::info('Carousel store request started', [
            'request_data' => $request->except(['image']),
            'has_image' => $request->hasFile('image'),
            'image_size' => $request->hasFile('image') ? $request->file('image')->getSize() : null
        ]);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:5120', // 5MB max
            'order' => 'integer|min:0'
        ]);

        \Log::info('Carousel validation passed', ['validated_data' => $validated]);

        // Get image dimensions for validation
        $image = $request->file('image');
        $imageInfo = getimagesize($image->getPathname());
        $width = $imageInfo[0];
        $height = $imageInfo[1];

        \Log::info('Image dimensions check', [
            'width' => $width,
            'height' => $height,
            'required_width' => 1920,
            'required_height' => 1080
        ]);

        // Validate dimensions (you can adjust these values)
        $requiredWidth = 1920;
        $requiredHeight = 1080;
        
        if ($width !== $requiredWidth || $height !== $requiredHeight) {
            \Log::warning('Image dimensions validation failed', [
                'actual_dimensions' => "{$width}x{$height}",
                'required_dimensions' => "{$requiredWidth}x{$requiredHeight}"
            ]);
            return back()->withErrors([
                'image' => "Image must be exactly {$requiredWidth}x{$requiredHeight} pixels. Your image is {$width}x{$height} pixels."
            ]);
        }

        // Store image using Laravel's storage system
        $imageName = time() . '_' . $image->getClientOriginalName();
        \Log::info('Attempting to store image', [
            'original_name' => $image->getClientOriginalName(),
            'new_name' => $imageName,
            'storage_path' => 'public/carousel'
        ]);

        try {
            // Ensure carousel directory exists
            $carouselPath = storage_path('app/public/carousel');
            if (!file_exists($carouselPath)) {
                mkdir($carouselPath, 0755, true);
                \Log::info('Created carousel directory', ['path' => $carouselPath]);
            }
            
            $destination = $carouselPath . '/' . $imageName;
            $image->move($carouselPath, $imageName);
            
            \Log::info('Image stored successfully', [
                'image_name' => $imageName,
                'destination' => $destination,
                'file_exists' => file_exists($destination),
                'file_size' => file_exists($destination) ? filesize($destination) : null,
                'web_path' => '/storage/carousel/' . $imageName,
                'directory_exists' => file_exists($carouselPath)
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to store image', [
                'error' => $e->getMessage(),
                'image_name' => $imageName
            ]);
            return back()->withErrors(['image' => 'Failed to upload image: ' . $e->getMessage()]);
        }

        // Get next order number
        $order = $validated['order'] ?? (\App\Models\Carousel::max('order') + 1);

        \Log::info('Creating carousel record', [
            'title' => $validated['title'],
            'image_path' => $imageName,
            'order' => $order
        ]);

        try {
            $carousel = \App\Models\Carousel::create([
                'title' => $validated['title'],
                'image_path' => $imageName,
                'order' => $order,
                'is_active' => true
            ]);

            \Log::info('Carousel created successfully', [
                'carousel_id' => $carousel->id,
                'final_web_url' => '/storage/carousel/' . $imageName
            ]);

            return back()->with('success', 'Carousel image added successfully');
        } catch (\Exception $e) {
            \Log::error('Failed to create carousel record', [
                'error' => $e->getMessage(),
                'data' => [
                    'title' => $validated['title'],
                    'image_path' => $imageName,
                    'order' => $order
                ]
            ]);
            return back()->withErrors(['general' => 'Failed to save carousel: ' . $e->getMessage()]);
        }
    }

    public function updateCarousel(Request $request, \App\Models\Carousel $carousel)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'order' => 'integer|min:0',
            'is_active' => 'boolean'
        ]);

        // Handle image update if provided
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageInfo = getimagesize($image->getPathname());
            $width = $imageInfo[0];
            $height = $imageInfo[1];

            // Validate dimensions
            $requiredWidth = 1920;
            $requiredHeight = 1080;
            
            if ($width !== $requiredWidth || $height !== $requiredHeight) {
                return back()->withErrors([
                    'image' => "Image must be exactly {$requiredWidth}x{$requiredHeight} pixels. Your image is {$width}x{$height} pixels."
                ]);
            }

            // Delete old image
            if ($carousel->image_path && \Storage::exists('public/carousel/' . $carousel->image_path)) {
                \Storage::delete('public/carousel/' . $carousel->image_path);
            }

            // Store new image using move() for VPS compatibility
            $imageName = time() . '_' . $image->getClientOriginalName();
            
            // Ensure carousel directory exists
            $carouselPath = storage_path('app/public/carousel');
            if (!file_exists($carouselPath)) {
                mkdir($carouselPath, 0755, true);
                \Log::info('Created carousel directory during update', ['path' => $carouselPath]);
            }
            
            $destination = $carouselPath . '/' . $imageName;
            $image->move($carouselPath, $imageName);
            $validated['image_path'] = $imageName;
        }

        $carousel->update($validated);
        return back()->with('success', 'Carousel updated successfully');
    }

    public function deleteCarousel(\App\Models\Carousel $carousel)
    {
        // Delete image file from storage
        if ($carousel->image_path && \Storage::exists('public/carousel/' . $carousel->image_path)) {
            \Storage::delete('public/carousel/' . $carousel->image_path);
        }

        $carousel->delete();
        return back()->with('success', 'Carousel image deleted successfully');
    }

    public function reorderCarousel(Request $request)
    {
        $validated = $request->validate([
            'carousels' => 'required|array',
            'carousels.*.id' => 'required|integer|exists:carousels,id',
            'carousels.*.order' => 'required|integer|min:0'
        ]);

        foreach ($validated['carousels'] as $carouselData) {
            \App\Models\Carousel::where('id', $carouselData['id'])
                ->update(['order' => $carouselData['order']]);
        }

        return back()->with('success', 'Carousel order updated successfully');
    }

    public function manageEvents()
    {
        return Inertia::render('Admin/Events/Index', [
            'events' => Event::with('creator')->latest()->paginate(10)
        ]);
    }

    public function createEvent()
    {
        return Inertia::render('Admin/Events/Create');
    }

    public function storeEvent(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'location' => 'nullable|string',
        ]);

        $validated['created_by'] = Auth::id();

        Event::create($validated);

        return redirect()->route('admin.events')->with('success', 'Event created successfully');
    }

    public function editEvent(Event $event)
    {
        return Inertia::render('Admin/Events/Edit', [
            'event' => $event
        ]);
    }

    public function updateEvent(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'location' => 'nullable|string',
        ]);

        $event->update($validated);

        return redirect()->route('admin.events')->with('success', 'Event updated successfully');
    }

    public function deleteEvent(Event $event)
    {
        $event->delete();
        return back()->with('success', 'Event deleted successfully');
    }

    // MSL Event Management Methods
    public function mslEventIndex()
    {
        $events = MslEvent::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Admin/Events/MslEventIndex', [
            'events' => $events
        ]);
    }

    public function mslEventCreate()
    {
        return Inertia::render('Admin/Events/MslEventCreate');
    }

    public function storeMslEvent(Request $request)
    {
        \Log::info('MSL Event store request started', [
            'request_data' => $request->except(['event_logo']),
            'has_image' => $request->hasFile('event_logo'),
            'image_size' => $request->hasFile('event_logo') ? $request->file('event_logo')->getSize() : null
        ]);

        $validated = $request->validate([
            'event_name' => 'required|string|max:255',
            'event_title' => 'required|string|max:255',
            'event_subtitle' => 'required|string|max:500',
            'event_canonical' => 'required|string|max:255',
            'event_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'event_state' => 'required|in:Active,Inactive',
            'is_featured' => 'boolean',
            'event_content01' => 'nullable|string',
            'event_content02' => 'nullable|string',
            'event_img01' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'event_img02' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'event_img03' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'event_img04' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'event_img05' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        \Log::info('MSL Event validation passed', ['validated_data' => $validated]);

        // Handle event logo upload
        if ($request->hasFile('event_logo')) {
            $image = $request->file('event_logo');
            $imageName = time() . '_' . $image->getClientOriginalName();
            
            // Create events directory if it doesn't exist
            $eventsPath = public_path('images/MCC/Events');
            if (!file_exists($eventsPath)) {
                mkdir($eventsPath, 0755, true);
                \Log::info('Created events directory', ['path' => $eventsPath]);
            }
            
            $image->move($eventsPath, $imageName);
            $validated['event_logo'] = $imageName;
            
            \Log::info('Event logo stored successfully', [
                'image_name' => $imageName,
                'path' => $eventsPath . '/' . $imageName
            ]);
        } else {
            $validated['event_logo'] = '';
        }

        // Handle additional event images
        $imageFields = ['event_img01', 'event_img02', 'event_img03', 'event_img04', 'event_img05'];
        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $image = $request->file($field);
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->move($eventsPath, $imageName);
                $validated[$field] = $imageName;
            } else {
                $validated[$field] = '';
            }
        }

        // Set default values
        $validated['is_featured'] = $request->has('is_featured') ? 1 : 0;

        $event = MslEvent::create($validated);

        \Log::info('MSL Event created successfully', [
            'event_id' => $event->id,
            'event_name' => $event->event_name,
            'event_canonical' => $event->event_canonical
        ]);

        return redirect()->route('admin.msl-events.index')->with('success', 'Event created successfully');
    }

    public function mslEventEdit(MslEvent $mslEvent)
    {
        return Inertia::render('Admin/Events/MslEventEdit', [
            'event' => $mslEvent
        ]);
    }

    public function updateMslEvent(Request $request, MslEvent $mslEvent)
    {
        \Log::info('MSL Event update request started', [
            'event_id' => $mslEvent->id,
            'request_data' => $request->except(['event_logo']),
            'has_image' => $request->hasFile('event_logo')
        ]);

        $validated = $request->validate([
            'event_name' => 'required|string|max:255',
            'event_title' => 'required|string|max:255',
            'event_subtitle' => 'required|string|max:500',
            'event_canonical' => 'required|string|max:255',
            'event_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'event_state' => 'required|in:Active,Inactive',
            'is_featured' => 'boolean',
            'event_content01' => 'nullable|string',
            'event_content02' => 'nullable|string',
            'event_img01' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'event_img02' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'event_img03' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'event_img04' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'event_img05' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle event logo upload
        if ($request->hasFile('event_logo')) {
            // Delete old image if exists
            if ($mslEvent->event_logo && file_exists(public_path('images/MCC/Events/' . $mslEvent->event_logo))) {
                unlink(public_path('images/MCC/Events/' . $mslEvent->event_logo));
            }

            $image = $request->file('event_logo');
            $imageName = time() . '_' . $image->getClientOriginalName();
            
            $eventsPath = public_path('images/MCC/Events');
            if (!file_exists($eventsPath)) {
                mkdir($eventsPath, 0755, true);
            }
            
            $image->move($eventsPath, $imageName);
            $validated['event_logo'] = $imageName;
        }

        // Handle additional event images
        $imageFields = ['event_img01', 'event_img02', 'event_img03', 'event_img04', 'event_img05'];
        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                // Delete old image if exists
                if ($mslEvent->$field && file_exists(public_path('images/MCC/Events/' . $mslEvent->$field))) {
                    unlink(public_path('images/MCC/Events/' . $mslEvent->$field));
                }

                $image = $request->file($field);
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->move($eventsPath, $imageName);
                $validated[$field] = $imageName;
            }
        }

        // Set default values
        $validated['is_featured'] = $request->has('is_featured') ? 1 : 0;

        $mslEvent->update($validated);

        \Log::info('MSL Event updated successfully', [
            'event_id' => $mslEvent->id,
            'event_name' => $mslEvent->event_name
        ]);

        return redirect()->route('admin.msl-events.index')->with('success', 'Event updated successfully');
    }

    public function updateMslEventStatus(Request $request, MslEvent $mslEvent)
    {
        $validated = $request->validate([
            'event_state' => 'required|in:Active,Inactive'
        ]);

        $mslEvent->update($validated);

        return back()->with('success', 'Event status updated successfully');
    }

    public function destroyMslEvent(MslEvent $mslEvent)
    {
        // Delete associated images
        $imageFields = ['event_logo', 'event_img01', 'event_img02', 'event_img03', 'event_img04', 'event_img05'];
        foreach ($imageFields as $field) {
            if ($mslEvent->$field && file_exists(public_path('images/MCC/Events/' . $mslEvent->$field))) {
                unlink(public_path('images/MCC/Events/' . $mslEvent->$field));
            }
        }

        $mslEvent->delete();

        return back()->with('success', 'Event deleted successfully');
    }

    // SL Management Methods
    public function slManagement()
    {
        $slUsers = User::where('role', 'SL')
            ->select('id', 'name', 'email', 'ml_id', 'university', 'region', 'state', 'created_at')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $students = User::where('state', 'Verified')
            ->where('role', '!=', 'SL')
            ->where('role', '!=', 'Admin')
            ->where('role', '!=', 'Super Admin')
            ->where('role', '!=', 'Regional Admin')
            ->select('id', 'name', 'email', 'ml_id', 'university', 'region', 'state', 'created_at')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/SLManagement', [
            'slUsers' => $slUsers,
            'students' => $students
        ]);
    }

    public function promoteToSL(User $user)
    {
        // Only allow promoting verified students (not admins or SL)
        $adminRoles = ['SL', 'Admin', 'Super Admin', 'Regional Admin'];
        if (in_array($user->role, $adminRoles) || $user->state !== 'Verified') {
            return back()->withErrors(['error' => 'Only verified students can be promoted to Student Leader.']);
        }

        $user->update([
            'role' => 'SL'
        ]);

        return back()->with('success', 'User promoted to Student Leader successfully');
    }

    public function demoteFromSL(User $user)
    {
        // Only allow demoting SL users
        if ($user->role !== 'SL') {
            return back()->withErrors(['error' => 'User is not a Student Leader.']);
        }

        $user->update([
            'role' => 'user'
        ]);

        return back()->with('success', 'Student Leader demoted to Student successfully');
    }

    // Regional Admin Management Methods
    public function regionalAdminManagement()
    {
        $regionalAdmins = User::where('role', 'Regional Admin')
            ->select('id', 'name', 'email', 'ml_id', 'university', 'region', 'state', 'created_at')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $students = User::where('state', 'Verified')
            ->where('role', '!=', 'SL')
            ->where('role', '!=', 'Admin')
            ->where('role', '!=', 'Super Admin')
            ->where('role', '!=', 'Regional Admin')
            ->select('id', 'name', 'email', 'ml_id', 'university', 'region', 'state', 'created_at')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/RegionalAdminManagement', [
            'regionalAdmins' => $regionalAdmins,
            'students' => $students
        ]);
    }

    public function promoteToRegionalAdmin(User $user)
    {
        // Only allow promoting verified students (not admins or SL)
        $adminRoles = ['SL', 'Admin', 'Super Admin', 'Regional Admin'];
        if (in_array($user->role, $adminRoles) || $user->state !== 'Verified') {
            return back()->withErrors(['error' => 'Only verified students can be promoted to Regional Admin.']);
        }

        $user->update([
            'role' => 'Regional Admin'
        ]);

        return back()->with('success', 'User promoted to Regional Admin successfully');
    }

    public function demoteFromRegionalAdmin(User $user)
    {
        // Only allow demoting Regional Admin users
        if ($user->role !== 'Regional Admin') {
            return back()->withErrors(['error' => 'User is not a Regional Admin.']);
        }

        $user->update([
            'role' => 'user'
        ]);

        return back()->with('success', 'Regional Admin demoted to Student successfully');
    }

    // Event Photos Management Methods
    public function manageEventPhotos()
    {
        $eventPhotos = EventPhoto::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Admin/EventPhotos/Index', [
            'eventPhotos' => $eventPhotos
        ]);
    }

    public function storeEventPhoto(Request $request)
    {
        $validated = $request->validate([
            'event_name' => 'required|string|max:255',
            'school_name' => 'required|string|max:255',
            'picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        // Handle image upload
        if ($request->hasFile('picture')) {
            $image = $request->file('picture');
            $imageName = time() . '_' . $image->getClientOriginalName();
            
            // Create EventPhotos directory if it doesn't exist
            $eventPhotosPath = public_path('images/EventPhotos');
            if (!file_exists($eventPhotosPath)) {
                mkdir($eventPhotosPath, 0755, true);
                \Log::info('Created EventPhotos directory', ['path' => $eventPhotosPath]);
            }
            
            $image->move($eventPhotosPath, $imageName);
            $validated['picture'] = $imageName;
            
            \Log::info('Event photo stored successfully', [
                'image_name' => $imageName,
                'path' => $eventPhotosPath . '/' . $imageName
            ]);
        }

        EventPhoto::create($validated);

        return back()->with('success', 'Event photo added successfully');
    }

    public function updateEventPhoto(Request $request, EventPhoto $eventPhoto)
    {
        $validated = $request->validate([
            'event_name' => 'required|string|max:255',
            'school_name' => 'required|string|max:255',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        // Handle image update if provided
        if ($request->hasFile('picture')) {
            // Delete old image if exists - get raw attribute to get just the filename
            $oldPictureFilename = $eventPhoto->getAttributes()['picture'] ?? null;
            if ($oldPictureFilename) {
                $oldImagePath = public_path('images/EventPhotos/' . $oldPictureFilename);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $image = $request->file('picture');
            $imageName = time() . '_' . $image->getClientOriginalName();
            
            $eventPhotosPath = public_path('images/EventPhotos');
            if (!file_exists($eventPhotosPath)) {
                mkdir($eventPhotosPath, 0755, true);
            }
            
            $image->move($eventPhotosPath, $imageName);
            $validated['picture'] = $imageName;
        } else {
            // Don't update picture if not provided - remove from validated array
            unset($validated['picture']);
        }

        $eventPhoto->update($validated);

        return back()->with('success', 'Event photo updated successfully');
    }

    public function deleteEventPhoto(EventPhoto $eventPhoto)
    {
        // Delete image file - get raw attribute to get just the filename
        $pictureFilename = $eventPhoto->getAttributes()['picture'] ?? null;
        if ($pictureFilename) {
            $imagePath = public_path('images/EventPhotos/' . $pictureFilename);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        $eventPhoto->delete();

        return back()->with('success', 'Event photo deleted successfully');
    }
}