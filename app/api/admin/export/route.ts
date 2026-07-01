// app/api/admin/export/route.ts
// Export data tamu ke CSV, Excel, atau JSON
import { NextRequest, NextResponse } from 'next/server';
import { getAllGuests } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import * as XLSX from 'xlsx';

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const format = req.nextUrl.searchParams.get('format') ?? 'csv';
  const guests = await getAllGuests();
  const sorted = guests.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const date = new Date().toISOString().slice(0, 10);
  const filename = `Rekap_Tamu_Edra_Anniv_${date}`;

  if (format === 'csv') {
    const headers = ['Waktu', 'Nama', 'Telepon', 'Kehadiran', 'Jumlah Pendamping', 'Ucapan'];
    const rows = sorted.map(g => [
      new Date(g.timestamp).toLocaleString('id-ID'),
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.phone}"`,
      g.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir',
      String(g.companions),
      `"${(g.message || '').replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const BOM = '\uFEFF'; // UTF-8 BOM for Excel compatibility

    return new Response(BOM + csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.csv"`,
      },
    });
  }

  if (format === 'excel') {
    const data = sorted.map(g => ({
      Waktu: new Date(g.timestamp).toLocaleString('id-ID'),
      Nama: g.name,
      Telepon: g.phone,
      Kehadiran: g.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir',
      'Jumlah Pendamping': g.companions,
      Ucapan: g.message || '',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Tamu');

    // Style column widths
    ws['!cols'] = [
      { wch: 22 }, // Waktu
      { wch: 28 }, // Nama
      { wch: 18 }, // Telepon
      { wch: 14 }, // Kehadiran
      { wch: 20 }, // Jumlah Pendamping
      { wch: 40 }, // Ucapan
    ];

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return new Response(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}.xlsx"`,
      },
    });
  }

  if (format === 'json') {
    return new Response(JSON.stringify(sorted, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}.json"`,
      },
    });
  }

  return NextResponse.json({ error: 'Format tidak didukung. Gunakan: csv, excel, json' }, { status: 400 });
}
