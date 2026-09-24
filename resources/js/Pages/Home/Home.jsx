import HeroSection from './components/HeroSection/HeroSection.jsx';
import ExperienceSection from './components/ExperienceSection.jsx';
import InfoSection from './components/InfoSection.jsx';
import NewsSection from './components/NewsSection.jsx';
import NetworkSection from './components/NetworkSection.jsx';
import MainLayout from '@/Layouts/MainLayout.jsx';
import { Head, Link } from '@inertiajs/react';

const Home = () => {
    return (
        <MainLayout>
            <Head>
                <title>MSL Philippines</title>
                <meta name="description" content="Greetings, mighty Warrior of the Land Of Dawn! Welcome to the realm of MLBB PH Student Leaders. From different Universities and our love for the game, we lead, promote, and dedicate our time and effort to the betterment of the MLBB Community!" />
                <meta name="keywords" content="MSL Philippines, Mobile Legends, Student Leaders, Gaming, MLBB Community, eSports, Philippines Gaming" />
                <meta name="author" content="MSL Philippines" />
                <link rel="canonical" href="https://www.moontonslph.org/" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="MSL Philippines" />
                <meta property="og:title" content="MSL Philippines" />
                <meta property="og:description" content="Greetings, mighty Warrior of the Land Of Dawn! Welcome to the realm of MLBB PH Student Leaders. From different Universities and our love for the game, we lead, promote, and dedicate our time and effort to the betterment of the MLBB Community!" />
                <meta property="og:url" content="https://www.moontonslph.org/" />
                <meta property="og:image" content="https://www.moontonslph.org/MSL_LOGO.png" />
                <meta property="og:image:secure_url" content="https://www.moontonslph.org/MSL_LOGO.png" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="512" />
                <meta property="og:image:height" content="512" />
                <meta property="og:image:alt" content="MSL Philippines Logo" />
                <meta property="og:locale" content="en_US" />
                
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@moontonslph" />
                <meta name="twitter:title" content="MSL Philippines - Mobile Legends Student Leaders" />
                <meta name="twitter:description" content="Greetings, mighty Warrior of the Land Of Dawn! Welcome to the realm of MLBB PH Student Leaders. From different Universities and our love for the game, we lead, promote, and dedicate our time and effort to the betterment of the MLBB Community!" />
                <meta name="twitter:image" content="https://www.moontonslph.org/MSL_LOGO.png" />
                <meta name="twitter:image:alt" content="MSL Philippines Logo" />
            </Head>
            <div className={`pb-16`}>
                <HeroSection />
                <InfoSection />
                <NetworkSection />
                <ExperienceSection />
                <NewsSection />
            </div>
        </MainLayout>
    );
};

export default Home;
