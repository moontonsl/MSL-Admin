import React from "react";
import { Head } from "@inertiajs/react";
import { Header, Footer } from "@/Components";
import Highlights from "./Highlights";
import Articles from "./Articles";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-Background-Default-Default">
      <Head>
        <title>Mobile Legends: Bang Bang Campus Championship - News</title>
        <meta name="description" content="Latest news and updates about the Mobile Legends Campus Championship" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="relative z-10">
        <Header />
      </div>

      <main className="flex-grow">
        <div className="w-full min-h-screen bg-black"
          style={{
            backgroundImage: "url('/images/MCC/News/VoteBG.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
          }}
        >
          <div className="max-w-[1900px] mx-auto px-4 md:px-12">
            <section className="py-1 md:py-10">
              <Highlights />
            </section>
            <section>
              <Articles />
            </section>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
