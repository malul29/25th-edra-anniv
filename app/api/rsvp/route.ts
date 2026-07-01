// app/api/rsvp/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getAllGuests, addGuest, Guest } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// GET /api/rsvp — public, returns only name + message + timestamp
export async function GET() {
  try {
    const guests = await getAllGuests();
    const publicData = guests.map(g => ({
      id: g.id,
      name: g.name,
      message: g.message,
      timestamp: g.timestamp,
    }));
    return NextResponse.json(publicData);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// POST /api/rsvp — submit RSVP
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, attendance, companions, message } = body;

    if (!name || !phone || !attendance) {
      return NextResponse.json({ error: 'Field wajib tidak lengkap' }, { status: 400 });
    }

    if (!['hadir', 'tidak'].includes(attendance)) {
      return NextResponse.json({ error: 'Nilai kehadiran tidak valid' }, { status: 400 });
    }

    const guest: Guest = {
      id: uuidv4(),
      name: String(name).trim(),
      phone: String(phone).trim(),
      attendance,
      companions: attendance === 'hadir' ? parseInt(String(companions)) || 0 : 0,
      message: String(message ?? '').trim(),
      timestamp: new Date().toISOString(),
    };

    await addGuest(guest);
    return NextResponse.json({ success: true, id: guest.id }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 });
  }
}
