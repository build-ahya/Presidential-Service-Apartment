'use client';

import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export default function PublicFooter() {
  const { content } = useAppSelector((state) => state.content);

  const { siteName, contact, footerLinks, socialLinks } =
    content.systemSettings;

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'Facebook':
        return (
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5a3.5 3.5 0 0 1 3.8-3.8h2.7v3h-2c-.6 0-1 .4-1 1V12h3l-.5 3h-2.5v7A10 10 0 0 0 22 12Z' />
          </svg>
        );
      case 'Instagram':
        return (
          <svg
            className='w-5 h-5'
            fill='currentColor'
            viewBox='0 0 32 32'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
            <g
              id='SVGRepo_tracerCarrier'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></g>
            <g id='SVGRepo_iconCarrier'>
              <path d='M20.445 5h-8.891A6.559 6.559 0 0 0 5 11.554v8.891A6.559 6.559 0 0 0 11.554 27h8.891a6.56 6.56 0 0 0 6.554-6.555v-8.891A6.557 6.557 0 0 0 20.445 5zm4.342 15.445a4.343 4.343 0 0 1-4.342 4.342h-8.891a4.341 4.341 0 0 1-4.341-4.342v-8.891a4.34 4.34 0 0 1 4.341-4.341h8.891a4.342 4.342 0 0 1 4.341 4.341l.001 8.891z'></path>
              <path d='M16 10.312c-3.138 0-5.688 2.551-5.688 5.688s2.551 5.688 5.688 5.688 5.688-2.551 5.688-5.688-2.55-5.688-5.688-5.688zm0 9.163a3.475 3.475 0 1 1-.001-6.95 3.475 3.475 0 0 1 .001 6.95zM21.7 8.991a1.363 1.363 0 1 1-1.364 1.364c0-.752.51-1.364 1.364-1.364z'></path>
            </g>
          </svg>
        );
      case 'Tiktok':
        return (
          <svg
            className='w-5 h-5'
            fill='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
            <g
              id='SVGRepo_tracerCarrier'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></g>
            <g id='SVGRepo_iconCarrier'>
              <path d='M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z'></path>
            </g>
          </svg>
        );
      case 'X':
        return (
          <svg
            className='w-5 h-5'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
            x='0px'
            y='0px'
            viewBox='0 0 30 30'
          >
            <path d='M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z'></path>
          </svg>
        );
      case 'Whatsapp':
        return (
          <svg
            className='w-5 h-5'
            viewBox='0 0 24 24'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
            <g
              id='SVGRepo_tracerCarrier'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></g>
            <g id='SVGRepo_iconCarrier'>
              {' '}
              <path d='M6.014 8.00613C6.12827 7.1024 7.30277 5.87414 8.23488 6.01043L8.23339 6.00894C9.14051 6.18132 9.85859 7.74261 10.2635 8.44465C10.5504 8.95402 10.3641 9.4701 10.0965 9.68787C9.7355 9.97883 9.17099 10.3803 9.28943 10.7834C9.5 11.5 12 14 13.2296 14.7107C13.695 14.9797 14.0325 14.2702 14.3207 13.9067C14.5301 13.6271 15.0466 13.46 15.5548 13.736C16.3138 14.178 17.0288 14.6917 17.69 15.27C18.0202 15.546 18.0977 15.9539 17.8689 16.385C17.4659 17.1443 16.3003 18.1456 15.4542 17.9421C13.9764 17.5868 8 15.27 6.08033 8.55801C5.97237 8.24048 5.99955 8.12044 6.014 8.00613Z'></path>{' '}
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M12 23C10.7764 23 10.0994 22.8687 9 22.5L6.89443 23.5528C5.56462 24.2177 4 23.2507 4 21.7639V19.5C1.84655 17.492 1 15.1767 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23ZM6 18.6303L5.36395 18.0372C3.69087 16.4772 3 14.7331 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C11.0143 21 10.552 20.911 9.63595 20.6038L8.84847 20.3397L6 21.7639V18.6303Z'
              ></path>{' '}
            </g>
          </svg>
        );
      default:
        return '';
    }
  };

  return (
    <footer className='border-t border-white/10 bg-secondary text-white'>
      <div className='mx-auto container px-6 py-10'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-10'>
          <div>
            <Link href='/' className='inline-flex items-center gap-2'>
              <Image
                src='/images/presidential-service-logo.svg'
                alt={`${siteName} logo`}
                width={1024}
                height={600}
                className='h-10 w-auto'
              />
            </Link>
            {contact?.email && (
              <div className='mt-4 text-sm text-white/70'>
                <Link
                  href={`mailto:${contact.email}`}
                  className='hover:text-white'
                >
                  {contact.email}
                </Link>
              </div>
            )}
            {socialLinks?.length > 0 && (
              <div className='mt-4 flex items-center gap-3'>
                {socialLinks.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    target={s.target || '_blank'}
                    aria-label={s.label}
                    className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors'
                  >
                    {getSocialIcon(s.label) || (
                      <ArrowUpRight className='w-4 h-4' />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {footerLinks?.map((section) => (
            <div key={section.section}>
              <h3 className='text-sm font-semibold'>{section.section}</h3>
              <ul className='mt-3 space-y-2'>
                {section.links.map((link) => (
                  <li key={`${section.section}-${link.href}`}>
                    <Link
                      href={link.href}
                      target={link.target}
                      className='inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors'
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className='w-3.5 h-3.5 opacity-60' />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='mt-10 border-t border-white/10 pt-6 text-xs text-white/60'>
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
