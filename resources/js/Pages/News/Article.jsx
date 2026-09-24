import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";
import { Header, Footer } from "@/Components";
import NewsArticleSidebar from "@/Components/NewsArticleSidebar";

export default function NewsArticle({ article }) {

  // Force shimmer to show for at least 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      // Keep shimmer visible for at least 1 second
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <a
            href="/news"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Back to News
          </a>
        </div>
      </div>
    );
  }

  // Get absolute URLs for Open Graph
  const appUrl = window.location.origin;
  const articleUrl = article?.absoluteUrl || `${appUrl}/news/${article?.canonical || ''}`;
  const imageUrl = article?.absoluteImageUrl || (article?.image ? `${appUrl}${article.image}` : null);
  const description = article?.subtitle || article?.content?.substring(0, 200) || "News article";

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>{article?.title ?? "News"}</title>
        <meta name="description" content={description} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:title" content={article?.title ?? "News"} />
        <meta property="og:description" content={description} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta property="og:site_name" content="MSL" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={articleUrl} />
        <meta name="twitter:title" content={article?.title ?? "News"} />
        <meta name="twitter:description" content={description} />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      </Head>

      <div className="relative z-10">
        <Header />
      </div>

      <main className="flex-grow">
        <div
          className="min-h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/MCC/IndivNews/NewsBG.png')"
          }}
        >
          <div className="min-h-screen bg-black bg-opacity-80">
            <div className="container mx-auto px-2 py-4">
              <div className="flex flex-col lg:flex-row gap-4 max-w-full mx-auto">
                {/* Main Content */}
                <div className="flex-1 lg:w-2/3 px-2">
                  <div className="flex flex-col gap-8">
                    {/* Main Image */}
                    {/* Main Image / Carousel */}
                    {(() => {
                      const images = [article.image, article.image2, article.image3].filter(Boolean);

                      if (images.length === 0) return null;

                      if (images.length === 1) {
                        return (
                          <div className="w-full relative">
                            <img
                              src={images[0]}
                              alt={article.title}
                              className="w-full h-auto rounded-lg object-cover max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-none"
                            />
                          </div>
                        );
                      }

                      // Carousel Logic
                      const [currentIndex, setCurrentIndex] = React.useState(0);

                      const nextSlide = React.useCallback(() => {
                        setCurrentIndex((prev) => (prev + 1) % images.length);
                      }, [images.length]);

                      const prevSlide = () => {
                        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
                      };

                      // Auto-play
                      React.useEffect(() => {
                        const interval = setInterval(() => {
                          nextSlide();
                        }, 5000); // Change slide every 5 seconds

                        return () => clearInterval(interval);
                      }, [nextSlide]);

                      return (
                        <div className="w-full relative group">
                          <div className="relative overflow-hidden rounded-lg">
                            <img
                              src={images[currentIndex]}
                              alt={`${article.title} - Image ${currentIndex + 1}`}
                              className="w-full h-auto object-cover max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-none transition-opacity duration-500"
                            />

                            {/* Navigation Buttons */}
                            <button
                              onClick={prevSlide}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Previous image"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>

                            <button
                              onClick={nextSlide}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Next image"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>

                            {/* Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                              {images.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentIndex(idx)}
                                  className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                                    }`}
                                  aria-label={`Go to image ${idx + 1}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Fallback shimmer when no image */}
                    {!article.image && (
                      <div className="w-full relative">
                        <div className="w-full h-64 bg-gray-700 rounded-lg overflow-hidden">
                          {/* Debug info */}
                          <div className="absolute top-2 left-2 text-white text-xs z-20 bg-black bg-opacity-50 px-2 py-1 rounded">
                            No image - Shimmer effect still visible
                          </div>

                          {/* Use the same working shimmer as sidebar */}
                          <div
                            className="absolute inset-0 w-full h-full shimmer-sweep"
                            style={{
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                              backgroundSize: '200% 100%'
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Article Content */}
                    <div className="flex flex-col gap-6">
                      {/* Title */}
                      <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight font-montserrat">
                        {article.title}
                      </h1>

                      {/* Subtitle */}
                      {article.subtitle && (
                        <p className="text-sm md:text-base lg:text-xl text-gray-300 leading-relaxed font-montserrat">
                          {article.subtitle}
                        </p>
                      )}

                      {/* Author and Date */}
                      <p className="text-xs md:text-sm lg:text-base text-gray-400 italic font-montserrat">
                        By {article.author} • {article.date}
                      </p>

                      {/* Article Body */}
                      {article.content && (
                        <div className="whitespace-pre-line text-xs md:text-sm lg:text-lg text-gray-200 leading-relaxed space-y-4 font-montserrat">
                          {article.content}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:w-1/3 px-1">
                  <NewsArticleSidebar currentSlug={article.canonical} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
