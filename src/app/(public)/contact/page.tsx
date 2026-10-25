import type { Metadata } from 'next';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SocialIcon } from '@/components/icons/social';
import { FaqList } from '@/components/shared/faq-list';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import { ContentService } from '@/services/content.service';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Presidential Service Apartments.',
};

const digits = (v: string) => v.replace(/\D/g, '');

export default async function Contact() {
  const { siteContent, systemSettings } = await ContentService.getContent();
  const { hero, faqs } = siteContent.contact;
  const { contact, socialLinks } = systemSettings;
  const address = contact.addresses?.[0];

  const cards = [
    contact.phones?.[0] && {
      icon: Phone,
      title: 'Call us',
      value: contact.phones[0],
      action: { label: 'Call', href: `tel:${contact.phones[0].replace(/\s+/g, '')}` },
    },
    contact.whatsappPhone && {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: contact.whatsappPhone,
      note: 'We typically reply within minutes.',
      action: { label: 'Chat', href: `https://wa.me/${digits(contact.whatsappPhone)}`, external: true },
    },
    contact.email && {
      icon: Mail,
      title: 'Email',
      value: contact.email,
      note: 'We reply within 24 hours.',
      action: { label: 'Email', href: `mailto:${contact.email}` },
    },
  ].filter(Boolean) as {
    icon: typeof Phone;
    title: string;
    value: string;
    note?: string;
    action: { label: string; href: string; external?: boolean };
  }[];

  return (
    <>
      <section className='bg-secondary pt-28 pb-14 text-secondary-foreground md:pt-36 md:pb-20'>
        <div className='container mx-auto px-4'>
          {hero.overline && (
            <p className='mb-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase'>{hero.overline}</p>
          )}
          <h1 className='font-display max-w-3xl text-4xl font-semibold md:text-6xl'>{hero.title}</h1>
          {hero.body && <p className='mt-4 max-w-2xl text-lg text-white/75'>{hero.body}</p>}
        </div>
      </section>

      <section className='container mx-auto px-4 py-14'>
        <div className='grid gap-5 md:grid-cols-3'>
          {cards.map(({ icon: Icon, title, value, note, action }) => (
            <div key={title} className='flex flex-col gap-3 rounded-2xl border bg-card p-6 shadow-sm'>
              <span className='grid size-11 place-items-center rounded-xl bg-primary/15 text-secondary'>
                <Icon className='size-5' />
              </span>
              <div>
                <h2 className='font-semibold'>{title}</h2>
                <p className='text-muted-foreground'>{value}</p>
                {note && <p className='mt-1 text-xs text-muted-foreground'>{note}</p>}
              </div>
              <Button asChild variant='outline' className='mt-auto w-fit'>
                <a href={action.href} target={action.external ? '_blank' : undefined} rel='noreferrer'>
                  {action.label}
                </a>
              </Button>
            </div>
          ))}
        </div>

        {address && (
          <div className='mt-6 grid gap-6 overflow-hidden rounded-2xl border bg-card shadow-sm md:grid-cols-2'>
            <div className='flex flex-col gap-3 p-6'>
              <span className='grid size-11 place-items-center rounded-xl bg-primary/15 text-secondary'>
                <MapPin className='size-5' />
              </span>
              <h2 className='font-semibold'>Visit us</h2>
              <p className='text-muted-foreground'>{address.address}</p>
              <Button asChild variant='outline' className='w-fit'>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.address)}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  Get directions
                </a>
              </Button>
            </div>
            <iframe
              title='Map'
              className='h-72 w-full md:h-full'
              loading='lazy'
              src={contact.map || `https://www.google.com/maps?q=${encodeURIComponent(address.address)}&output=embed`}
            />
          </div>
        )}

        {socialLinks.length > 0 && (
          <div className='mt-10 flex flex-wrap items-center gap-3'>
            <span className='text-sm font-semibold'>Follow us</span>
            {socialLinks.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted'
              >
                <SocialIcon name={s.icon || s.label} className='size-4' />
                {s.label}
              </a>
            ))}
          </div>
        )}
      </section>

      {faqs.items?.length ? (
        <section className='bg-muted/50 py-16'>
          <div className='container mx-auto max-w-3xl px-4'>
            <SectionHeading title={faqs.title} subtitle={faqs.subtitle} />
            <FaqList items={faqs.items} />
          </div>
        </section>
      ) : null}
    </>
  );
}
