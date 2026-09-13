import { NextRequest, NextResponse } from 'next/server';
import { getConversation, getMessages, saveConversation, deleteConversation } from '@/lib/db/storage';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conversation = getConversation(id);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    const messages = getMessages(id);
    return NextResponse.json({ conversation, messages });
  } catch (error) {
    console.error('GET /api/conversations/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conv = getConversation(id);
    if (!conv) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    const body = await req.json();
    const updated = {
      ...conv,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    saveConversation(updated);
    return NextResponse.json({ conversation: updated });
  } catch (error) {
    console.error('PATCH /api/conversations/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    deleteConversation(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/conversations/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }
}
