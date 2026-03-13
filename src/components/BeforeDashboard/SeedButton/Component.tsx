import React from 'react'
import { SeedButton } from './index'

import { SquareArrowOutUpRight, Sprout } from 'lucide-react'

export const SeedButtonInstructions: React.FC = () => {
  return (
    <div className="seed-instructions">
      <div className="seed-content">
        <p className="seed-title">Here’s what to do next</p>

        <ul className="seed-list">
          <li>
            <SeedButton /> with a few pages, posts, and projects
            to jump-start your new site, then{' '}
            <a href="/" target="_blank" rel="noopener noreferrer">
              visit your website
              <SquareArrowOutUpRight width={16} height={16} />
            </a>{' '}
            to see the results.
          </li>
        </ul>

        <div className="seed-footer">
          <p>
            Pro Tip: This is a{' '}
            <a
              href="https://payloadcms.com/docs/custom-components/overview"
              target="_blank"
              rel="noopener noreferrer"
            >
              custom component.
            </a>{' '}
            You can remove this component from the dashboard by removing the SeedButtonInstructions
            component from the BeforeDashboard file.
          </p>
        </div>
      </div>
    </div>
  )
}
