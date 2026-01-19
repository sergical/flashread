import type { Metadata } from 'next'
import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { BeakerIcon } from '@/components/icons/beaker-icon'
import { ChevronIcon } from '@/components/icons/chevron-icon'
import { LockIcon } from '@/components/icons/lock-icon'
import { CodeSquareIcon } from '@/components/icons/code-square-icon'
import { CallToActionSimple } from '@/components/sections/call-to-action-simple'
import { Feature, FeaturesThreeColumn } from '@/components/sections/features-three-column'
import { HeroLeftAlignedWithPhoto } from '@/components/sections/hero-left-aligned-with-photo'
import { Stat, StatsThreeColumnWithDescription } from '@/components/sections/stats-three-column-with-description'
import { TestimonialTwoColumnWithLargePhoto } from '@/components/sections/testimonial-two-column-with-large-photo'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about FlashRead and our mission to help people read faster and retain more.',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <HeroLeftAlignedWithPhoto
        id="hero"
        headline="Helping the world read faster, one word at a time."
        subheadline={
          <>
            <p>
              We believe everyone deserves the tools to consume information efficiently. In a world 
              overflowing with articles, papers, and documentation, reading speed is a superpower.
            </p>
            <p>
              FlashRead combines proven RSVP science with modern AI to create the ultimate reading 
              experience — fast, focused, and actually enjoyable.
            </p>
          </>
        }
        photo={
          <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-olive-200 via-olive-100 to-olive-200 dark:from-olive-900 dark:via-olive-800 dark:to-olive-900">
            <div className="text-center px-8">
              <div className="font-display text-6xl md:text-8xl text-olive-950/20 dark:text-white/20 tracking-tight">
                RSVP
              </div>
              <p className="mt-4 text-lg text-olive-600 dark:text-olive-400 max-w-md mx-auto">
                Rapid Serial Visual Presentation — the science of speed reading
              </p>
            </div>
          </div>
        }
      />

      {/* Stats */}
      <StatsThreeColumnWithDescription
        id="stats"
        heading="The science behind speed reading"
        description={
          <>
            <p>
              Traditional reading is limited by saccadic eye movements — the jumps your eyes make 
              between words. RSVP eliminates this bottleneck by presenting text at a single focal point.
            </p>
            <p>
              Research shows trained RSVP readers can achieve 500+ WPM while maintaining comprehension 
              scores above 80%. FlashRead makes this science accessible to everyone.
            </p>
          </>
        }
      >
        <Stat stat="2-3x" text="Average speed increase reported by users after one week of practice with RSVP techniques." />
        <Stat stat="80%+" text="Comprehension retention at speeds of 500 WPM, according to cognitive science research." />
        <Stat stat="250ms" text="Optimal word display duration for most readers — adjusted dynamically by our ORP algorithm." />
      </StatsThreeColumnWithDescription>

      {/* Mission */}
      <TestimonialTwoColumnWithLargePhoto
        id="mission"
        quote={
          <p>
            We started FlashRead because we were drowning in reading lists. As developers, we read 
            constantly — documentation, blog posts, research papers, newsletters. There had to be 
            a better way. RSVP technology existed, but no one had built a truly great implementation. 
            So we did.
          </p>
        }
        img={
          <div className="flex h-full w-full items-center justify-center bg-olive-200 dark:bg-olive-800">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 text-6xl font-bold text-olive-400 dark:text-olive-600">
                <span>{'<'}</span>
                <span>FR</span>
                <span>{'/>'}</span>
              </div>
              <div className="mt-4 text-sm text-olive-600 dark:text-olive-400">Built by readers, for readers</div>
            </div>
          </div>
        }
        name="The FlashRead Team"
        byline="Developers, researchers, and chronic readers"
      />

      {/* Values */}
      <FeaturesThreeColumn
        id="values"
        eyebrow="Our values"
        headline="Built on principles that matter."
        subheadline={
          <p>
            Every decision we make is guided by these core principles — from feature design 
            to data handling to how we price our product.
          </p>
        }
        features={
          <>
            <Feature
              icon={<BeakerIcon />}
              headline="Science-Backed"
              subheadline={
                <p>
                  Every feature is grounded in cognitive science research. Our ORP algorithm, pause 
                  timing, and speed recommendations are all based on peer-reviewed studies.
                </p>
              }
            />
            <Feature
              icon={<LockIcon />}
              headline="Privacy-First"
              subheadline={
                <p>
                  Free users&apos; data never leaves their device. Pro users&apos; data is encrypted and 
                  never sold. We make money from subscriptions, not your personal information.
                </p>
              }
            />
            <Feature
              icon={<CodeSquareIcon />}
              headline="Open Core"
              subheadline={
                <p>
                  The core RSVP engine is MIT licensed and open source. We believe in transparency and 
                  giving back to the community that made this possible.
                </p>
              }
            />
          </>
        }
      />

      {/* Technology */}
      <FeaturesThreeColumn
        id="technology"
        eyebrow="Technology"
        headline="Built with modern tools."
        subheadline={
          <p>
            FlashRead is built on a foundation of proven, modern technologies — ensuring reliability, 
            performance, and a great user experience across all devices.
          </p>
        }
        features={
          <>
            <Feature
              headline="Chrome Extension"
              subheadline={<p>Manifest V3, TypeScript, Vite — built for performance and security.</p>}
            />
            <Feature
              headline="Content Extraction"
              subheadline={<p>Mozilla Readability — the same tech behind Firefox Reader View.</p>}
            />
            <Feature
              headline="AI Voice"
              subheadline={<p>ElevenLabs TTS — natural-sounding voice narration synced to your reading.</p>}
            />
            <Feature
              headline="AI Summaries"
              subheadline={<p>OpenAI GPT-4o-mini — fast, accurate article summarization.</p>}
            />
            <Feature
              headline="Website"
              subheadline={<p>Next.js 15, Tailwind CSS v4 — modern React with server components.</p>}
            />
            <Feature
              headline="Backend"
              subheadline={<p>Supabase Auth, Postgres, Stripe — secure and scalable infrastructure.</p>}
            />
          </>
        }
      />

      {/* Call To Action */}
      <CallToActionSimple
        id="cta"
        headline="Ready to read faster?"
        subheadline={
          <p>
            Join thousands of readers who&apos;ve upgraded their reading speed. 
            Install the free extension and start your speed reading journey today.
          </p>
        }
        cta={
          <div className="flex items-center gap-4">
            <ButtonLink href="https://chrome.google.com/webstore" target="_blank" size="lg">
              Install Free Extension
            </ButtonLink>
            <PlainButtonLink href="/pricing" size="lg">
              See Pro Features <ChevronIcon />
            </PlainButtonLink>
          </div>
        }
      />
    </>
  )
}
