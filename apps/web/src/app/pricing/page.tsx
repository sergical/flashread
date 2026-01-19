'use client'

import { ButtonLink, PlainButtonLink, SoftButtonLink } from '@/components/elements/button'
import { ChevronIcon } from '@/components/icons/chevron-icon'
import { CallToActionSimpleCentered } from '@/components/sections/call-to-action-simple-centered'
import { FAQsAccordion, Faq } from '@/components/sections/faqs-accordion'
import { PlanComparisonTable } from '@/components/sections/plan-comparison-table'
import { Plan, PricingHeroMultiTier } from '@/components/sections/pricing-hero-multi-tier'
import { TestimonialTwoColumnWithLargePhoto } from '@/components/sections/testimonial-two-column-with-large-photo'

function plans(option: string) {
  const isMonthly = option === 'Monthly'
  
  return (
    <>
      <Plan
        name="Free"
        price="$0"
        period="/forever"
        subheadline={<p>Everything you need to start reading faster</p>}
        features={[
          'Core RSVP reader',
          '100-1200 WPM speed control',
          'ORP (Optimal Recognition Point)',
          'Local reading history',
          'Basic statistics',
          'Works on any website',
        ]}
        cta={
          <SoftButtonLink href="https://chrome.google.com/webstore" target="_blank" size="lg">
            Install Free
          </SoftButtonLink>
        }
      />
      <Plan
        name="Pro"
        price={isMonthly ? '$7' : '$60'}
        period={isMonthly ? '/month' : '/year'}
        badge={isMonthly ? 'Most popular' : 'Save 30%'}
        subheadline={<p>AI-powered features for serious readers</p>}
        features={[
          'Everything in Free',
          'AI Voice Narration (ElevenLabs)',
          'AI Article Summaries',
          'Adaptive Background Audio',
          'Cross-device Sync',
          'Advanced Analytics Dashboard',
          'Reading Goals & Streaks',
          'Priority Support',
        ]}
        cta={
          <ButtonLink href="#" size="lg">
            Start 14-Day Free Trial
          </ButtonLink>
        }
      />
      <Plan
        name="Lifetime"
        price="$149"
        period="/once"
        subheadline={<p>One-time payment, forever access</p>}
        features={[
          'Everything in Pro',
          'Lifetime access',
          'All future features included',
          'Priority support forever',
          'Early access to betas',
          'No recurring charges ever',
        ]}
        cta={
          <SoftButtonLink href="#" size="lg">
            Get Lifetime Access
          </SoftButtonLink>
        }
      />
    </>
  )
}

export default function PricingPage() {
  return (
    <>
      {/* Pricing Hero */}
      <PricingHeroMultiTier
        id="pricing"
        headline="Simple, transparent pricing"
        subheadline={
          <p>
            Start free, upgrade when you&apos;re ready. No hidden fees, no surprise charges. 
            Cancel anytime with a 14-day money-back guarantee.
          </p>
        }
        options={['Monthly', 'Yearly'] as const}
        plans={{ Monthly: plans('Monthly'), Yearly: plans('Yearly') }}
      />

      {/* Plan Comparison Table */}
      <PlanComparisonTable
        id="comparison"
        plans={['Free', 'Pro', 'Lifetime']}
        features={[
          {
            title: 'Core Reading',
            features: [
              { name: 'RSVP Speed Reading', value: true },
              { name: 'Speed Control (100-1200 WPM)', value: true },
              { name: 'ORP Algorithm', value: true },
              { name: 'Article Extraction (Readability)', value: true },
              { name: 'Text Selection Reading', value: true },
              { name: 'Keyboard Shortcuts', value: true },
            ],
          },
          {
            title: 'AI Features',
            features: [
              {
                name: 'AI Voice Narration',
                value: { Free: false, Pro: true, Lifetime: true },
              },
              {
                name: 'AI Article Summaries',
                value: { Free: false, Pro: true, Lifetime: true },
              },
              {
                name: 'Key Points Extraction',
                value: { Free: false, Pro: true, Lifetime: true },
              },
              {
                name: 'Reading Difficulty Analysis',
                value: { Free: false, Pro: true, Lifetime: true },
              },
              {
                name: 'Adaptive Background Music',
                value: { Free: false, Pro: true, Lifetime: true },
              },
            ],
          },
          {
            title: 'Sync & Storage',
            features: [
              { name: 'Local Reading History', value: true },
              {
                name: 'Cross-device Sync',
                value: { Free: false, Pro: true, Lifetime: true },
              },
              {
                name: 'Cloud Settings Backup',
                value: { Free: false, Pro: true, Lifetime: true },
              },
              {
                name: 'Reading List (Save for Later)',
                value: { Free: false, Pro: true, Lifetime: true },
              },
              {
                name: 'Resume Reading Position',
                value: { Free: false, Pro: true, Lifetime: true },
              },
            ],
          },
          {
            title: 'Analytics & Goals',
            features: [
              { name: 'Basic Statistics', value: true },
              {
                name: 'Advanced Analytics Dashboard',
                value: { Free: false, Pro: true, Lifetime: true },
              },
              {
                name: 'Reading Speed Charts',
                value: { Free: false, Pro: true, Lifetime: true },
              },
              {
                name: 'Daily/Weekly Goals',
                value: { Free: false, Pro: true, Lifetime: true },
              },
              {
                name: 'Reading Streaks',
                value: { Free: false, Pro: true, Lifetime: true },
              },
              {
                name: 'Export Data (CSV)',
                value: { Free: false, Pro: true, Lifetime: true },
              },
            ],
          },
          {
            title: 'Support',
            features: [
              { name: 'Community Support', value: true },
              {
                name: 'Email Support',
                value: { Free: false, Pro: true, Lifetime: true },
              },
              {
                name: 'Priority Response',
                value: { Free: false, Pro: true, Lifetime: true },
              },
              {
                name: 'Early Access to Features',
                value: { Free: false, Pro: false, Lifetime: true },
              },
            ],
          },
        ]}
      />

      {/* Testimonial */}
      <TestimonialTwoColumnWithLargePhoto
        id="testimonial"
        quote={
          <p>
            FlashRead Pro has completely changed how I consume information. The AI summaries help me 
            decide what&apos;s worth reading in depth, and the voice sync lets me &quot;read&quot; while 
            multitasking. I went from dreading my reading list to actually looking forward to it.
          </p>
        }
        img={
          <div className="flex h-full w-full items-center justify-center bg-olive-200 dark:bg-olive-800">
            <div className="text-center">
              <div className="text-8xl font-bold text-olive-400 dark:text-olive-600">MC</div>
              <div className="mt-4 text-sm text-olive-600 dark:text-olive-400">PhD Candidate</div>
            </div>
          </div>
        }
        name="Marcus Chen"
        byline="PhD Candidate at MIT — reads 50+ papers per month"
      />

      {/* FAQs */}
      <FAQsAccordion id="faqs" headline="Pricing Questions">
        <Faq
          id="faq-1"
          question="Is there a free trial for Pro?"
          answer="Yes! All Pro features come with a 14-day free trial. No credit card required to start. You'll get full access to AI voice narration, summaries, cross-device sync, and all other Pro features."
        />
        <Faq
          id="faq-2"
          question="What's the difference between Monthly and Yearly?"
          answer="Both plans include identical features. Yearly billing saves you 30% ($60/year vs $84/year if paid monthly). You can switch between plans anytime from your account settings."
        />
        <Faq
          id="faq-3"
          question="What does Lifetime include?"
          answer="Lifetime is a one-time $149 payment that gives you permanent access to all Pro features, including any new features we add in the future. No recurring charges ever. It's our best value for long-term users."
        />
        <Faq
          id="faq-4"
          question="Can I cancel anytime?"
          answer="Absolutely. You can cancel your subscription at any time from your account dashboard. You'll continue to have access until the end of your current billing period. We also offer a 14-day money-back guarantee."
        />
        <Faq
          id="faq-5"
          question="How does the AI voice narration work?"
          answer="We use ElevenLabs' state-of-the-art text-to-speech to generate natural-sounding voice narration that syncs word-by-word with the RSVP display. Choose from multiple voices and adjust speed to match your reading pace."
        />
        <Faq
          id="faq-6"
          question="What payment methods do you accept?"
          answer="We accept all major credit cards (Visa, Mastercard, American Express) through Stripe. We also support Apple Pay and Google Pay for a faster checkout experience."
        />
        <Faq
          id="faq-7"
          question="Is my data secure?"
          answer="Yes. We use Supabase for secure authentication and data storage. All data is encrypted in transit (TLS) and at rest. We never sell your data or share it with third parties. Free users' data stays entirely local on their device."
        />
        <Faq
          id="faq-8"
          question="Do you offer student or team discounts?"
          answer="Yes! Students with a valid .edu email get 50% off Pro. For teams of 5+, contact us for volume pricing. We also offer discounts for non-profits and educational institutions."
        />
      </FAQsAccordion>

      {/* Call To Action */}
      <CallToActionSimpleCentered
        id="cta"
        headline="Ready to read 3x faster?"
        subheadline={
          <p>
            Start with the free extension, upgrade to Pro when you&apos;re ready. 
            14-day free trial, no credit card required.
          </p>
        }
        cta={
          <div className="flex items-center gap-4">
            <ButtonLink href="https://chrome.google.com/webstore" target="_blank" size="lg">
              Install Free Extension
            </ButtonLink>
            <PlainButtonLink href="#pricing" size="lg">
              Compare Plans <ChevronIcon />
            </PlainButtonLink>
          </div>
        }
      />
    </>
  )
}
