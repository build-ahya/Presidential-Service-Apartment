import { NextResponse } from 'next/server';
import { ReservationService } from '@/services/reservation.service';
import { EmailService } from '@/services/mail.service';
import { fDate } from '@/lib/utils';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '10');
    const keyword = searchParams.get('keyword') || undefined;
    const tagsParam = searchParams.get('tags') || undefined;
    const apartmentId = searchParams.get('apartmentId') || undefined;
    const roomId = searchParams.get('roomId') || undefined;
    const tags = tagsParam ? tagsParam.split(',').filter(Boolean) : undefined;

    const { reservations, total } = await ReservationService.list({
      page,
      limit,
      keyword,
      tags,
      apartmentId,
      roomId,
    });
    const totalPages = Math.ceil(total / limit) || 1;
    return NextResponse.json({
      reservations,
      pagination: { page, limit, total, totalPages },
      filters: { keyword, tags },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await ReservationService.create(body);

    // Send notification email to site admin
    const adminEmail = process.env.SMTP_FROM_EMAIL;
    if (adminEmail) {
      const subject = `New Reservation • ${
        created.guest?.name || 'Guest'
      } • ${fDate(created.checkIn)} - ${fDate(created.checkOut)}`;

      const nights = (() => {
        try {
          const inDate = new Date(created.checkIn).getTime();
          const outDate = new Date(created.checkOut).getTime();
          const diff = Math.max(0, outDate - inDate);
          return Math.ceil(diff / (1000 * 60 * 60 * 24));
        } catch {
          return undefined;
        }
      })();

      const currency = created.currency || 'NGN';
      const totalAmount =
        created.totalAmount != null
          ? `${currency} ${created.totalAmount.toLocaleString()}`
          : '—';
      const guestsCount =
        created.guestsCount != null ? String(created.guestsCount) : '—';

      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Reservation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background: #f6f8fb; }
    .container { max-width: 680px; margin: 24px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(16, 24, 40, 0.08); }
    .header { background: #0f172a; color: #ffffff; padding: 20px 28px; }
    .brand { font-size: 18px; font-weight: 600; letter-spacing: 0.2px; }
    .content { padding: 24px 28px; color: #0f172a; }
    .title { font-size: 20px; font-weight: 700; margin: 0 0 12px; }
    .subtitle { font-size: 14px; color: #64748b; margin: 0 0 18px; }
    .card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
    .row:last-child { border-bottom: none; }
    .label { font-size: 13px; color: #64748b; }
    .value { font-size: 14px; color: #0f172a; font-weight: 600; }
    .notes { margin-top: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; font-size: 14px; color: #334155; }
    .footer { padding: 18px 28px 26px; color: #475569; font-size: 13px; }
    .signature { margin-top: 10px; line-height: 1.4; color: #334155; }
    a { color: #2563eb; text-decoration: none; }
    .actions { margin-top: 16px; display: flex; gap: 12px; }
    .btn { display: inline-block; padding: 12px 16px; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none; }
    .btn--confirm { background: #16a34a; color: #ffffff; }
    .btn--cancel { background: #dc2626; color: #ffffff; }
  </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="brand">Presidential Service Apartments</div>
      </div>
      <div class="content">
        <h1 class="title">New Reservation Received</h1>
        <p class="subtitle">A guest just submitted a reservation. Details are below.</p>

        <div class="card">
          <div class="row">
            <div class="label">Guest</div>
            <div class="value">${created.guest?.name || '—'}</div>
          </div>
          <div class="row">
            <div class="label">Email</div>
            <div class="value">${created.guest?.email || '—'}</div>
          </div>
          <div class="row">
            <div class="label">Phone</div>
            <div class="value">${created.guest?.phone || '—'}</div>
          </div>
          <div class="row">
            <div class="label">Check‑in</div>
            <div class="value">${fDate(created.checkIn)}</div>
          </div>
          <div class="row">
            <div class="label">Check‑out</div>
            <div class="value">${fDate(created.checkOut)}</div>
          </div>
          <div class="row">
            <div class="label">Nights</div>
            <div class="value">${nights ?? '—'}</div>
          </div>
          <div class="row">
            <div class="label">Guests</div>
            <div class="value">${guestsCount}</div>
          </div>
          <div class="row">
            <div class="label">Apartment ID</div>
            <div class="value">${created.apartmentId || '—'}</div>
          </div>
          <div class="row">
            <div class="label">Room ID</div>
            <div class="value">${created.roomId || '—'}</div>
          </div>
          <div class="row">
            <div class="label">Total</div>
            <div class="value">${totalAmount}</div>
          </div>
        </div>

        <div class="actions">
          <a class="btn btn--confirm" href="https://presidentialserviceapartments.ng/reservation?action=confirmed&reservationId=${created.id}">Confirm Reservation</a>
          <a class="btn btn--cancel" href="https://presidentialserviceapartments.ng/reservation?action=cancelled&reservationId=${created.id}">Cancel Reservation</a>
        </div>

        ${
          created.notes
            ? `<div class="notes"><strong>Notes:</strong><br/>${created.notes}</div>`
            : ''
        }
      </div>
      <div class="footer">
        <div>Best regards,</div>
        <div class="signature">
          <strong>Reservations Team</strong><br/>
          Presidential Service Apartments<br/>
          <a href="https://presidentialserviceapartments.ng">presidentialserviceapartments.ng</a>
        </div>
        <div style="margin-top:12px;color:#94a3b8;">This message was sent automatically from your website’s reservation system.</div>
      </div>
    </div>
  </body>
</html>`;

      try {
        await EmailService.sendEmail({ to: adminEmail, subject, html });
      } catch (err) {
        console.error('Reservation email failed:', err);
      }
    } else {
      console.warn('SMTP_FROM_EMAIL is not set. Skipping reservation email.');
    }

    return NextResponse.json(
      { reservation: created, emailSent: !!adminEmail },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to create reservation' },
      { status: 500 }
    );
  }
}
