import { NextRequest, NextResponse } from 'next/server';
import { getConversations, saveConversation, clearAllConversations } from '@/lib/db/storage';
import { Conversation } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const conversations = getConversations();
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('GET /api/conversations error:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newConv: Conversation = {
      id: body.id || `conv-${Date.now()}`,
      title: body.title || 'New Conversation',
      persona: body.persona || 'friend',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
      messageCount: 0,
    };
    saveConversation(newConv);
    return NextResponse.json({ conversation: newConv });
  } catch (error) {
    console.error('POST /api/conversations error:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    clearAllConversations();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/conversations error:', error);
    return NextResponse.json({ error: 'Failed to clear conversations' }, { status: 500 });
  }
}
