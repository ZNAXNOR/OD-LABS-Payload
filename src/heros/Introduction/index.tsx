import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

import TextType from '@/components/TextType'

import { UserRound, ArrowDown, ArrowRight, MapPinHouse } from 'lucide-react'

type IntroductionHeroProps = Page['hero']

export const IntroductionHero: React.FC<IntroductionHeroProps> = (props) => {
  const {
    introductionEyebrow,
    introductionHeader,
    introductionPhrases,
    introductionDescription,
    introductionAICTA,
    introductionPortrait,
    introductionLocation,
  } = props

  const eyebrowPhrases =
    introductionEyebrow?.filter(
      (phrase): phrase is string =>
        typeof phrase === 'string' && phrase.trim().length > 0,
    ) ?? []

  const phrases =
    introductionPhrases?.filter(
      (phrase): phrase is string =>
        typeof phrase === 'string' && phrase.trim().length > 0,
    ) ?? []

  return (
    <section className="relative isolate mb-4 overflow-hidden">
      <div className="relative z-10 container grid min-h-[75vh] grid-cols-1 items-center gap-12 py-8 lg:grid-cols-12 lg:gap-8 xl:gap-12">
        {/* Left: Content */}
        <div className="min-w-0 lg:col-span-8">
          {/* Eyebrow */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs font-medium tracking-[0.18em] text-white/45 uppercase">
              <span className="bg-odl size-2 shrink-0" aria-hidden="true" />

              {eyebrowPhrases.map((phrase, index) => (
                <React.Fragment key={`${phrase}-${index}`}>
                  {index > 1 && (
                    <span className="text-odl" aria-hidden="true">
                      •
                    </span>
                  )}

                  <span className={index === 0 ? 'text-odl' : 'text-white/60'}>
                    {index === 0 ? `01 — ${phrase} //` : phrase}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-5xl leading-[1.04] font-bold tracking-[-0.04em] text-[#F4F4F0] sm:text-7xl lg:text-8xl">
              {introductionHeader}
            </h1>

            <div className="flex flex-wrap items-baseline gap-x-3.5 text-3xl leading-[1.15] font-medium tracking-[-0.03em] text-zinc-400 sm:text-5xl lg:text-6xl">
              <span>I build</span>

              <TextType
                as="span"
                text={
                  phrases.length > 0
                    ? phrases
                    : ['Websites', 'AI Systems', 'Cloud Solutions']
                }
                className="border-b border-zinc-600 pb-0.5 font-semibold text-zinc-200"
                typingSpeed={75}
                deletingSpeed={35}
                pauseDuration={1800}
                initialDelay={300}
                cursorStyle="bar"
                cursorColor="#FF3B30"
                cursorBlinkDuration={0.5}
                typeEffect="rise"
                loop
                mistakes={0}
              />
            </div>
          </div>
          {introductionDescription && (
            <p className="mt-8 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              {introductionDescription}
            </p>
          )}
          {introductionAICTA && (
            <a
              href={introductionAICTA.link?.url || '/ai'}
              target={introductionAICTA.link?.newTab ? '_blank' : undefined}
              rel={
                introductionAICTA.link?.newTab
                  ? 'noopener noreferrer'
                  : undefined
              }
              className="group hover:border-odl/70 mt-8 flex max-w-lg items-center justify-between gap-6 border border-white/15 p-5 transition-colors"
            >
              <div>
                <h2 className="text-base font-medium text-zinc-200">
                  {introductionAICTA.label || 'Explore my AI interface'}
                </h2>
                {introductionAICTA.description && (
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    {introductionAICTA.description}
                  </p>
                )}
              </div>

              <span
                aria-hidden="true"
                className="group-hover:text-odl shrink-0 text-xl text-white/60 transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          )}
          {Array.isArray(props.links) && props.links.length > 0 && (
            <ul className="group mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              {props.links.map(({ link }, index) => (
                <li key={index}>
                  <CMSLink
                    {...link}
                    appearance="inline"
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 underline decoration-white/30 underline-offset-8 transition-colors group-hover:text-white"
                  >
                    <ArrowRight
                      size={18}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="group-hover:text-odl shrink-0 transition-transform duration-200 text-shadow-zinc-300 group-hover:translate-x-1"
                    />
                  </CMSLink>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Right: Portrait */}
        <div className="relative mx-auto w-full max-w-90 lg:col-span-4 lg:mx-0 lg:ml-auto">
          <div className="relative border border-zinc-800 bg-zinc-900 p-3 transition-colors duration-200 hover:border-zinc-700">
            {/* Decorative corner accents */}
            <span className="border-odl absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2" />
            <span className="border-odl absolute right-0 bottom-0 h-5 w-5 border-r-2 border-b-2" />

            {introductionPortrait &&
              typeof introductionPortrait === 'object' && (
                <div className="relative aspect-3/4 overflow-hidden border border-zinc-800 bg-zinc-950">
                  <Media
                    fill
                    priority
                    resource={introductionPortrait}
                    imgClassName="object-cover grayscale contrast-110 transition-all duration-500 hover:grayscale-0"
                  />
                </div>
              )}

            {introductionPortrait &&
              typeof introductionPortrait === 'object' && (
                <div className="flex flex-col gap-2 px-1 pt-4 pb-1">
                  <div className="flex items-center gap-2">
                    <UserRound
                      size={14}
                      strokeWidth={1.5}
                      className="text-odl shrink-0"
                      aria-hidden="true"
                    />
                    <p className="font-mono text-xs font-semibold tracking-[0.12em] text-zinc-200 uppercase">
                      {introductionPortrait.alt || 'Omkar Dalvi'}
                    </p>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
      <div className="container flex items-center justify-between border-b border-white/10 py-5">
        <a
          href="#work"
          className="group mb-8 inline-flex items-center gap-3 font-mono text-sm tracking-[0.2em] text-white/50 uppercase transition-colors hover:text-white"
        >
          <span>Scroll down</span>
          <ArrowDown
            size={18}
            strokeWidth={1.5}
            className="group-hover:text-odl transition-transform duration-200 group-hover:translate-y-1"
            aria-hidden="true"
          />
        </a>

        <div className="mb-8 flex items-center gap-2">
          <MapPinHouse
            size={18}
            strokeWidth={1.5}
            className="text-white/60"
            aria-hidden="true"
          />
          <p className="font-mono text-sm tracking-[0.2em] text-white/60 uppercase">
            {introductionLocation || 'Vashi, Navi Mumbai, Maharashtra, India'}
          </p>
        </div>
      </div>
    </section>
  )
}
