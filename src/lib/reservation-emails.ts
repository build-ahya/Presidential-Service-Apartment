import 'server-only';
import { format, parseISO } from 'date-fns';
import type { Apartment } from '@/models/apartment';
import type { Reservation } from '@/models/reservation';

const esc = (v: unknown) =>
  String(v ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const day = (iso: string) => format(parseISO(iso), 'EEE, d MMM yyyy');

const money = (amount?: number, currency = 'NGN') =>
  amount == null ? '—' : `${currency} ${amount.toLocaleString('en-NG')}`;

const shell = (siteName: string, title: string, intro: string, body: string) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${esc(title)}</title></head>
<body style="margin:0;padding:24px 12px;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#0f172a;">
  <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,.08);">
    <div style="background:#0f2a4a;color:#fff;padding:20px 28px;font-size:17px;font-weight:600;">${esc(siteName)}</div>
    <div style="padding:28px;">
      <h1 style="margin:0 0 8px;font-size:21px;">${esc(title)}</h1>
      <p style="margin:0 0 20px;color:#64748b;font-size:14px;line-height:1.5;">${intro}</p>
      ${body}
    </div>
  </div>
</body></html>`;

const rows = (pairs: [string, string][]) =>
  `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:10px;border-collapse:separate;">${pairs
    .map(
      ([k, v], i) =>
        `<tr><td style="padding:10px 14px;font-size:13px;color:#64748b;${i ? 'border-top:1px solid #f1f5f9;' : ''}">${esc(k)}</td><td align="right" style="padding:10px 14px;font-size:14px;font-weight:600;${i ? 'border-top:1px solid #f1f5f9;' : ''}">${esc(v)}</td></tr>`
    )
    .join('')}</table>`;

function summaryRows(r: Reservation, apartment: Apartment): [string, string][] {
  return [
    ['Apartment', apartment.name],
    ['Check-in', day(r.checkIn)],
    ['Check-out', day(r.checkOut)],
    ['Nights', String(r.nights ?? '—')],
    ['Guests', String(r.guestsCount ?? '—')],
    ['Estimated total', money(r.totalAmount, r.currency)],
  ];
}

export function adminReservationEmail(opts: {
  siteName: string;
  baseUrl: string;
  reservation: Reservation;
  apartment: Apartment;
}) {
  const { siteName, baseUrl, reservation: r, apartment } = opts;
  const link = (action: string) =>
    `${baseUrl}/reservation?action=${action}&reservationId=${encodeURIComponent(r.id)}`;
  const button = (href: string, label: string, bg: string) =>
    `<a href="${esc(href)}" style="display:inline-block;margin-right:10px;padding:12px 18px;border-radius:8px;background:${bg};color:#fff;font-size:14px;font-weight:600;text-decoration:none;">${esc(label)}</a>`;

  const body = `${rows([
    ['Guest', r.guest.name],
    ['Email', r.guest.email ?? '—'],
    ['Phone', r.guest.phone ?? '—'],
    ...summaryRows(r, apartment),
  ])}
  ${r.notes ? `<div style="margin-top:16px;padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;color:#334155;"><strong>Notes</strong><br/>${esc(r.notes)}</div>` : ''}
  <div style="margin-top:22px;">${button(link('confirmed'), 'Confirm reservation', '#16a34a')}${button(link('cancelled'), 'Cancel reservation', '#dc2626')}</div>
  <p style="margin:14px 0 0;color:#94a3b8;font-size:12px;">You’ll be asked to sign in to the admin dashboard to complete either action.</p>`;

  return {
    subject: `New reservation • ${r.guest.name} • ${day(r.checkIn)} – ${day(r.checkOut)}`,
    html: shell(siteName, 'New reservation request', 'A guest just submitted a reservation request.', body),
  };
}

export function guestReservationEmail(opts: {
  siteName: string;
  reservation: Reservation;
  apartment: Apartment;
  contactEmail?: string;
}) {
  const { siteName, reservation: r, apartment, contactEmail } = opts;
  return {
    subject: `We received your request — ${apartment.name}`,
    html: shell(
      siteName,
      `Thank you, ${r.guest.name.split(' ')[0]}`,
      `We’ve received your reservation request and our team will confirm availability shortly.${contactEmail ? ` Questions? Reply to this email or write to ${esc(contactEmail)}.` : ''}`,
      rows(summaryRows(r, apartment))
    ),
  };
}

export function reservationStatusEmail(opts: {
  siteName: string;
  reservation: Reservation;
  apartment: Apartment;
  status: 'confirmed' | 'cancelled';
}) {
  const { siteName, reservation: r, apartment, status } = opts;
  const confirmed = status === 'confirmed';
  return {
    subject: confirmed ? `Your reservation is confirmed — ${apartment.name}` : `Your reservation was cancelled — ${apartment.name}`,
    html: shell(
      siteName,
      confirmed ? 'Reservation confirmed' : 'Reservation cancelled',
      confirmed
        ? `Great news, ${esc(r.guest.name.split(' ')[0])} — your stay is confirmed. We look forward to hosting you.`
        : `Hi ${esc(r.guest.name.split(' ')[0])}, your reservation has been cancelled. Get in touch if this wasn’t expected.`,
      rows(summaryRows(r, apartment))
    ),
  };
}
