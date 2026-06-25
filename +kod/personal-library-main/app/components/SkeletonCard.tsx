import React from 'react';

export default function SkeletonCard() {
    return (
        <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-border">
            {/* Cover Placeholder */}
            <div className="aspect-[2/3] w-full bg-muted animate-pulse" />

            <div className="p-4 space-y-3">
                {/* Title Placeholder */}
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                {/* Author Placeholder */}
                <div className="h-3 bg-muted animate-pulse rounded w-1/2" />

                {/* Rating Placeholder */}
                <div className="h-3 bg-muted animate-pulse rounded w-1/4 mt-2" />
            </div>
        </div>
    );
}
