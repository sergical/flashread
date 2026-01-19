import type { Metadata } from 'next'
import { DocumentLeftAligned } from '@/components/sections/document-left-aligned'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'FlashRead privacy policy - how we collect, use, and protect your data.',
}

export default function PrivacyPolicyPage() {
  return (
    <DocumentLeftAligned
      headline="Privacy Policy"
      subheadline={<p>Last updated: January 2025</p>}
    >
      <h2>Introduction</h2>
      <p>
        FlashRead (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
        This Privacy Policy explains how we collect, use, and safeguard your information when you use 
        our Chrome extension and website.
      </p>

      <h2>Information We Collect</h2>
      <h3>Free Users</h3>
      <p>
        For free users, FlashRead stores all data locally in your browser. We do not collect 
        or transmit any personal information, reading history, or usage data to our servers.
      </p>

      <h3>Pro Users</h3>
      <p>For Pro subscribers, we collect:</p>
      <ul>
        <li>Email address (for authentication)</li>
        <li>Reading statistics and history (for cross-device sync)</li>
        <li>Settings preferences (for cross-device sync)</li>
        <li>Payment information (processed by Stripe)</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide and maintain our service</li>
        <li>Sync your data across devices (Pro users)</li>
        <li>Process payments (Pro users)</li>
        <li>Send important service updates</li>
        <li>Improve our product</li>
      </ul>

      <h2>Data Security</h2>
      <p>
        We implement appropriate security measures to protect your personal information. 
        All data is encrypted in transit using TLS and at rest in our databases.
      </p>

      <h2>Third-Party Services</h2>
      <p>We use the following third-party services:</p>
      <ul>
        <li><strong>Supabase</strong> - Authentication and database</li>
        <li><strong>Stripe</strong> - Payment processing</li>
        <li><strong>ElevenLabs</strong> - Text-to-speech (Pro feature)</li>
        <li><strong>OpenAI</strong> - AI summarization (Pro feature)</li>
      </ul>

      <h2>Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal data</li>
        <li>Request deletion of your data</li>
        <li>Export your data</li>
        <li>Opt out of marketing communications</li>
      </ul>

      <h2>Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at{' '}
        <a href="mailto:privacy@flashread.com">privacy@flashread.com</a>.
      </p>
    </DocumentLeftAligned>
  )
}
