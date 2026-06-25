'use client';

import React from 'react';
import { useBooks } from '@/app/context/BookContext';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Book } from '@/app/types';

export default function AdminPage() {
    const { books, deleteBook } = useBooks();

    const handleDelete = (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            deleteBook(id);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
                <Link
                    href="/admin/add"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:brightness-110 flex items-center gap-2 transition-all"
                >
                    <Plus size={20} />
                    Add New Book
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted text-muted-foreground uppercase tracking-wider font-semibold border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Author</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {books.map((book) => (
                                <tr key={book.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{book.title}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{book.author}</td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                                            book.status === 'Read' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                                                book.status === 'Currently Reading' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                                                    book.status === 'Want to Read' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100' :
                                                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                        )}>
                                            {book.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link
                                            href={`/admin/add?id=${book.id}`}
                                            className="inline-flex items-center p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(book.id, book.title)}
                                            className="inline-flex items-center p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {books.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                        No books in the library yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
