'use client';

import React from 'react';
import { useBooks } from '@/app/context/BookContext';
import BookCard from '@/app/components/BookCard';
import SkeletonCard from '@/app/components/SkeletonCard';
import { Star } from 'lucide-react';

export default function Home() {
  const { books, isLoading } = useBooks();

  // Derived state
  const currentRead = books.find(b => b.status === 'Currently Reading');

  // Logic: Show books marked for "Wrap Up" first. If none, show just regular recent reads.
  const finishedBooks = books
    .filter(b => b.status === 'Read')
    .sort((a, b) => {
      // Sort featured first
      if (a.featuredInWrapUp && !b.featuredInWrapUp) return -1;
      if (!a.featuredInWrapUp && b.featuredInWrapUp) return 1;

      // Then by date finished (descending) if available
      if (a.dateFinished && b.dateFinished) {
        return new Date(b.dateFinished).getTime() - new Date(a.dateFinished).getTime();
      }
      return 0;
    })
    .slice(0, 4);

  const reviews = books.filter(b => b.review).slice(0, 3);

  if (isLoading) {
    return (
      <div className="space-y-12 max-w-7xl mx-auto">
        <section>
          <div className="h-10 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-5 w-64 bg-muted animate-pulse rounded" />
        </section>
        <section className="bg-muted/30 p-8 rounded-2xl border border-border">
          <div className="h-8 w-40 bg-muted animate-pulse rounded mb-6" />
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-48 flex-shrink-0">
              <SkeletonCard />
            </div>
          </div>
        </section>
        <section>
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Introduction */}
      <section>
        <h1 className="text-4xl font-bold mb-2 text-primary">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your personal library.</p>
      </section>

      {/* Current Read Section */}
      <section className="bg-muted/30 p-8 rounded-2xl border border-border">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>📖</span> Current Read
        </h2>
        {currentRead ? (
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-48 flex-shrink-0">
              <BookCard book={currentRead} />
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-3xl font-bold">{currentRead.title}</h3>
              <p className="text-xl text-muted-foreground">by {currentRead.author}</p>
              <div className="prose dark:prose-invert max-w-none">
                <p>You are currently reading this book. Keep going!</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border text-muted-foreground">
            <p>No book currently selected. Go to the library to pick one!</p>
          </div>
        )}
      </section>

      {/* Last Month's Wrap-up */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Reads & Wrap-Up</h2>
        </div>

        {finishedBooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {finishedBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No books finished recently.</p>
        )}
      </section>

      {/* Book Reviews Feed */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Recent Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(book => (
            <div key={book.id} className="bg-card p-6 rounded-xl border border-border space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold truncate">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
                {book.rating && (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{book.rating}</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-4 italic">
                "{book.review}"
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
