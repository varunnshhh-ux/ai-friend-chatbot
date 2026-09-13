'use client';

import React, { useState, useMemo } from 'react';
import { MemoryItem, MemoryCategory } from '@/types';
import {
  Brain,
  Plus,
  Trash2,
  Edit2,
  X,
  Star,
  Search,
  Sparkles,
  Tag,
  Check,
  AlertCircle,
} from 'lucide-react';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: MemoryItem[];
  onAddMemory: (memory: Omit<MemoryItem, 'id' | 'createdAt'>) => void;
  onUpdateMemory: (id: string, updates: Partial<MemoryItem>) => void;
  onDeleteMemory: (id: string) => void;
  onClearAll: () => void;
}

const CATEGORY_MAP: Record<MemoryCategory, { label: string; color: string }> = {
  fact: { label: 'Personal Fact', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  preference: { label: 'Preference', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  goal: { label: 'Goal / Ambition', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  interest: { label: 'Interest / Passion', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  relationship: { label: 'Relationship', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  habit: { label: 'Habit / Routine', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
};

export default function MemoryModal({
  isOpen,
  onClose,
  memories,
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
  onClearAll,
}: MemoryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for adding/editing
  const [contentInput, setContentInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<MemoryCategory>('fact');
  const [importanceInput, setImportanceInput] = useState(4);
  const [tagsInput, setTagsInput] = useState('');

  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      const matchCat = selectedCategory === 'all' || m.category === selectedCategory;
      const matchSearch =
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [memories, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const handleSaveNew = () => {
    if (!contentInput.trim()) return;
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    onAddMemory({
      content: contentInput.trim(),
      category: categoryInput,
      importance: importanceInput,
      tags,
    });

    setContentInput('');
    setTagsInput('');
    setIsAdding(false);
  };

  const handleSaveEdit = (id: string) => {
    if (!contentInput.trim()) return;
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    onUpdateMemory(id, {
      content: contentInput.trim(),
      category: categoryInput,
      importance: importanceInput,
      tags,
    });

    setEditingId(null);
    setContentInput('');
    setTagsInput('');
  };

  const startEdit = (m: MemoryItem) => {
    setEditingId(m.id);
    setContentInput(m.content);
    setCategoryInput(m.category);
    setImportanceInput(m.importance);
    setTagsInput(m.tags?.join(', ') || '');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-zinc-100 flex items-center gap-2">
                Personal Memory Hub
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-normal">
                  {memories.length} Memories
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                What Aura remembers about you to make every conversation more personal.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Category pills & Search */}
        <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/30 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search memories or tags..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-purple-500/50"
              />
            </div>

            <button
              onClick={() => {
                setIsAdding(!isAdding);
                setEditingId(null);
                setContentInput('');
                setTagsInput('');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Memory</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedCategory === 'all'
                  ? 'bg-zinc-100 text-zinc-950 font-medium'
                  : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({memories.length})
            </button>
            {(Object.keys(CATEGORY_MAP) as MemoryCategory[]).map((cat) => {
              const count = memories.filter((m) => m.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-purple-500/30 text-purple-200 border border-purple-500/40 font-medium'
                      : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {CATEGORY_MAP[cat].label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Add / Edit Form Panel */}
        {(isAdding || editingId) && (
          <div className="p-4 border-b border-purple-500/30 bg-purple-950/20 space-y-3 animate-slide-up">
            <div className="flex items-center justify-between text-xs font-semibold text-purple-300">
              <span>{editingId ? 'Edit Memory' : 'Add New Custom Memory'}</span>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className="text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <textarea
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              placeholder="E.g., Prefers learning through coding examples, preparing for full-stack engineer interviews..."
              rows={2}
              className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-purple-500"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Category</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value as MemoryCategory)}
                  className="w-full p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 outline-none"
                >
                  {(Object.keys(CATEGORY_MAP) as MemoryCategory[]).map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_MAP[cat].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Importance (1-5)</label>
                <div className="flex items-center gap-1 py-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setImportanceInput(star)}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= importanceInput
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="tech, preferences, study"
                  className="w-full p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 outline-none"
                >
                </input>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => (editingId ? handleSaveEdit(editingId) : handleSaveNew())}
                disabled={!contentInput.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Memory</span>
              </button>
            </div>
          </div>
        )}

        {/* Memories List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredMemories.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              <Brain className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
              No memories found. Start chatting or add a custom memory!
            </div>
          ) : (
            filteredMemories.map((mem) => {
              const catMeta = CATEGORY_MAP[mem.category] || CATEGORY_MAP.fact;
              return (
                <div
                  key={mem.id}
                  className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-purple-500/30 transition-all duration-200 flex flex-col justify-between gap-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${catMeta.color}`}
                      >
                        {catMeta.label}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: mem.importance }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 text-amber-400 fill-amber-400"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(mem)}
                        className="p-1 text-zinc-400 hover:text-white"
                        title="Edit memory"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteMemory(mem.id)}
                        className="p-1 text-zinc-400 hover:text-rose-400"
                        title="Delete memory"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-200 leading-relaxed">{mem.content}</p>

                  {mem.tags && mem.tags.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      {mem.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded flex items-center gap-0.5"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between text-xs text-zinc-500">
          <span>Aura prioritizes these memories when responding to you.</span>
          {memories.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-rose-400 hover:text-rose-300 text-xs hover:underline"
            >
              Clear all memories
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
