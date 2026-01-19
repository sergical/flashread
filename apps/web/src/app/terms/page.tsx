import type { Metadata } from 'next'
import { DocumentLeftAligned } from '@/components/sections/document-left-aligned'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'FlashRead terms of service - the agreement between you and FlashRead.',
}

export default function TermsPage() {
  return (
    <DocumentLeftAligned
      headline="Terms of Service"
      subheadline={<p>Last updated: January 2025</p>}
    >
      <h2>Agreement to Terms</h2>
      <p>
        By accessing or using FlashRead, you agree to be bound by these Terms of Service. 
        If you disagree with any part of these terms, you may not access the service.
      </p>

      <h2>Description of Service</h2>
      <p>
        FlashRead is a speed reading tool that uses RSVP (Rapid Serial Visual Presentation) 
        technology to help users read faster. The service is provided as a Chrome browser 
        extension and accompanying website.
      </p>

      <h2>User Accounts</h2>
      <p>
        To access certain features, you may need to create an account. You are responsible for:
      </p>
      <ul>
        <li>Maintaining the confidentiality of your account</li>
        <li>All activities that occur under your account</li>
        <li>Notifying us of any unauthorized use</li>
      </ul>

      <h2>Subscriptions and Payments</h2>
      <h3>Billing</h3>
      <p>
        Pro subscriptions are billed in advance on a monthly or annual basis. 
        Lifetime purchases are one-time payments.
      </p>

      <h3>Cancellation</h3>
      <p>
        You may cancel your subscription at any time. Upon cancellation, you will continue 
        to have access until the end of your current billing period.
      </p>

      <h3>Refunds</h3>
      <p>
        We offer a 14-day money-back guarantee for first-time subscribers. Lifetime purchases 
        are eligible for refunds within 30 days of purchase.
      </p>

      <h2>Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the service for any illegal purpose</li>
        <li>Attempt to reverse engineer the software</li>
        <li>Share your account credentials with others</li>
        <li>Interfere with the service&apos;s operation</li>
      </ul>

      <h2>Intellectual Property</h2>
      <p>
        The FlashRead service, including its original content, features, and functionality, 
        is owned by FlashRead and is protected by international copyright, trademark, and 
        other intellectual property laws.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        FlashRead shall not be liable for any indirect, incidental, special, consequential, 
        or punitive damages resulting from your use of the service.
      </p>

      <h2>Changes to Terms</h2>
      <p>
        We reserve the right to modify these terms at any time. We will notify users of any 
        material changes via email or through the service.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have questions about these Terms, please contact us at{' '}
        <a href="mailto:legal@flashread.com">legal@flashread.com</a>.
      </p>
    </DocumentLeftAligned>
  )
}
