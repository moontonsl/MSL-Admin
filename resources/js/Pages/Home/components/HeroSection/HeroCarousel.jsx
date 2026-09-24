// Components/HeroCarousel.tsx
import React, { useState, useEffect } from 'react';
import styles from "./HeroSection.module.scss";
import EmblaCarousel from "@/Components/EmblaCarousel/EmblaCarousel.jsx";

const HeroCarousel = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCarouselImages = async () => {
            try {
                const response = await fetch('/api/carousel-images');
                if (response.ok) {
                    const data = await response.json();
                    setSlides(data.map(item => item.image));
                } else {
                    // Fallback to static images if API fails
                    setSlides([
                        "/storage/carousel/C1.jpg",
                        "/storage/carousel/C2.jpg",
                        "/storage/carousel/C3.jpg",
                    ]);
                }
            } catch (error) {
                console.error('Error fetching carousel images:', error);
                // Fallback to static images
                setSlides([
                    "/storage/carousel/C1.jpg",
                    "/storage/carousel/C2.jpg",
                    "/storage/carousel/C3.jpg",
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchCarouselImages();
    }, []);

    const OPTIONS = { loop: true };

    if (loading) {
        return (
            <div className="w-full h-64 bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (slides.length === 0) {
        return (
            <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">No carousel images available</p>
            </div>
        );
    }

    return <EmblaCarousel slides={slides} options={OPTIONS} />;
};

export default HeroCarousel;
