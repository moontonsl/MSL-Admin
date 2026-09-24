import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/news-articles');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-6 md:py-16">
        <div className="mb-6 md:mb-16 text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 font-montserrat">
            NEWS AND ARTICLES
          </h2>
        </div>
        <div className="w-full max-w-[1544px] grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 px-2 xs:px-4 md:px-0">
          {Array(12).fill(null).map((_, index) => (
            <div key={index} className="w-full h-40 md:h-64 bg-gray-800 rounded-2xl animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-6 md:py-16">
        <div className="mb-6 md:mb-16 text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 font-montserrat">
            NEWS AND ARTICLES
          </h2>
        </div>
        <div className="text-center text-white">
          <p className="text-lg mb-4">Error loading articles: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Fallback articles if no data is available
  const fallbackArticles = [
    {
      id: 1,
      title: "How MPL Smart Battle Trips Transformed My View of the Gaming Industry - Blog",
      author: "Nithaiah Kenshin Macaraig",
      date: "2025-03-18",
      image: "/images/MCC/News/News - Holder.jpg",
      link: "/news/mpls15-battletrips-experience"
    }
  ];

  const displayArticles = articles.length > 0 ? articles : fallbackArticles;

  return (
    <div className="flex flex-col items-center justify-center w-full py-1 md:py-16 -mt-6 md:mt-0">
      {/* Title Section */}
      <div className="mb-2 md:mb-16 text-center">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 md:mb-4 font-montserrat">
          NEWS AND ARTICLES
        </h2>
      </div>

      {/* Articles Grid */}
      <div className="w-full max-w-[1544px] grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 px-2 xs:px-4 md:px-0">
        {displayArticles.length > 0 ? (
          displayArticles.map((article) => (
            <Link
              key={article.id}
              href={article.link || `/news/${article.news_canonical || `article-${article.id}`}`}
              className="w-full h-40 md:h-64 bg-black rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 relative group"
            >
              {/* Background Image */}
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover absolute inset-0"
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/images/MCC/News/News - Holder.jpg';
                }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Text Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">

                {/* Title */}
                <h3 className="text-xs md:text-sm lg:text-base font-bold leading-tight mb-2 font-montserrat line-clamp-2">
                  {article.title}
                </h3>
                
                {/* Subtitle/Category */}
                {article.subtitle && (
                  <p className="text-[10px] md:text-xs lg:text-sm text-gray-400 font-montserrat mb-1 line-clamp-1">
                    {article.subtitle}
                  </p>
                )}
                
                {/* Author and Date */}
                <p className="text-[10px] md:text-xs lg:text-sm text-gray-300 font-montserrat">
                  {article.author} - {article.date}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-white py-8">
            <p className="text-lg">No news articles available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
