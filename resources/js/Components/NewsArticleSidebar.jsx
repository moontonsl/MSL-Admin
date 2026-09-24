import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";

export default function NewsArticleSidebar({ currentSlug, limit = 3 }) {
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return original if invalid date
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        const fetchRelatedArticles = async () => {
            try {
                setLoading(true);
                
                const response = await fetch(`/news-related?exclude=${currentSlug}&limit=${limit}`);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Ensure data is always an array
                    const articles = Array.isArray(data) ? data : [];
                    setRelatedArticles(articles);
                } else {
                    setRelatedArticles([]);
                }
            } catch (error) {
                setRelatedArticles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedArticles();
    }, [currentSlug, limit]);

    if (loading) {
        return (
            <div className="self-stretch p-1">
                {/* Desktop Loading State */}
                <div className="hidden lg:flex flex-col gap-1 w-full">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="self-stretch p-1 inline-flex justify-start items-start gap-2 overflow-hidden rounded-lg bg-gray-900 bg-opacity-50">
                            <div className="rounded-[30px] flex justify-center items-center gap-2 overflow-hidden flex-shrink-0 relative">
                                <div className="w-80 h-64 bg-gray-700 rounded-[30px] relative overflow-hidden">
                                    <div className="shimmer-sweep absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full"></div>
                                </div>
                            </div>
                            <div className="flex-1 p-1 inline-flex flex-col justify-between items-start gap-2 overflow-hidden">
                                <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-1 overflow-hidden">
                                    <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                                </div>
                                <div className="self-stretch flex flex-col justify-end items-start gap-1 overflow-hidden mt-auto">
                                    <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Loading State */}
                <div className="lg:hidden w-full">
                    <div className="grid grid-cols-3 gap-2 pb-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-full p-1.5 bg-gray-900 bg-opacity-50 rounded-lg">
                                <div className="w-full mb-1.5 relative">
                                    <div className="w-full h-16 bg-gray-700 rounded-lg relative overflow-hidden">
                                        <div className="shimmer-sweep absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="h-3 bg-gray-700 rounded"></div>
                                    <div className="h-2 bg-gray-700 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Ensure relatedArticles is always an array
    if (!Array.isArray(relatedArticles) || relatedArticles.length === 0) {
        return (
            <div className="self-stretch p-1">
                <div className="text-center text-gray-400 py-8">
                    <p>No related articles found</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="self-stretch p-1">
            {/* Desktop Layout - Vertical Stack (image top, text below) */}
            <div className="hidden lg:flex flex-col gap-1 w-full">
                {relatedArticles.map((article) => (
                    <Link key={article.id} href={`/news/${article.slug}`}>
                        <div className="self-stretch p-1 cursor-pointer hover:bg-gray-900 hover:bg-opacity-50 transition-all duration-300 rounded-lg">
                            <div className="w-full flex flex-col gap-2">
                                <div className="rounded-[30px] flex justify-center items-center gap-2 overflow-hidden flex-shrink-0">
                                    <img 
                                        className="w-80 h-64 object-cover rounded-[30px]" 
                                        src={article.image}
                                        alt={article.title}
                                    />
                                </div>
                                <div className="p-1 flex flex-col justify-start items-start gap-2">
                                    <div className="self-stretch text-white text-lg font-bold font-['Montserrat'] leading-tight hover:text-blue-400 transition-colors">
                                        {article.title}
                                    </div>
                                    <div className="text-white text-base font-light font-['Montserrat'] leading-snug">
                                        {formatDate(article.date)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Mobile Layout - Responsive Grid */}
            <div className="lg:hidden w-full">
                <div className="grid grid-cols-3 gap-2 pb-4">
                    {relatedArticles.map((article) => (
                        <Link key={article.id} href={`/news/${article.slug}`}>
                            <div className="w-full p-1.5 bg-gray-900 bg-opacity-50 rounded-lg cursor-pointer hover:bg-opacity-70 transition-all duration-300">
                                <div className="w-full mb-1.5">
                                    <img 
                                        className="w-full h-16 object-cover rounded-lg" 
                                        src={article.image}
                                        alt={article.title}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="text-white text-[10px] font-bold font-['Montserrat'] leading-tight hover:text-blue-400 transition-colors line-clamp-2">
                                        {article.title}
                                    </div>
                                    <div className="text-white text-[8px] font-light font-['Montserrat'] leading-snug opacity-80">
                                        {formatDate(article.date)}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))} 
                </div>
            </div>
            
            {/* View More Button */}
            <div className="self-stretch flex justify-center mt-2 lg:mt-4">
                <Link href="/news">
                    <div className="w-64 h-14 p-1.5 bg-white/5 rounded-[57.71px] outline outline-[1.73px] outline-offset-[-1.73px] outline-white inline-flex justify-center items-center gap-1.5 overflow-hidden hover:bg-white/10 transition-all duration-300">
                        <div className="justify-start text-white text-lg font-bold font-['Space_Grotesk'] leading-relaxed">
                            View More Articles
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
} 