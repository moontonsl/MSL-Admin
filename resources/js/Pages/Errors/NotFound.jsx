import MainLayout from "@/Layouts/MainLayout.jsx";
import {Header} from "@/Components/index.js";

const PageNotFound = () => {
    return (
        <>
            <MainLayout>
                <main className="grid min-h-[100svh-56px] place-items-center">
                   <div className="mx-auto flex flex-col justify-center items-center bg-[--background-default-tertiary] rounded-xl p-20">
                       <div className="text-center">
                           <p className="text-base font-semibold">404</p>
                           <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">Coming Soon</h1>
                           <p className="mt-6 text-lg font-medium text-pretty opacity-50 sm:text-xl/8">Sorry, we couldn’t
                               find the page you’re looking for.</p>
                           <div className="mt-10 flex items-center justify-center gap-x-6">
                               <a href="/"
                                  className="rounded-md bg-[#f3c718] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#cda60b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go
                                   back home</a>
                           </div>
                       </div>
                   </div>
                </main>
            </MainLayout>
        </>
    );
}


export default PageNotFound;
