import { NextRequest, NextResponse } from 'next/server';
import { getMemories, addMemory, clearAllMemories } from '@/lib/db/storage';
import { MemoryCategory } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const memories = getMemories();
    return NextResponse.json({ memories });
  } catch (error) {
    console.error('GET /api/memories error:', error);
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      category = 'fact',
      content,
      importance = 3,
      tags = [],
    }: {
      category: MemoryCategory;
      content: string;
      importance: number;
      tags: string[];
    } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Memory content is required' }, { status: 400 });
    }

    const newMemory = addMemory({
      category,
      content: content.trim(),
      importance: Math.min(5, Math.max(1, Number(importance))),
      tags: Array.isArray(tags) ? tags : [],
    });

    return NextResponse.json({ memory: newMemory });
  } catch (error) {
    console.error('POST /api/memories error:', error);
    return NextResponse.json({ error: 'Failed to create memory' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    clearAllMemories();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/memories error:', error);
    return NextResponse.json({ error: 'Failed to clear memories' }, { status: 500 });
  }
}
