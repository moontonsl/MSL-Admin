import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const SecurePdfViewer = ({ url }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setLoading(false);
    }

    return (
        <div className="flex flex-col items-center w-full h-full bg-neutral-900 rounded-lg overflow-hidden">
            <div className="flex-1 w-full overflow-auto p-4 flex justify-center bg-neutral-900 custom-scrollbar relative">
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex items-center justify-center h-full text-white">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-2"></div>
                            Loading PDF...
                        </div>
                    }
                    error={
                        <div className="flex flex-col items-center justify-center h-full text-red-400 p-4 text-center">
                            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p>Failed to load PDF.</p>
                        </div>
                    }
                    className="flex flex-col items-center gap-4"
                >
                    {/* Render all pages or just the current one. For security/simplicity, let's render all pages in a column so user can scroll naturally. */}
                    {Array.from(new Array(numPages), (el, index) => (
                        <div key={`page_${index + 1}`} className="relative shadow-lg">
                            <Page
                                pageNumber={index + 1}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                width={Math.min(window.innerWidth * 0.8, 800)} // Responsive width
                                className="border border-neutral-700 rounded"
                            />
                            {/* Overlay to prevent right click/save on the canvas itself */}
                            <div
                                className="absolute inset-0 z-10"
                                onContextMenu={(e) => e.preventDefault()}
                            ></div>
                        </div>
                    ))}
                </Document>
            </div>
        </div>
    );
};

export default SecurePdfViewer;
