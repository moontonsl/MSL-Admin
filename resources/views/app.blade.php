<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <!-- Google Tag Manager -->
        <script>
          (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
            var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s),
              dl = l != "dataLayer" ? "&l=" + l : "";
            j.async = true;
            j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
            f.parentNode.insertBefore(j, f);
          })(window, document, "script", "dataLayer", "GTM-5DT842NT");
        </script>
        <!-- End Google Tag Manager -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>MSL Philippines</title>
        
        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="apple-touch-icon" sizes="192x192" href="/android-chrome-192x192.png">
        <link rel="apple-touch-icon" sizes="512x512" href="/android-chrome-512x512.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
        
        @php
            $defaultDescription = 'Greetings, mighty Warrior of the Land Of Dawn! Welcome to the realm of MLBB PH Student Leaders. From different Universities and our love for the game, we lead, promote, and dedicate our time and effort to the betterment of the MLBB Community!';
            $defaultImage = 'https://www.moontonslph.org/MSL_LOGO.png';
            $isArticlePage = ($page['component'] ?? null) === 'News/Article';
            $articleTitle = $isArticlePage ? data_get($page, 'props.article.title') : null;
            $articleDescription = $isArticlePage
                ? (data_get($page, 'props.article.subtitle') ?: data_get($page, 'props.article.content'))
                : null;
            if ($articleDescription) {
                $articleDescription = \Illuminate\Support\Str::limit(strip_tags($articleDescription), 200);
            }
            $articleUrl = $isArticlePage ? data_get($page, 'props.article.absoluteUrl', url()->current()) : null;
            $articleImage = $isArticlePage ? data_get($page, 'props.article.absoluteImageUrl') : null;
        @endphp

        <!-- SEO Meta Tags -->
        <meta name="description" content="{{ $articleDescription ?? $defaultDescription }}" />
        <meta name="keywords" content="MSL Philippines, Mobile Legends, Student Leaders, Gaming, MLBB Community, eSports, Philippines Gaming" />
        <meta name="author" content="MSL Philippines" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="{{ $articleUrl ?? 'https://www.moontonslph.org/' }}" />
        
        <!-- Open Graph / Facebook -->
        @if($isArticlePage && $articleTitle)
            <meta property="og:type" content="article" />
            <meta property="og:site_name" content="MSL Philippines" />
            <meta property="og:title" content="{{ $articleTitle }}" />
            <meta property="og:description" content="{{ $articleDescription ?? $defaultDescription }}" />
            <meta property="og:url" content="{{ $articleUrl ?? url()->current() }}" />
            <meta property="og:image" content="{{ $articleImage ?? $defaultImage }}" />
            <meta property="og:image:secure_url" content="{{ $articleImage ?? $defaultImage }}" />
            <meta property="og:image:alt" content="{{ $articleTitle }}" />
            <meta property="og:locale" content="en_US" />
        @else
            {{-- Default meta tags for other pages --}}
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
        @endif
        @if(config('services.facebook.app_id'))
        <meta property="fb:app_id" content="{{ config('services.facebook.app_id') }}" />
        @endif
        
        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@moontonslph" />
        @if($isArticlePage && $articleTitle)
            <meta name="twitter:title" content="{{ $articleTitle }}" />
            <meta name="twitter:description" content="{{ $articleDescription ?? $defaultDescription }}" />
            <meta name="twitter:image" content="{{ $articleImage ?? $defaultImage }}" />
        @else
            <meta name="twitter:title" content="MSL Philippines" />
            <meta name="twitter:description" content="Greetings, mighty Warrior of the Land Of Dawn! Welcome to the realm of MLBB PH Student Leaders. From different Universities and our love for the game, we lead, promote, and dedicate our time and effort to the betterment of the MLBB Community!" />
            <meta name="twitter:image" content="https://www.moontonslph.org/MSL_LOGO.png" />
            <meta name="twitter:image:alt" content="MSL Philippines Logo" />
        @endif
        
        <!-- Structured Data (JSON-LD) for SEO -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MSL Philippines",
            "alternateName": "Mobile Legends Student Leaders Philippines",
            "url": "https://www.moontonslph.org",
            "logo": "https://www.moontonslph.org/MSL_LOGO.png",
            "description": "Greetings, mighty Warrior of the Land Of Dawn! Welcome to the realm of MLBB PH Student Leaders. From different Universities and our love for the game, we lead, promote, and dedicate our time and effort to the betterment of the MLBB Community!",
            "foundingDate": "2020",
            "areaServed": {
                "@type": "Country",
                "name": "Philippines"
            },
            "sameAs": [
                "https://www.facebook.com/moontonslph"
            ]
        }
        </script>
        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        <!-- Google Tag Manager (noscript) -->
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5DT842NT"
                  height="0" width="0" style="display:none;visibility:hidden"></iframe>
        </noscript>
        <!-- End Google Tag Manager (noscript) -->
        @inertia
    </body>
</html>
