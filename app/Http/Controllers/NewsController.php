<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\News;
use Inertia\Inertia;


class NewsController extends Controller
{
    private function resolveImageUrl(?string $filename): string
    {
        if (empty($filename)) {
            \Log::info("resolveImageUrl: filename is empty, using fallback");
            return '/images/MCC/IndivNews/News - Holder.jpg';
        }
        
        // Check multiple possible locations - prioritize IndivNews for individual articles
        $candidates = [
            '/storage/news/' . $filename,          // New storage path
            '/images/MCC/IndivNews/' . $filename,  // Individual news images
            '/images/MCC/News/' . $filename,       // General news images
            '/images/MCC/News/Carousel/' . $filename, // Carousel images
            '/images/MCC/' . $filename,            // Root MCC images
        ];
        
        // Check if any of the candidate files actually exist
        foreach ($candidates as $candidate) {
            $fullPath = public_path($candidate);
            if (file_exists($fullPath)) {
                \Log::info("resolveImageUrl: filename='{$filename}', found at: '{$candidate}'");
                return $candidate;
            }
        }
        
        // If no file found, use fallback
        \Log::warning("resolveImageUrl: filename='{$filename}' not found in any location, using fallback");
        return '/images/MCC/IndivNews/News - Holder.jpg';
    }

    /**
     * Display a listing of the resource.
     */
    public function getArticles()
    {
        $articles = News::orderByDesc('news_published')
            ->select(
                'id',
                'news_canonical',
                'news_state as category',
                'news_title as title',
                'news_subtitle as subtitle',
                'news_writer as author',
                'news_published as date',
                'news_img1',
                'news_img2',
                'news_img3',
                'news_content as content'
            )
            ->get()
            ->map(function ($article) {
                // Generate a fallback canonical if none exists
                if (empty($article->news_canonical)) {
                    $article->news_canonical = 'article-' . $article->id;
                    \Log::info("Generated fallback canonical for article {$article->id}: {$article->news_canonical}");
                }
                
                $article->image = $this->resolveImageUrl($article->news_img1);
                $article->image2 = $article->news_img2 ? $this->resolveImageUrl($article->news_img2) : null;
                $article->image3 = $article->news_img3 ? $this->resolveImageUrl($article->news_img3) : null;
                unset($article->news_img1, $article->news_img2, $article->news_img3);
                
                // Add the link for convenience
                $article->link = '/news/' . $article->news_canonical;
                
                return $article;
            });

        // Add some debugging info
        \Log::info('Articles API response:', $articles->toArray());
        return response()->json($articles);
    }

    /**
     * Return highlight items for the carousel
     */
    public function getHighlights()
    {
        $highlights = News::where('news_state', 'Highlight')
            ->orderByDesc('news_published')
            ->select(
                'id',
                'news_canonical',
                'news_title as title',
                'news_writer as author',
                'news_published as date',
                'news_img1'
            )
            ->take(5)
            ->get()
            ->map(function ($item) {
                $item->src = $this->resolveImageUrl($item->news_img1);
                $item->link = '/news/' . ($item->news_canonical ?? $item->id);
                unset($item->news_img1);
                return $item;
            });

        return response()->json($highlights);
    }

    /**
     * Get related articles for sidebar (excluding current article)
     */
    public function getRelatedArticles(Request $request)
    {
        $currentSlug = $request->query('exclude', '');
        $limit = $request->query('limit', 3);

        \Log::info("getRelatedArticles called with exclude: {$currentSlug}");

        // Get all articles ordered by date (most recent first)
        $allArticles = News::orderByRaw('STR_TO_DATE(news_published, "%Y-%m-%d") DESC')
            ->select(
                'id',
                'news_canonical as slug',
                'news_title as title',
                'news_published as date',
                'news_img1'
            )
            ->get();

        \Log::info("Total articles found: " . $allArticles->count());
        
        // Debug: Log all articles with their slugs and dates
        foreach ($allArticles as $article) {
            \Log::info("Article: ID={$article->id}, Slug={$article->slug}, Date={$article->date}, Title={$article->title}");
        }

        // Find the current article's position
        $currentIndex = -1;
        if ($currentSlug) {
            $currentIndex = $allArticles->search(function ($article) use ($currentSlug) {
                return $article->slug === $currentSlug;
            });
            \Log::info("Current article index: {$currentIndex}");
        }

        // Filter out the current article and get the next most recent ones
        $relatedArticles = $allArticles
            ->filter(function ($article) use ($currentSlug) {
                $excluded = $article->slug !== $currentSlug;
                \Log::info("Article '{$article->slug}' excluded: " . ($excluded ? 'NO' : 'YES'));
                return $excluded;
            })
            ->take($limit)
            ->map(function ($article) {
                $article->image = $this->resolveImageUrl($article->news_img1);
                unset($article->news_img1);
                return $article;
            });

        \Log::info("Related articles returned: " . $relatedArticles->count());

        // Convert collection to array and ensure it's a sequential array
        $articlesArray = $relatedArticles->values()->toArray();
        \Log::info("Converted to array, count: " . count($articlesArray));

        return response()->json($articlesArray);
    }

    public function index()
    {
        $news = News::all();
        return Inertia::render('News/Index', ['news' => $news]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $canonical)
    {
        try {
            \Log::info("Attempting to fetch article with canonical: {$canonical}");
            
            // First try to find by exact canonical match
            $article = News::where('news_canonical', $canonical)
                ->select(
                    'id',
                    'news_canonical as canonical',
                    'news_state as category',
                    'news_title as title',
                    'news_subtitle as subtitle',
                    'news_writer as author',
                    'news_published as date',
                    'news_img1',
                    'news_img2',
                    'news_img3',
                    'news_content as content'
                )
                ->first();
            
            // If not found and canonical looks like an ID (article-123), try by ID
            if (!$article && preg_match('/^article-(\d+)$/', $canonical, $matches)) {
                $articleId = $matches[1];
                \Log::info("Trying to find article by ID: {$articleId}");
                
                $article = News::where('id', $articleId)
                    ->select(
                        'id',
                        'news_canonical as canonical',
                        'news_state as category',
                        'news_title as title',
                        'news_subtitle as subtitle',
                        'news_writer as author',
                        'news_published as date',
                        'news_img1',
                        'news_img2',
                        'news_img3',
                        'news_content as content'
                    )
                    ->first();
            }
            
            if (!$article) {
                throw new \Illuminate\Database\Eloquent\ModelNotFoundException();
            }

            \Log::info("Found article: {$article->title} (ID: {$article->id})");
            \Log::info("Article news_img1: '{$article->news_img1}'");

            $article->image = $this->resolveImageUrl($article->news_img1);
            \Log::info("Resolved image path: '{$article->image}'");
            
            $article->image2 = $article->news_img2 ? $this->resolveImageUrl($article->news_img2) : null;
            $article->image3 = $article->news_img3 ? $this->resolveImageUrl($article->news_img3) : null;
            unset($article->news_img1, $article->news_img2, $article->news_img3);

            // Add absolute URLs for Open Graph meta tags
            $appUrl = config('app.url');
            $article->absoluteUrl = $appUrl . '/news/' . $article->canonical;
            $article->absoluteImageUrl = $article->image ? $appUrl . $article->image : null;

            return Inertia::render('News/Article', [
                'article' => $article,
            ]);
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            \Log::warning("Article not found with canonical: {$canonical}");
            abort(404, 'News article not found');
        } catch (\Exception $e) {
            \Log::error("Error fetching article with canonical {$canonical}: " . $e->getMessage());
            abort(500, 'Internal server error');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
