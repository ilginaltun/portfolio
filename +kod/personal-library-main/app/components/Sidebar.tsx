'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, BookOpen, Book, Trash2, Library, LayoutDashboard, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/app/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { LogIn, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { user } = useAuth();
    const router = useRouter();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    const navItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'All Books', href: '/books/all', icon: Library },
        { name: 'Read', href: '/books/read', icon: BookOpen },
        { name: 'Currently Reading', href: '/books/reading', icon: Book },
        { name: 'Discarded', href: '/books/discarded', icon: Trash2 },
    ];

    // Only show Admin if logged in
    if (user) {
        navItems.push({ name: 'Admin', href: '/admin', icon: Settings });
    }

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-md shadow-md"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar Container */}
            <aside
                className={clsx(
                    'fixed top-0 left-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col',
                    isOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0 lg:w-20'
                )}
            >
                <div className="flex items-center justify-between p-4 border-b border-border h-16">
                    {isOpen && <h1 className="text-xl font-bold text-primary truncate">My Library</h1>}
                    <button
                        onClick={toggleSidebar}
                        className="hidden lg:block p-1 rounded hover:bg-muted"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2 px-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                            const Icon = item.icon;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={clsx(
                                            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group',
                                            isActive
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-foreground hover:bg-muted'
                                        )}
                                        title={!isOpen ? item.name : undefined}
                                    >
                                        <Icon className={clsx("w-5 h-5 min-w-[20px]", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                        {isOpen && <span className="truncate">{item.name}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-border flex flex-col gap-4">
                    {/* Auth Button */}
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5 min-w-[20px]" />
                            {isOpen && <span className="truncate">Logout</span>}
                        </button>
                    ) : (
                        <Link
                            href="/admin/login"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
                            title="Login"
                        >
                            <LogIn className="w-5 h-5 min-w-[20px]" />
                            {isOpen && <span className="truncate">Admin Login</span>}
                        </Link>
                    )}

                    <div className={clsx("flex items-center mt-2", isOpen ? "justify-between" : "justify-center")}>
                        {isOpen && <span className="text-sm font-medium">Theme</span>}
                        <ThemeToggle />
                    </div>
                </div>
            </aside>
        </>
    );
}
