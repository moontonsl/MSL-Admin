<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing news articles with proper canonical slugs
        $articles = \App\Models\News::all();
        
        foreach ($articles as $article) {
            // Check if the canonical is too long (more than 100 characters) or contains content
            if (strlen($article->news_canonical) > 100 || strpos($article->news_canonical, ' ') !== false) {
                $newSlug = $this->generateSlug($article->news_title);
                
                // Ensure uniqueness by appending ID if needed
                $originalSlug = $newSlug;
                $counter = 1;
                while (\App\Models\News::where('news_canonical', $newSlug)->where('id', '!=', $article->id)->exists()) {
                    $newSlug = $originalSlug . '-' . $counter;
                    $counter++;
                }
                
                $article->update(['news_canonical' => $newSlug]);
                echo "Updated article ID {$article->id}: '{$article->news_canonical}' -> '{$newSlug}'\n";
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration cannot be easily reversed as we don't store the original canonical values
        // You would need to restore from a backup if needed
    }
    
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
};
