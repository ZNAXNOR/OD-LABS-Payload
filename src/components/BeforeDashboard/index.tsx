import React from 'react'
import Image from 'next/image'
import { SeedButtonInstructions } from './SeedButton/Component'
import { HeroCTA } from './HeroCTA'

import type { Payload } from 'payload'
import type { User } from '@/payload-types'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC<{ payload: Payload; user: User }> = ({ payload, user }) => {
  const displayName = user?.name || user?.email

  return (
    <div className={baseClass}>
      <div className="hero-background">
        <Image
          src="/admin/hero-image.webp"
          alt="Dashboard Background"
          fill
          sizes="100vw"
          className="hero-image"
          priority
        />
        <div className="hero-overlay" />
      </div>

      <div className="hero-container">
        <h1 className="hero-title">
          Welcome back,
          <span className="user-name-gradient">{displayName}</span>
        </h1>

        <SeedButtonInstructions />

        <HeroCTA payload={payload} />
      </div>
    </div>
  )
}

export default BeforeDashboard
