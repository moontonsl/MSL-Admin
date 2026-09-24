// News articles data for sidebar
export const newsArticles = [
    {
        id: 1,
        title: "How MPL Smart Battle Trips Transformed My View of the Gaming Industry - Blog",
        date: "March 18, 2025",
        image: "/images/MCC/IndivNews/image_1.jpg",
        slug: "mpl-smart-battle-trips"
    },
    {
        id: 2,
        title: "MSL Championship Series",
        date: "March 15, 2025",
        image: "/images/MCC/IndivNews/image_37.jpg",
        slug: "esports-revolution-philippines"
    },
    {
        id: 3,
        title: "Unforgettable Moments: Moonton Student Leaders Gather for 2023 Year-End Party",
        date: "December 30, 2023",
        image: "/images/MCC/IndivNews/image_5.JPG",
        slug: "mobile-legends-championship-series"
    },
    {
        id: 4,
        title: "University Gaming Partnerships: A New Era of Digital Education",
        date: "March 8, 2025",
        image: "/images/MCC/IndivNews/image_7.png",
        slug: "university-gaming-partnerships"
    },
    {
        id: 5,
        title: "Stronger Ties: Moonton Philippines, UMAK Seals Partnership",
        date: "December 17, 2024",
        image: "/images/MCC/IndivNews/image_3.jpg",
        slug: "stronger-ties-moonton-umak"
    }
];

// Function to get related articles (excluding current article)
export const getRelatedArticles = (currentSlug, limit = 3) => {
    return newsArticles
        .filter(article => article.slug !== currentSlug)
        .slice(0, limit);
};

// Function to get all articles
export const getAllArticles = () => {
    return newsArticles;
};

// Function to get article by slug
export const getArticleBySlug = (slug) => {
    return newsArticles.find(article => article.slug === slug);
}; 