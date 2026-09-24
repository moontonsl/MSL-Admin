import React from 'react';

export function Card({ children, className = '' }) {
    return (
        <div className={`bg-white overflow-hidden shadow-sm sm:rounded-lg ${className}`}>
            {children}
        </div>
    );
}