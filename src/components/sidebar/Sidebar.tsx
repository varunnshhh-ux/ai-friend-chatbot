'use client';

import React, { useState, useMemo } from 'react';
import { Conversation, PersonaMode } from '@/types';
import ConversationItem from './ConversationItem';
import SearchBar from './SearchBar';
import ThemeToggle from '../common/ThemeToggle';
import {
  Plus,
  Brain,
  PhoneCall,
  Sparkles,
  Trash2,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Heart,
  Music,
} from 'lucide-react';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: (persona?: PersonaMode) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
  onDeleteConversation: (id: string) => void;
  onClearAll: () => void;
  onOpenMemoryModal: () => void;
  onOpenVoiceCall: () => void;
  memoryCount: number;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export default function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onTogglePin,
  onDeleteConversation,
  onClearAll,
  onOpenMemoryModal,
  onOpenVoiceCall,
  memoryCount,
  isOpen,
  onToggleOpen,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Group conversations chronologically
  const grouped = useMemo(() => {
    const filtered = conversations.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pinned: Conversation[] = [];
    const today: Conversation[] = [];
    const yesterday: Conversation[] = [];
    const last7Days: Conversation[] = [];
    const older: Conversation[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const last7DaysStart = todayStart - 86400000 * 7;

    filtered.forEach((conv) => {
      if (conv.isPinned) {
        pinned.push(conv);
        return;
      }
      const time = new Date(conv.updatedAt || conv.createdAt).getTime();
      if (time >= todayStart) {
        today.push(conv);
      } else if (time >= yesterdayStart) {
        yesterday.push(conv);
      } else if (time >= last7DaysStart) {
        last7Days.push(conv);
      } else {
        older.push(conv);
      }
    });

    return { pinned, today, yesterday, last7Days, older };
  }, [conversations, searchQuery]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggleOpen}
        />
      )}

      {/* Main Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-zinc-950/95 dark:bg-zinc-950/95 border-r border-zinc-800/80 backdrop-blur-2xl flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-sm text-zinc-100 tracking-tight">
                Aura AI
              </h1>
              <p className="text-[10px] text-zinc-400 font-medium">Your Personal Companion</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={onToggleOpen}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 lg:hidden"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="p-3 space-y-2">
          {/* New Chat Button */}
          <button
            onClick={() => onNewChat('friend')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all duration-200 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>

          {/* Quick Access Grid: Memory Hub & Voice Call */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenMemoryModal}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 text-xs font-medium transition-all duration-200"
              title="Personal Memory Hub"
            >
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span>Memories ({memoryCount})</span>
            </button>

            <button
              onClick={onOpenVoiceCall}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 text-xs font-medium transition-all duration-200"
              title="Start Voice Companion Call"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Voice Call</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="pt-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {/* Pinned */}
          {grouped.pinned.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider px-2 block">
                Pinned
              </span>
              {grouped.pinned.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeConversationId}
                  onSelect={() => onSelectConversation(conv.id)}
                  onRename={onRenameConversation}
                  onTogglePin={onTogglePin}
                  onDelete={onDeleteConversation}
                />
              ))}
            </div>
          )}

          {/* Today */}
          {grouped.today.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-2 block">
                Today
              </span>
              {grouped.today.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeConversationId}
                  onSelect={() => onSelectConversation(conv.id)}
                  onRename={onRenameConversation}
                  onTogglePin={onTogglePin}
                  onDelete={onDeleteConversation}
                />
              ))}
            </div>
          )}

          {/* Yesterday */}
          {grouped.yesterday.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-2 block">
                Yesterday
              </span>
              {grouped.yesterday.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeConversationId}
                  onSelect={() => onSelectConversation(conv.id)}
                  onRename={onRenameConversation}
                  onTogglePin={onTogglePin}
                  onDelete={onDeleteConversation}
                />
              ))}
            </div>
          )}

          {/* Previous 7 Days */}
          {grouped.last7Days.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-2 block">
                Previous 7 Days
              </span>
              {grouped.last7Days.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeConversationId}
                  onSelect={() => onSelectConversation(conv.id)}
                  onRename={onRenameConversation}
                  onTogglePin={onTogglePin}
                  onDelete={onDeleteConversation}
                />
              ))}
            </div>
          )}

          {/* Older */}
          {grouped.older.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-2 block">
                Older
              </span>
              {grouped.older.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeConversationId}
                  onSelect={() => onSelectConversation(conv.id)}
                  onRename={onRenameConversation}
                  onTogglePin={onTogglePin}
                  onDelete={onDeleteConversation}
                />
              ))}
            </div>
          )}

          {conversations.length === 0 && (
            <div className="text-center py-8 px-4 text-zinc-500 text-xs">
              No conversations yet. Start a new chat with Aura!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>AI Friend & Guide</span>
          </div>

          {conversations.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
              title="Clear all chat history"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
