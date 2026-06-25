'use client';

import React from 'react';
import Image from 'next/image';
import { Book } from '@/app/types';
import { clsx } from 'clsx';
import { Star } from 'lucide-react';

interface BookCardProps {
    book: Book;
}

export default function BookCard({ book }: BookCardProps) {
    const statusColors = {
        'Read': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        'Currently Reading': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
        'Want to Read': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
        'Discarded': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        'All': '',
    };

    return (
        <div className="bg-card text-card-foreground rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow group">
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
                {book.coverUrl ? (
                    <Image
                        src={book.coverUrl}
                        alt={`Cover of ${book.title}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        No Cover
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <span className={clsx(
                        'px-2 py-1 text-xs font-medium rounded-full backdrop-blur-md',
                        statusColors[book.status] || 'bg-gray-100'
                    )}>
                        {book.status}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-bold text-lg leading-tight truncate" title={book.title}>
                    {book.title}
                </h3>
                <p className="text-muted-foreground text-sm mt-1 truncate">{book.author}</p>

                {book.rating && (
                    <div className="flex items-center gap-1 mt-2 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{book.rating}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
