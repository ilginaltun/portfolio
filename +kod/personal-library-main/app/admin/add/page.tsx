'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useBooks } from '@/app/context/BookContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Book, BookStatus } from '@/app/types';
import { supabase } from '@/lib/supabaseClient';
import { ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';

const STATUS_OPTIONS: BookStatus[] = ['Currently Reading', 'Read', 'Want to Read', 'Discarded'];

function BookForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookId = searchParams.get('id');
    const { books, addBook, updateBook } = useBooks();

    const [formData, setFormData] = useState<Partial<Book>>({
        title: '',
        author: '',
        coverUrl: '',
        status: 'Want to Read',
        review: '',
        rating: 0,
        dateFinished: '',
        featuredInWrapUp: false,
    });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (bookId) {
            const existingBook = books.find((b) => b.id === bookId);
            if (existingBook) {
                setFormData(existingBook);
            }
        }
    }, [bookId, books]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('book-covers')
                .upload(filePath, file);

            if (uploadError) {
                console.error("Supabase Upload Error Details:", JSON.stringify(uploadError, null, 2));
                throw uploadError;
            }

            // Get Public URL
            const { data } = supabase.storage
                .from('book-covers')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, coverUrl: data.publicUrl }));
        } catch (error) {
            alert('Error uploading image!');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.author) {
            alert('Title and Author are required');
            return;
        }

        if (bookId) {
            updateBook(bookId, formData);
        } else {
            addBook(formData as Omit<Book, 'id'>);
        }
        router.push('/admin');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'rating') {
            setFormData(prev => ({ ...prev, [name]: Number(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin" className="p-2 hover:bg-muted rounded-full">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="text-3xl font-bold text-primary">
                    {bookId ? 'Edit Book' : 'Add New Book'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl border border-border">
                {/* Title & Author */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 rounded-md border border-input bg-background"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Author *</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="w-full p-2 rounded-md border border-input bg-background"
                            required
                        />
                    </div>
                </div>

                {/* Cover Upload */}
                <div className="space-y-4">
                    <label className="text-sm font-medium">Cover Image</label>
                    <div className="flex items-start gap-6">
                        {/* Preview */}
                        <div className="relative w-24 h-36 bg-muted rounded-lg overflow-hidden border border-border flex-shrink-0">
                            {formData.coverUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={formData.coverUrl}
                                    alt="Cover Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground text-center p-2">
                                    No Image
                                </div>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                        </div>

                        {/* Inputs */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                                <p className="text-xs text-muted-foreground mt-2">Max size: 5MB. Formats: JPG, PNG, WebP.</p>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">Or paste URL</span>
                                </div>
                            </div>

                            <input
                                type="url"
                                name="coverUrl"
                                value={formData.coverUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full p-2 rounded-md border border-input bg-background text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-2 rounded-md border border-input bg-background"
                        >
                            {STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Rating (0-5)</label>
                        <input
                            type="number"
                            name="rating"
                            min="0"
                            max="5"
                            step="0.5"
                            value={formData.rating || 0}
                            onChange={handleChange}
                            className="w-full p-2 rounded-md border border-input bg-background"
                        />
                    </div>
                </div>

                {/* Date Finished & Wrap Up */}
                {formData.status === 'Read' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date Finished</label>
                            <input
                                type="date"
                                name="dateFinished"
                                value={formData.dateFinished || ''}
                                onChange={handleChange}
                                className="w-full p-2 rounded-md border border-input bg-background"
                            />
                        </div>
                        <div className="flex items-center gap-3 pt-6">
                            <input
                                type="checkbox"
                                name="featuredInWrapUp"
                                id="featuredInWrapUp"
                                checked={formData.featuredInWrapUp || false}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300"
                            />
                            <label htmlFor="featuredInWrapUp" className="text-sm font-medium cursor-pointer">
                                Include in Monthly Wrap-up
                            </label>
                        </div>
                    </div>
                )}

                {/* Review */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Personal Review</label>
                    <textarea
                        name="review"
                        rows={4}
                        value={formData.review || ''}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md border border-input bg-background"
                        placeholder="Write your thoughts..."
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:brightness-110 flex items-center justify-center gap-2 transition-all mt-4"
                    disabled={uploading}
                >
                    <Save size={20} />
                    {bookId ? 'Update Book' : 'Save Book'}
                </button>
            </form>
        </div>
    );
}

export default function BookFormPage() {
    return (
        <Suspense fallback={<div>Loading form...</div>}>
            <BookForm />
        </Suspense>
    );
}
