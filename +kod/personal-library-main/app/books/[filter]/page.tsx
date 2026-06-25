'use client';

import React from 'react';
import { useBooks } from '@/app/context/BookContext';
import BookCard from '@/app/components/BookCard';
import SkeletonCard from '@/app/components/SkeletonCard';
import { BookStatus } from '@/app/types';
import { useParams, notFound } from 'next/navigation';

const FILTER_MAP: Record<string, BookStatus | 'All'> = {
    'all': 'All',
    'read': 'Read',
    'reading': 'Currently Reading',
    'discarded': 'Discarded',
    'want-to-read': 'Want to Read',
};

const TITLE_MAP: Record<string, string> = {
    'all': 'All Books',
    'read': 'Read Books',
    'reading': 'Currently Reading',
    'discarded': 'Discarded Books',
    'want-to-read': 'Want to Read',
};

export default function BookGalleryPage() {
    const params = useParams();
    const filterKey = params.filter as string;
    const statusFilter = FILTER_MAP[filterKey];

    if (!statusFilter) {
        notFound();
    }

    const { books, isLoading } = useBooks();

    const filteredBooks = books.filter((book) => {
        if (statusFilter === 'All') return true;
        return book.status === statusFilter;
    });

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">
                    {TITLE_MAP[filterKey] || 'Library'}
                </h1>
                <p className="text-muted-foreground">
                    {isLoading ? 'Loading...' : `Showing ${filteredBooks.length} book${filteredBooks.length !== 1 ? 's' : ''}`}
                </p>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : filteredBooks.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
                    <p className="text-xl text-muted-foreground">No books found in this category.</p>
                </div>
            )}
        </div>
    );
}
