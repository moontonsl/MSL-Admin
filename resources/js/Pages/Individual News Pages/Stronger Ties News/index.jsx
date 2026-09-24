import React from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "../../../Layouts/MainLayout";
import MCCNewsIndividualPageColumnDescription from "./description";
import NewsArticleSidebar from "../../../Components/NewsArticleSidebar";

export default function StrongerTiesNewsIndex() {
    // Get absolute URLs for Open Graph
    const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const articleUrl = `${appUrl}/news/stronger-ties-moonton-umak`;
    const imageUrl = `${appUrl}/images/MCC/IndivNews/image_3.jpg`;
    const title = "Stronger Ties: Moonton Philippines, UMAK Seals Partnership";
    const description = "Renewed and empowered – linkage has been created as University of Makati (UMaK) and Moonton Philippines Technologies, Inc. ties close connection, pursuant to knowledge acquisition and innovation of industry-university endeavors.";

    return (
        <MainLayout>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={articleUrl} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={imageUrl} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:site_name" content="MSL" />
                
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={articleUrl} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={imageUrl} />
            </Head>
            
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
                                <MCCNewsIndividualPageColumnDescription />
                            </div>
                            
                            {/* Sidebar */}
                            <div className="lg:w-1/3 px-1">
                                <NewsArticleSidebar currentSlug="stronger-ties-moonton-umak" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
