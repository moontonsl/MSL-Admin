import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
const NewsSection = () => {

    const [articles, setArticles] = useState([]);
    // const articles = [
    //     {
    //         category: "Food",
    //         title: "Finger-Lickin' Chicken Wings That Will Leave You Craving More",
    //         author: "Lan",
    //         date: "April 26, 2025",
    //         image: "https://images.unsplash.com/photo-1624726175512-19b9baf9fbd1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //         size: "large",
    //     },
    //     {
    //         category: "Food",
    //         title: "This Cheesy Pepperoni Pizza Is Everything You’ve Been Dreaming Of",
    //         image: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //         size: "medium",
    //     },
    //     {
    //         category: "Breakfast",
    //         title: "Stacked with Flavor: The Ultimate Pancake Experience",
    //         image: "https://images.unsplash.com/photo-1628815756608-c8ac0cacf20b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //         size: "small",
    //     },
    //     {
    //         category: "Grilling",
    //         title: "Master the Grill: Juicy Kebabs and Fire-Roasted Veggies",
    //         image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //         size: "small",
    //     },
    // ];
    useEffect(() => {
        fetch('news-articles')
          .then(res => res.json())
          .then(data => {
            setArticles(data.slice(0, 4));
        });
      }, []);

    return (
        <section className={`pt-16 md:pt-24`}>
            <div className={`px-4 container mx-auto`}>
                <header className="text-center mb-6 md:mb-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                        NEWS & FEATURES
                    </h2>
                </header>


                <div className="lg:h-[80vh] grid grid-cols-1 lg:grid-cols-4 gap-4">

                    {articles.map((article, index) => {
                        // Assign sizes based on index: large, medium, small, small, small
                        const size = index === 0 ? "large" : index === 1 ? "medium" : "small";
                        
                        const baseStyles =
                            size === "large"
                                ? "lg:col-span-2 lg:row-span-1 2xl:col-span-2 2xl:row-span-2"
                                : size === "medium"
                                    ? "lg:col-span-2 row-span-1"
                                    : "lg:col-span-2 2xl:col-span-1";

                        return (
                            <Link
                                key={article.title}
                                href={article.link || `/news/${article.news_canonical || `article-${article.id || index}`}`}
                                className={`relative bg-black rounded-lg overflow-hidden ${baseStyles} h-64 md:h-80 lg:h-full group cursor-pointer transform transition duration-300 hover:scale-[1.02] hover:shadow-xl`}
                            >
                                <img src={`${article.image}`} alt={article.title}
                                     loading="lazy"
                                     className="w-full h-full object-cover absolute inset-0 opacity-80 transition-transform duration-300 transform group-hover:scale-105"/>
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-60"/>
                                <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                                <span
                                    className="bg-indigo-600 text-xs px-2 py-1 rounded uppercase font-semibold tracking-wide transition-colors duration-300 group-hover:bg-indigo-700">{article.category}</span>
                                    <h3 className="text-lg md:text-xl font-bold mt-2 leading-tight">{article.title}</h3>
                                    {article.author && (
                                        <p className="text-sm mt-1">{article.author} – {article.date}</p>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}

export default NewsSection;
