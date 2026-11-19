'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

import TextType from '@/components/TextType'
import Eyebrow from '@/components/Eyebrow'
import { handleSectionScroll } from '@/Rail/Right/sectionScroll'

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

  const heroRef = useRef<HTMLElement>(null)
  const [scrollTargetHref, setScrollTargetHref] = useState<string>('#')

  const getSecondBlock = useCallback((): HTMLElement | null => {
    const heroElement =
      document.getElementById('hero') ??
      heroRef.current?.closest('#hero') ??
      heroRef.current
    const nextSibling = heroElement?.nextElementSibling as HTMLElement | null
    if (nextSibling) return nextSibling

    return document.querySelector('article > div[id]') as HTMLElement | null
  }, [])

  useEffect(() => {
    const secondBlock = getSecondBlock()
    if (secondBlock?.id) {
      setScrollTargetHref(`#${secondBlock.id}`)
    }
  }, [getSecondBlock])

  const handleScrollDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const secondBlock = getSecondBlock()

    if (secondBlock) {
      handleSectionScroll({
        target: secondBlock,
        section: secondBlock.id
          ? { id: secondBlock.id, href: `#${secondBlock.id}` }
          : undefined,
        event,
      })
      return
    }

    event.preventDefault()
    const heroElement =
      document.getElementById('hero') ??
      heroRef.current?.closest('#hero') ??
      heroRef.current
    if (heroElement) {
      const offset = 16
      const heroBottom = heroElement.getBoundingClientRect().bottom + window.scrollY - offset
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({
        top: heroBottom,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
    }
  }

  const phrases =
    introductionPhrases?.filter(
      (phrase): phrase is string =>
        typeof phrase === 'string' && phrase.trim().length > 0,
    ) ?? []

  return (
    <section ref={heroRef} className="relative isolate mb-4 overflow-hidden">
      <div className="relative z-10 container grid min-h-[75vh] grid-cols-1 items-center gap-12 py-8 lg:grid-cols-12 lg:gap-8 xl:gap-12">
        {/* Left: Content */}
        <div className="min-w-0 lg:col-span-8">
          <Eyebrow eyebrow={introductionEyebrow} sectionNumber="01" />

          {/* Heading */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-5xl leading-[1.04] font-bold tracking-[-0.04em] text-text-primary sm:text-7xl lg:text-8xl">
              {introductionHeader}
            </h1>

            <div className="flex flex-wrap items-baseline gap-x-3.5 text-3xl leading-[1.15] font-medium tracking-[-0.03em] text-text-secondary sm:text-5xl lg:text-6xl">
              <span>I build</span>

              <TextType
                as="span"
                text={
                  phrases.length > 0
                    ? phrases
                    : ['Websites', 'AI Systems', 'Cloud Solutions']
                }
                className="border-b border-border-default pb-0.5 font-semibold text-text-primary"
                typingSpeed={75}
                deletingSpeed={35}
                pauseDuration={1800}
                initialDelay={300}
                cursorStyle="bar"
                cursorColor="#E94235"
                cursorBlinkDuration={0.5}
                typeEffect="rise"
                loop
                mistakes={0}
              />
            </div>
          </div>
          {introductionDescription && (
            <p className="mt-8 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
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
              className="group hover:border-odl/70 mt-8 flex max-w-lg items-center justify-between gap-6 border border-border-default p-5 transition-colors"
            >
              <div>
                <h2 className="text-base font-medium text-text-primary">
                  {introductionAICTA.label || 'Explore my AI interface'}
                </h2>
                {introductionAICTA.description && (
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {introductionAICTA.description}
                  </p>
                )}
              </div>

              <span
                aria-hidden="true"
                className="group-hover:text-brand shrink-0 text-xl text-text-secondary transition-transform group-hover:translate-x-1"
              >
                <ArrowRight size={30} />
              </span>
            </a>
          )}
          {Array.isArray(props.links) && props.links.length > 0 && (
            <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              {props.links.map(({ link }, index) => (
                <li key={index}>
                  <CMSLink {...link} />
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Right: Portrait */}
        <div className="relative mx-auto w-full max-w-90 lg:col-span-4 lg:mx-0 lg:ml-auto">
          <div className="relative border border-border-default bg-surface p-3 transition-colors duration-200 hover:border-border-strong">
            {/* Decorative corner accents */}
            <span className="border-odl absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2" />
            <span className="border-odl absolute right-0 bottom-0 h-5 w-5 border-r-2 border-b-2" />

            {introductionPortrait &&
              typeof introductionPortrait === 'object' && (
                <div className="relative aspect-3/4 overflow-hidden border border-border-default bg-surface-inset">
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
                      className="text-brand shrink-0"
                      aria-hidden="true"
                    />
                    <p className="font-mono text-xs font-semibold tracking-[0.12em] text-text-primary uppercase">
                      {introductionPortrait.alt || 'Omkar Dalvi'}
                    </p>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
      <div className="container flex items-center justify-between border-b border-border-default py-5">
        <a
          href={scrollTargetHref}
          onClick={handleScrollDown}
          className="group mb-8 inline-flex items-center gap-3 font-mono text-sm tracking-[0.2em] text-text-muted uppercase transition-colors hover:text-text-primary"
        >
          <span>Scroll down</span>
          <ArrowDown
            size={18}
            strokeWidth={1.5}
            className="group-hover:text-brand transition-transform duration-200 group-hover:translate-y-1"
            aria-hidden="true"
          />
        </a>

        <div className="mb-8 flex items-center gap-2">
          <MapPinHouse
            size={18}
            strokeWidth={1.5}
            className="text-text-secondary"
            aria-hidden="true"
          />
          <p className="font-mono text-sm tracking-[0.2em] text-text-secondary uppercase">
            {introductionLocation || 'Vashi, Navi Mumbai, Maharashtra, India'}
          </p>
        </div>
      </div>
    </section>
  )
}
