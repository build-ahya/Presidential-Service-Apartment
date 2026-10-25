'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { SocialIcon } from '@/components/icons/social';
import { useSite } from '@/providers/site-provider';

export default function PublicFooter() {
  const { content } = useSite();
  const { siteName, siteSlogan, contact, footerLinks, socialLinks } = content.systemSettings;
  const address = contact?.addresses?.[0]?.address;

  return (
    <footer className='bg-secondary text-secondary-foreground'>
      <div className='container mx-auto px-4 py-14'>
        <div className='grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]'>
          <div className='flex flex-col gap-5'>
            <Link href='/' aria-label={siteName}>
              <Logo name={siteName} tone='light' className='h-14' />
            </Link>
            {siteSlogan && <p className='font-display text-lg text-white/80 italic'>{siteSlogan}</p>}
            <ul className='flex flex-col gap-2.5 text-sm text-white/75'>
              {address && (
                <li className='flex gap-2.5'>
                  <MapPin className='mt-0.5 size-4 shrink-0 text-primary' />
                  <span>{address}</span>
                </li>
              )}
              {contact?.phones?.[0] && (
                <li className='flex gap-2.5'>
                  <Phone className='mt-0.5 size-4 shrink-0 text-primary' />
                  <a href={`tel:${contact.phones[0].replace(/\s+/g, '')}`} className='hover:text-white'>
                    {contact.phones[0]}
                  </a>
                </li>
              )}
              {contact?.email && (
                <li className='flex gap-2.5'>
                  <Mail className='mt-0.5 size-4 shrink-0 text-primary' />
                  <a href={`mailto:${contact.email}`} className='hover:text-white'>
                    {contact.email}
                  </a>
                </li>
              )}
            </ul>
            {socialLinks?.length > 0 && (
              <div className='flex items-center gap-2'>
                {socialLinks.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target='_blank'
                    rel='noreferrer'
                    aria-label={s.label}
                    className='grid size-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-primary hover:text-primary-foreground'
                  >
                    <SocialIcon name={s.icon || s.label} className='size-4' />
                  </a>
                ))}
              </div>
            )}
          </div>

          {footerLinks?.map((section) => (
            <div key={section.section}>
              <h3 className='mb-4 text-sm font-semibold tracking-wide text-white uppercase'>{section.section}</h3>
              <ul className='flex flex-col gap-2.5'>
                {section.links.map((link) => (
                  <li key={`${section.section}-${link.href}`}>
                    <Link
                      href={link.href}
                      target={link.target}
                      className='text-sm text-white/70 transition-colors hover:text-white'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:justify-between'>
          <span>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
