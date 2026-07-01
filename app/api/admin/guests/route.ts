// app/api/admin/guests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllGuests, deleteGuest } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

// GET /api/admin/guests — all guest data (protected)
export async function GET(req: NextRequest) {
  if (!(await isAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const guests = await getAllGuests();
    // Sort newest first
    const sorted = guests.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return NextResponse.json(sorted);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// DELETE /api/admin/guests?id=xxx — delete a guest (protected)
export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
  }

  try {
    await deleteGuest(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 });
  }
}
