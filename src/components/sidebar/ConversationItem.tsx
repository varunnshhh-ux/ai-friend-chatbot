'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Conversation } from '@/types';
import { MOOD_META, PERSONA_META } from '@/lib/utils';
import {
  MessageSquare,
  Pin,
  Edit2,
  Trash2,
  MoreVertical,
  Check,
  X,
} from 'lucide-react';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onRename: (id: string, newTitle: string) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
  onDelete: (id: string) => void;
}

export default function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onRename,
  onTogglePin,
  onDelete,
}: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(conversation.title);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveRename = () => {
    if (titleInput.trim()) {
      onRename(conversation.id, titleInput.trim());
    }
    setIsEditing(false);
  };

  const personaMeta = PERSONA_META[conversation.persona] || PERSONA_META.friend;
  const moodMeta = conversation.lastMood ? MOOD_META[conversation.lastMood] : null;

  return (
    <div
      className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
        isActive
          ? 'bg-zinc-800/90 text-white font-medium shadow-sm border border-zinc-700/60'
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60'
      }`}
      onClick={() => {
        if (!isEditing) onSelect();
      }}
    >
      {/* Left Icon & Title */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span className="text-sm shrink-0" title={personaMeta.name}>
          {personaMeta.emoji}
        </span>

        {isEditing ? (
          <div className="flex items-center gap-1 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveRename();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              className="w-full bg-zinc-950 px-2 py-1 rounded border border-indigo-500 text-xs text-zinc-100 outline-none"
            />
            <button
              onClick={handleSaveRename}
              className="p-1 text-emerald-400 hover:text-emerald-300"
              title="Save"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1 text-zinc-400 hover:text-zinc-200"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              {conversation.isPinned && (
                <Pin className="w-3 h-3 text-indigo-400 shrink-0 fill-current" />
              )}
              <span className="truncate block">{conversation.title}</span>
            </div>
            {moodMeta && (
              <span className="text-[10px] text-zinc-500 block truncate mt-0.5">
                {moodMeta.emoji} {moodMeta.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right Action Menu */}
      {!isEditing && (
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-lg text-zinc-500 hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-full mt-1 w-36 rounded-xl glass-dropdown shadow-2xl p-1 z-40 border border-zinc-700/80 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  onTogglePin(conversation.id, !conversation.isPinned);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <Pin className="w-3.5 h-3.5 text-indigo-400" />
                <span>{conversation.isPinned ? 'Unpin' : 'Pin to top'}</span>
              </button>

              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Rename</span>
              </button>

              <button
                onClick={() => {
                  onDelete(conversation.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
