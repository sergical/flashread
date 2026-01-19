import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { Main } from '@/components/elements/main'
import { GitHubIcon } from '@/components/icons/social/github-icon'
import { XIcon } from '@/components/icons/social/x-icon'
import {
  FooterCategory,
  FooterLink,
  FooterWithNewsletterFormCategoriesAndSocialIcons,
  NewsletterForm,
  SocialLink,
} from '@/components/sections/footer-with-newsletter-form-categories-and-social-icons'
import {
  NavbarLink,
  NavbarWithLogoActionsAndLeftAlignedLinks,
} from '@/components/sections/navbar-with-logo-actions-and-left-aligned-links'
import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'FlashRead - RSVP Speed Reader',
    template: '%s | FlashRead',
  },
  description: 'Read 3x faster with AI-powered speed reading. FlashRead uses RSVP technology to help you consume content faster while retaining more.',
  keywords: ['speed reading', 'RSVP', 'productivity', 'reading', 'chrome extension'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NavbarWithLogoActionsAndLeftAlignedLinks
          id="navbar"
          links={
            <>
              <NavbarLink href="/pricing">Pricing</NavbarLink>
              <NavbarLink href="/about">About</NavbarLink>
              <NavbarLink href="#" className="sm:hidden">
                Log in
              </NavbarLink>
            </>
          }
          logo={
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-olive-950 dark:text-white">FlashRead</span>
            </Link>
          }
          actions={
            <>
              <PlainButtonLink href="/login" className="max-sm:hidden">
                Log in
              </PlainButtonLink>
              <ButtonLink href="/pricing">Get Pro</ButtonLink>
            </>
          }
        />

        <Main>{children}</Main>

        <FooterWithNewsletterFormCategoriesAndSocialIcons
          id="footer"
          cta={
            <NewsletterForm
              headline="Stay in the loop"
              subheadline={
                <p>
                  Get speed reading tips, product updates, and be the first to know about new features.
                </p>
              }
              action="#"
            />
          }
          links={
            <>
              <FooterCategory title="Product">
                <FooterLink href="/#features">Features</FooterLink>
                <FooterLink href="/pricing">Pricing</FooterLink>
                <FooterLink href="#">Chrome Web Store</FooterLink>
              </FooterCategory>
              <FooterCategory title="Company">
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="#">Blog</FooterLink>
              </FooterCategory>
              <FooterCategory title="Resources">
                <FooterLink href="#">Help Center</FooterLink>
                <FooterLink href="#">Contact</FooterLink>
              </FooterCategory>
              <FooterCategory title="Legal">
                <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
              </FooterCategory>
            </>
          }
          fineprint="© 2025 FlashRead. All rights reserved."
          socialLinks={
            <>
              <SocialLink href="https://x.com/flashread" name="X">
                <XIcon />
              </SocialLink>
              <SocialLink href="https://github.com/flashread" name="GitHub">
                <GitHubIcon />
              </SocialLink>
            </>
          }
        />
      </body>
    </html>
  )
}
