import React from 'react';
import { Link } from '@inertiajs/react';

export default function Breadcrumb({ items }) {
  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <span key={idx}>
          {item.href ? (
            <Link href={item.href} className="hover:underline">{item.label}</Link>
          ) : (
            <span className="text-gray-800 font-semibold">{item.label}</span>
          )}
          {idx < items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  );
} 