"use client";

import { useGroupStore, ChatGroup } from "@/store/useGroupStore";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";

export default function Dashboard() {
    const router = useRouter();
    // Chat Group State from Store
    const { 
        groups, 
        isLoading, 
        error, 
        fetchGroups, 
        createGroup, 
        updateGroup, 
        deleteGroup 
    } = useGroupStore();

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]); // Fetch on mount
    
    // User State from Store
    const { user, hydrate, logout: storeLogout } = useAuthStore();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    useEffect(() => {
        // Simple protection check
        const token = localStorage.getItem("token");
        if (!token) {
             router.push("/");
        }
    }, [router, user]); // Re-check if user changes (e.g. logout)

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<ChatGroup | null>(null);
    const [title, setTitle] = useState("");
    const [passcode, setPasscode] = useState("");

    const logout = () => {
        storeLogout();
        signOut({ callbackUrl: "/" });
    }

    const openCreateModal = () => {
        setEditingGroup(null);
        setTitle("");
        setPasscode("");
        setIsModalOpen(true);
    }

    const openEditModal = (e: React.MouseEvent, group: ChatGroup) => {
        e.preventDefault(); // Prevent Link navigation
        setEditingGroup(group);
        setTitle(group.title);
        setPasscode(group.passcode);
        setIsModalOpen(true);
    }

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Prevent Link navigation
        if (confirm("⚠️ Are you sure you want to delete this group?\n\nThis will PERMANENTLY delete:\n- The group itself\n- All messages inside it\n- All member associations\n\nThis action cannot be undone.")) {
            await deleteGroup(id);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (editingGroup) {
                await updateGroup(editingGroup.id, title, passcode);
            } else {
                await createGroup(title, passcode);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save group", error);
        }
    }

    if (isLoading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );
    
    if (error) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 text-red-500">
            Error loading chats. Please refresh.
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 text-slate-900 dark:text-gray-100 font-sans">
            
            {/* Navbar */}
            <nav className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                <div className="container mx-auto px-4 md:px-10 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
                            Q
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            QuickChat
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        {user && (
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user.name}</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Active</span>
                            </div>
                        )}
                        <button 
                            onClick={logout}
                            className="bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 transition-all text-sm font-medium"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 md:px-10 py-10">
                {/* Hero / Actions */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div>
                         <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">
                            Dashboard
                         </h2>
                         <p className="text-slate-500 dark:text-slate-400">
                            Join a conversation or start a new one. All groups are public.
                         </p>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 font-medium flex items-center gap-2"
                    >
                        <span>+</span> New Chat Group
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {groups?.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                            <p className="text-slate-500 mb-4 text-lg">No active conversations yet.</p>
                            <button onClick={openCreateModal} className="text-indigo-600 font-semibold hover:underline">
                                Create the first one!
                            </button>
                        </div>
                    )}
                    
                    {groups?.map((group) => (
                        <Link href={`/chat/${group.id}`} key={group.id} className="group relative">
                            <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 h-full flex flex-col justify-between group-hover:-translate-y-1">
                                
                                {/* Gradient Orb Decoration */}
                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {group.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
                                        <span className="bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md font-mono">
                                            {new Date(group.created_at).toLocaleDateString()}
                                        </span>
                                        <span>• Public Group</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                    <div className="flex -space-x-2">
                                        {/* Mock Avatars for Visuals */}
                                        {[1,2,3].map(i => (
                                            <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500`}>
                                                U{i}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                        Join →
                                    </span>
                                </div>

                                {/* Manage Buttons (Hover only) */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                                    <button 
                                        onClick={(e) => openEditModal(e, group)}
                                        className="p-2 bg-white/90 dark:bg-slate-700/90 text-amber-500 rounded-lg shadow-sm hover:bg-amber-50 dark:hover:bg-slate-600 transition-colors backdrop-blur-sm"
                                        title="Edit Group"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={(e) => handleDelete(e, group.id)}
                                        className="p-2 bg-white/90 dark:bg-slate-700/90 text-red-500 rounded-lg shadow-sm hover:bg-red-50 dark:hover:bg-slate-600 transition-colors backdrop-blur-sm"
                                        title="Delete Group"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/30 dark:bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-700 scale-100 animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
                            {editingGroup ? "Edit Settings" : "Start New Group"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Group Name</label>
                                <input 
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Weekend Trip"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Access Passcode</label>
                                <input 
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono" 
                                    value={passcode} 
                                    onChange={(e) => setPasscode(e.target.value)}
                                    placeholder="Secret123"
                                    required
                                />
                                <p className="text-xs text-slate-400 mt-2">Shared with friends to join.</p>
                            </div>
                            
                            <div className="flex gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 px-4 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Saving..." : (editingGroup ? "Save Changes" : "Create Group")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
