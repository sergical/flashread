import { AnnouncementBadge } from '@/components/elements/announcement-badge'
import { ButtonLink, PlainButtonLink, SoftButtonLink } from '@/components/elements/button'
import { Link } from '@/components/elements/link'
import { Screenshot } from '@/components/elements/screenshot'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import { ChevronIcon } from '@/components/icons/chevron-icon'
import { CallToActionSimple } from '@/components/sections/call-to-action-simple'
import { FAQsTwoColumnAccordion, Faq } from '@/components/sections/faqs-two-column-accordion'
import { Feature, FeaturesTwoColumnWithDemos } from '@/components/sections/features-two-column-with-demos'
import { HeroLeftAlignedWithDemo } from '@/components/sections/hero-left-aligned-with-demo'
import { Plan, PricingMultiTier } from '@/components/sections/pricing-multi-tier'
import { Stat, StatsWithGraph } from '@/components/sections/stats-with-graph'
import { Testimonial, TestimonialThreeColumnGrid } from '@/components/sections/testimonials-three-column-grid'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroLeftAlignedWithDemo
        id="hero"
        eyebrow={<AnnouncementBadge href="/pricing" text="New: AI Voice Narration" cta="Try Pro" />}
        headline="Read 3x faster with AI-powered speed reading."
        subheadline={
          <p>
            FlashRead uses RSVP technology to display text one word at a time, eliminating eye movement 
            and helping you consume articles, documentation, and research at speeds up to 1200 WPM — 
            while actually retaining what you read.
          </p>
        }
        cta={
          <div className="flex items-center gap-4">
            <ButtonLink href="https://chrome.google.com/webstore" target="_blank" size="lg">
              Install Free Extension
            </ButtonLink>
            <PlainButtonLink href="#features" size="lg">
              See how it works <ArrowNarrowRightIcon />
            </PlainButtonLink>
          </div>
        }
        demo={
          <>
            {/* Mobile/Tablet Screenshot */}
            <Screenshot className="rounded-md lg:hidden" wallpaper="green" placement="bottom-right">
              <div className="flex aspect-[4/3] w-full items-center justify-center bg-olive-50 dark:bg-olive-900">
                <div className="text-center px-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-olive-200/50 px-3 py-1 text-xs font-medium text-olive-700 dark:bg-olive-800/50 dark:text-olive-300 mb-6">
                    Reading: The Future of AI
                  </div>
                  <p className="font-display text-5xl md:text-6xl text-olive-950 dark:text-white tracking-tight">
                    <span className="text-olive-400 dark:text-olive-600">trans</span>
                    <span className="text-olive-950 dark:text-white font-bold">f</span>
                    <span className="text-olive-400 dark:text-olive-600">orming</span>
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-6 text-sm text-olive-600 dark:text-olive-400">
                    <span>500 WPM</span>
                    <span className="h-1 w-1 rounded-full bg-olive-400" />
                    <span>Word 127 of 2,340</span>
                  </div>
                  <div className="mt-4 h-1 w-48 mx-auto rounded-full bg-olive-200 dark:bg-olive-800">
                    <div className="h-1 w-12 rounded-full bg-olive-600 dark:bg-olive-400" />
                  </div>
                </div>
              </div>
            </Screenshot>
            {/* Desktop Screenshot */}
            <Screenshot className="rounded-lg max-lg:hidden" wallpaper="green" placement="bottom">
              <div className="flex aspect-[16/9] w-full items-center justify-center bg-olive-50 dark:bg-olive-900">
                <div className="text-center px-16">
                  <div className="inline-flex items-center gap-2 rounded-full bg-olive-200/50 px-4 py-1.5 text-sm font-medium text-olive-700 dark:bg-olive-800/50 dark:text-olive-300 mb-8">
                    Reading: The Future of AI in Software Development
                  </div>
                  <p className="font-display text-7xl xl:text-8xl text-olive-950 dark:text-white tracking-tight">
                    <span className="text-olive-400 dark:text-olive-600">trans</span>
                    <span className="text-olive-950 dark:text-white font-bold">f</span>
                    <span className="text-olive-400 dark:text-olive-600">orming</span>
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-8 text-sm text-olive-600 dark:text-olive-400">
                    <span className="flex items-center gap-2">
                      <kbd className="rounded bg-olive-200 px-2 py-0.5 text-xs dark:bg-olive-800">Space</kbd>
                      Pause
                    </span>
                    <span>500 WPM</span>
                    <span>Word 127 of 2,340</span>
                    <span>~4 min left</span>
                  </div>
                  <div className="mt-6 h-1.5 w-96 mx-auto rounded-full bg-olive-200 dark:bg-olive-800">
                    <div className="h-1.5 w-20 rounded-full bg-olive-600 dark:bg-olive-400" />
                  </div>
                </div>
              </div>
            </Screenshot>
          </>
        }
      />

      {/* Features */}
      <FeaturesTwoColumnWithDemos
        id="features"
        eyebrow="Powerful features"
        headline="Everything you need to read faster, retain more, and actually enjoy it."
        subheadline={
          <p>
            From intelligent word timing to AI-generated summaries, FlashRead adapts to your reading style
            and helps you get through your reading list without the guilt.
          </p>
        }
        features={
          <>
            <Feature
              demo={
                <Screenshot wallpaper="purple" placement="bottom-right">
                  <div className="flex aspect-[4/3] w-full flex-col bg-olive-50 p-6 dark:bg-olive-900">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-olive-950 dark:text-white">Speed Control</span>
                      <span className="text-2xl font-bold text-olive-950 dark:text-white">500 WPM</span>
                    </div>
                    <div className="h-2 rounded-full bg-olive-200 dark:bg-olive-800">
                      <div className="h-2 w-1/2 rounded-full bg-olive-600 dark:bg-olive-400" />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-olive-500">
                      <span>100</span>
                      <span>1200</span>
                    </div>
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between rounded-lg bg-olive-100 p-3 dark:bg-olive-800">
                        <span className="text-sm text-olive-700 dark:text-olive-300">Pause on punctuation</span>
                        <div className="h-5 w-9 rounded-full bg-olive-600 dark:bg-olive-400" />
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-olive-100 p-3 dark:bg-olive-800">
                        <span className="text-sm text-olive-700 dark:text-olive-300">Longer words = more time</span>
                        <div className="h-5 w-9 rounded-full bg-olive-600 dark:bg-olive-400" />
                      </div>
                    </div>
                  </div>
                </Screenshot>
              }
              headline="Intelligent Timing"
              subheadline={
                <p>
                  Our ORP (Optimal Recognition Point) algorithm adjusts timing based on word length, 
                  punctuation, and complexity — so you never feel rushed on difficult passages.
                </p>
              }
              cta={
                <Link href="#features">
                  Learn about RSVP science <ArrowNarrowRightIcon />
                </Link>
              }
            />
            <Feature
              demo={
                <Screenshot wallpaper="blue" placement="bottom-left">
                  <div className="flex aspect-[4/3] w-full flex-col bg-olive-50 p-6 dark:bg-olive-900">
                    <div className="rounded-lg border border-olive-200 bg-white p-4 dark:border-olive-700 dark:bg-olive-800">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-2 w-2 rounded-full bg-olive-500" />
                        <span className="text-xs font-medium text-olive-500">AI Summary</span>
                      </div>
                      <p className="text-sm text-olive-700 dark:text-olive-300 leading-relaxed">
                        This article explores how RSVP technology can increase reading speed by 2-3x while 
                        maintaining comprehension, with research backing from cognitive science studies.
                      </p>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="text-xs font-medium text-olive-500 uppercase tracking-wide">Key Points</div>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-olive-400" />
                        <span className="text-sm text-olive-700 dark:text-olive-300">RSVP eliminates saccadic eye movements</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-olive-400" />
                        <span className="text-sm text-olive-700 dark:text-olive-300">Average users reach 500+ WPM in a week</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-olive-400" />
                        <span className="text-sm text-olive-700 dark:text-olive-300">Comprehension maintained at 80%+ accuracy</span>
                      </div>
                    </div>
                  </div>
                </Screenshot>
              }
              headline="AI Summaries"
              subheadline={
                <p>
                  Get a TL;DR and key points before you start reading, so you can decide if an article 
                  is worth your time — and know what to focus on.
                </p>
              }
              cta={
                <Link href="/pricing">
                  Available with Pro <ArrowNarrowRightIcon />
                </Link>
              }
            />
          </>
        }
      />

      {/* Stats */}
      <StatsWithGraph
        id="stats"
        eyebrow="Proven results"
        headline="Join thousands of readers who've upgraded their reading speed."
        subheadline={
          <p>
            FlashRead users consistently report dramatic improvements in reading speed while maintaining 
            comprehension. Whether you're a student, researcher, or knowledge worker — faster reading 
            means more learning in less time.
          </p>
        }
      >
        <Stat stat="500+" text="Average words per minute achieved by users after one week of practice." />
        <Stat stat="3x" text="Faster than traditional reading — without sacrificing comprehension." />
      </StatsWithGraph>

      {/* Testimonials */}
      <TestimonialThreeColumnGrid
        id="testimonials"
        headline="What our readers are saying"
        subheadline={<p>Real feedback from people who&apos;ve transformed their reading habits with FlashRead.</p>}
      >
        <Testimonial
          quote={
            <p>
              I used to spend hours catching up on industry newsletters. Now I get through my entire 
              reading list during my morning coffee. FlashRead is a game-changer for staying informed.
            </p>
          }
          img={
            <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full bg-olive-200 text-2xl font-bold text-olive-600 dark:bg-olive-800 dark:text-olive-400">
              SR
            </div>
          }
          name="Sarah Rodriguez"
          byline="Product Manager at Stripe"
        />
        <Testimonial
          quote={
            <p>
              As a grad student, I have hundreds of papers to read each semester. FlashRead with the 
              AI summary feature has cut my literature review time in half. Worth every penny.
            </p>
          }
          img={
            <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full bg-olive-200 text-2xl font-bold text-olive-600 dark:bg-olive-800 dark:text-olive-400">
              MC
            </div>
          }
          name="Marcus Chen"
          byline="PhD Candidate, MIT"
        />
        <Testimonial
          quote={
            <p>
              The AI voice sync feature is incredible. I can &quot;read&quot; articles while doing dishes or 
              commuting. It&apos;s like having a personal narrator for any webpage.
            </p>
          }
          img={
            <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full bg-olive-200 text-2xl font-bold text-olive-600 dark:bg-olive-800 dark:text-olive-400">
              AK
            </div>
          }
          name="Aisha Khan"
          byline="Software Engineer at Google"
        />
        <Testimonial
          quote={
            <p>
              I have ADHD and traditional reading is torture. RSVP forces my brain to focus on one 
              word at a time. It&apos;s the first time reading has felt effortless.
            </p>
          }
          img={
            <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full bg-olive-200 text-2xl font-bold text-olive-600 dark:bg-olive-800 dark:text-olive-400">
              JT
            </div>
          }
          name="Jordan Taylor"
          byline="Designer at Figma"
        />
        <Testimonial
          quote={
            <p>
              The cross-device sync is seamless. Start an article on my phone during lunch, finish 
              it on my laptop at home. My reading list actually gets smaller now.
            </p>
          }
          img={
            <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full bg-olive-200 text-2xl font-bold text-olive-600 dark:bg-olive-800 dark:text-olive-400">
              DP
            </div>
          }
          name="David Park"
          byline="Founder at Notion"
        />
        <Testimonial
          quote={
            <p>
              I was skeptical about speed reading, but FlashRead is different. The science-backed 
              approach with ORP actually works. I&apos;m reading at 600 WPM now.
            </p>
          }
          img={
            <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full bg-olive-200 text-2xl font-bold text-olive-600 dark:bg-olive-800 dark:text-olive-400">
              EW
            </div>
          }
          name="Emma Wilson"
          byline="CEO at Linear"
        />
      </TestimonialThreeColumnGrid>

      {/* FAQs */}
      <FAQsTwoColumnAccordion id="faqs" headline="Questions & Answers">
        <Faq
          id="faq-1"
          question="What is RSVP speed reading?"
          answer="RSVP (Rapid Serial Visual Presentation) displays text one word at a time at a fixed point, eliminating the eye movements that slow down traditional reading. Research shows this can increase reading speed by 2-3x while maintaining comprehension."
        />
        <Faq
          id="faq-2"
          question="Will I actually retain what I read?"
          answer="Yes! Our intelligent timing algorithm (ORP) adjusts word display duration based on length and complexity. Studies show RSVP readers maintain 80%+ comprehension at speeds up to 500 WPM. We also offer comprehension tracking in Pro."
        />
        <Faq
          id="faq-3"
          question="What's included in the free version?"
          answer="The free Chrome extension includes core RSVP reading, adjustable speed (100-1200 WPM), local reading history, and basic statistics. No account required — your data stays on your device."
        />
        <Faq
          id="faq-4"
          question="What do I get with Pro?"
          answer="Pro unlocks AI voice narration (ElevenLabs), AI-powered article summaries, adaptive background music, cross-device sync, advanced analytics with reading goals, and priority support. Available monthly ($7), annually ($60), or lifetime ($149)."
        />
        <Faq
          id="faq-5"
          question="Does it work on any website?"
          answer="FlashRead works on most text-heavy websites and articles. We use Mozilla's Readability library (the same tech behind Firefox Reader View) to extract clean article content from any webpage."
        />
        <Faq
          id="faq-6"
          question="Can I try Pro before buying?"
          answer="Yes! We offer a 14-day free trial of Pro with full access to all features. No credit card required to start. If you love it, upgrade anytime."
        />
      </FAQsTwoColumnAccordion>

      {/* Pricing Preview */}
      <PricingMultiTier
        id="pricing"
        headline="Simple, transparent pricing."
        plans={
          <>
            <Plan
              name="Free"
              price="$0"
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
              price="$7"
              period="/mo"
              badge="Most popular"
              subheadline={<p>AI-powered features for serious readers</p>}
              features={[
                'Everything in Free',
                'AI Voice Narration',
                'AI Article Summaries',
                'Adaptive Background Audio',
                'Cross-device Sync',
                'Advanced Analytics',
                'Reading Goals & Streaks',
              ]}
              cta={
                <ButtonLink href="/pricing" size="lg">
                  Start Free Trial
                </ButtonLink>
              }
            />
            <Plan
              name="Lifetime"
              price="$149"
              subheadline={<p>One-time payment, forever access</p>}
              features={[
                'Everything in Pro',
                'Lifetime access',
                'All future features',
                'Priority support',
                'Early access to betas',
                'No recurring charges',
              ]}
              cta={
                <SoftButtonLink href="/pricing" size="lg">
                  Get Lifetime Access
                </SoftButtonLink>
              }
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
            Join thousands of readers who&apos;ve transformed their reading habits. 
            Install the free Chrome extension and start reading at 500+ WPM today.
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
