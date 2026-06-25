'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, BookStatus } from '@/app/types';
import { supabase } from '@/lib/supabaseClient';

interface BookContextType {
    books: Book[];
    isLoading: boolean;
    addBook: (book: Omit<Book, 'id'>) => Promise<void>;
    updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
    deleteBook: (id: string) => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: React.ReactNode }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBooks = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching books:', error);
        } else {
            // Map DB columns to our Typescript interface
            const mappedBooks: Book[] = (data || []).map((b: any) => ({
                id: b.id,
                title: b.title,
                author: b.author,
                coverUrl: b.cover_url || b.coverUrl,
                status: b.status,
                review: b.review,
                rating: b.rating,
                dateFinished: b.date_finished || b.dateFinished,
                featuredInWrapUp: b.featured_in_wrap_up || b.featuredInWrapUp
            }));
            setBooks(mappedBooks);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const addBook = async (bookData: Omit<Book, 'id'>) => {
        const dbPayload = {
            title: bookData.title,
            author: bookData.author,
            cover_url: bookData.coverUrl,
            status: bookData.status,
            review: bookData.review,
            rating: bookData.rating,
            date_finished: bookData.dateFinished || null,
            featured_in_wrap_up: bookData.featuredInWrapUp
        };

        const { data, error } = await supabase
            .from('books')
            .insert([dbPayload])
            .select()
            .single();

        if (error) {
            console.error('Error adding book:', JSON.stringify(error, null, 2));
            console.log('Payload attempted:', dbPayload);
            alert('Failed to add book');
        } else if (data) {
            const newBook: Book = {
                id: data.id,
                title: data.title,
                author: data.author,
                coverUrl: data.cover_url,
                status: data.status,
                review: data.review,
                rating: data.rating,
                dateFinished: data.date_finished,
                featuredInWrapUp: data.featured_in_wrap_up
            };
            setBooks((prev) => [newBook, ...prev]);
        }
    };

    const updateBook = async (id: string, updates: Partial<Book>) => {
        const dbPayload: any = { ...updates };
        if (updates.coverUrl) { dbPayload.cover_url = updates.coverUrl; delete dbPayload.coverUrl; }
        if (updates.dateFinished) { dbPayload.date_finished = updates.dateFinished; delete dbPayload.dateFinished; }
        if (updates.featuredInWrapUp !== undefined) { dbPayload.featured_in_wrap_up = updates.featuredInWrapUp; delete dbPayload.featuredInWrapUp; }

        const { error } = await supabase
            .from('books')
            .update(dbPayload)
            .eq('id', id);

        if (error) {
            console.error('Error updating book:', error);
            alert('Failed to update book');
        } else {
            setBooks((prev) =>
                prev.map((book) => (book.id === id ? { ...book, ...updates } : book))
            );
        }
    };

    const deleteBook = async (id: string) => {
        const { error } = await supabase
            .from('books')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting book:', error);
            alert('Failed to delete book');
        } else {
            setBooks((prev) => prev.filter((book) => book.id !== id));
        }
    };

    return (
        <BookContext.Provider value={{ books, isLoading, addBook, updateBook, deleteBook }}>
            {children}
        </BookContext.Provider>
    );
}

export function useBooks() {
    const context = useContext(BookContext);
    if (context === undefined) {
        throw new Error('useBooks must be used within a BookProvider');
    }
    return context;
}
