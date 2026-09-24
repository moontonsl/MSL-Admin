# Individual News Pages

This directory contains individual news article pages. Each news article should follow the same structure for consistency.

## Structure

```
Individual News Pages/
├── [Article Name]/
│   ├── index.jsx          # Main page component
│   ├── description.jsx    # Article content component
│   └── README.md         # Optional: Article-specific notes
├── Components/
│   └── NewsArticleSidebar.jsx  # Reusable sidebar component
└── Data/
    └── newsData.js       # Centralized news data
```

## How to Create a New News Article

1. **Create a new folder** with your article name (use kebab-case)
2. **Copy the structure** from the "Stronger Ties News" folder
3. **Update the article data** in `resources/js/Data/newsData.js`
4. **Add a route** in `routes/web.php`
5. **Update the content** in your `description.jsx` file

## Example: Creating "New Partnership" Article

1. Create folder: `resources/js/Pages/Individual News Pages/New Partnership/`
2. Copy `index.jsx` and `description.jsx` from existing article
3. Update `newsData.js`:
```javascript
{
    id: 6,
    title: "New Partnership Announcement",
    date: "March 20, 2025",
    image: "/images/MCC/IndivNews/new-partnership.jpg",
    slug: "new-partnership"
}
```
4. Add route in `routes/web.php`:
```php
Route::get('/news/new-partnership', function () {
    return Inertia::render('Individual News Pages/New Partnership/index');
})->name('news.new-partnership');
```
5. Update `index.jsx` with correct `currentSlug` prop:
```javascript
<NewsArticleSidebar currentSlug="new-partnership" />
```

## Features

- **Responsive Design**: Works on all screen sizes
- **Background Image**: Uses NewsBG.png from IndivNews folder
- **MainLayout Wrapper**: Includes navigation and footer
- **Reusable Sidebar**: Automatically shows related articles
- **SEO Friendly**: Proper meta tags and titles

## Image Requirements

- **Main Article Image**: Place in `/public/images/MCC/IndivNews/`
- **Background**: Uses `NewsBG.png` automatically
- **Recommended Size**: 1200x600px for main images
- **Format**: JPG, PNG, or WebP

## Sidebar Articles

The sidebar automatically displays related articles from `newsData.js`, excluding the current article. The sidebar is completely reusable across all news pages.

## Styling

- Uses Tailwind CSS for styling
- Dark theme with semi-transparent backgrounds
- Hover effects and transitions
- Mobile-first responsive design 