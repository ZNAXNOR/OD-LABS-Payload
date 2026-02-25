import React from 'react'

export const DecorativeSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="22"
    height="20"
    viewBox="0 0 22 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M-0.0078125 0.867188H21.1133V4.89062H2.00391C0.892865 4.89062 -0.0078125 3.98995 -0.0078125 2.87891V0.867188Z"
      fill="currentColor"
    />
    <path
      d="M16.9316 0.867188H21.1133V19.9404H19.0225C17.8677 19.9404 16.9316 19.0043 16.9316 17.8496V0.867188Z"
      fill="currentColor"
    />
  </svg>
)

export const ChevronsUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="m17 11-5-5-5 5" />
    <path d="m17 18-5-5-5 5" />
  </svg>
)
