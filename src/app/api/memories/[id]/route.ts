import { NextRequest, NextResponse } from 'next/server';
import { updateMemory, deleteMemory } from '@/lib/db/storage';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = updateMemory(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }
    return NextResponse.json({ memory: updated });
  } catch (error) {
    console.error('PATCH /api/memories/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update memory' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    deleteMemory(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/memories/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
  }
}
