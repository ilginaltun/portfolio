'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { LogOut, LayoutDashboard, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setIsAuthenticated(true);
                // If on login page and authenticated, go to dashboard
                if (pathname === '/admin/login') {
                    router.push('/admin');
                }
            } else {
                setIsAuthenticated(false);
                // If not authenticated and NOT on login page, go to login
                if (pathname !== '/admin/login') {
                    router.push('/admin/login');
                }
            }
            setIsLoading(false);
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                setIsAuthenticated(true);
                if (pathname === '/admin/login') {
                    router.push('/admin');
                }
            } else {
                setIsAuthenticated(false);
                if (pathname !== '/admin/login') {
                    router.push('/admin/login');
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [pathname, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // If not authenticated, we only show children if it's the login page
    if (!isAuthenticated && pathname !== '/admin/login') {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {isAuthenticated && (
                <div className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex gap-6 items-center">
                                <Link href="/admin" className="flex items-center gap-2 text-lg font-bold text-primary hover:opacity-80 transition-opacity">
                                    <LayoutDashboard size={20} />
                                    <span>Dashboard</span>
                                </Link>
                                <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    <Eye size={16} />
                                    <span>View Site</span>
                                </Link>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-muted-foreground hidden sm:inline-block">
                                    Logged in
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md transition-colors"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <main className="py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
