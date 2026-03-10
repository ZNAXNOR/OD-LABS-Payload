import React from 'react'

const css = `
  .graphic-logo {
    width: 300px;
    height: auto;
  }
    
  .inter-heavy {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 100px;
    user-select: none;
  }

  .logo-text {
    fill: black;
  }

  .logo-rect {
    stroke: black;
  }

  html[data-theme="dark"] .logo-text {
    fill: white;
  }

  html[data-theme="dark"] .logo-rect {
    stroke: white;
  }
`

export const Logo = () => {
  return (
    <svg
      className="graphic-logo"
      xmlns="http://www.w3.org/2000/svg"
      width="480"
      height="150"
      viewBox="0 0 600 150"
      fill="none"
    >
      <style>{css}</style>

      <text x="7%" y="75%" className="inter-heavy logo-text">
        OD
      </text>

      <text x="42%" y="75%" className="inter-heavy logo-text">
        LABS
      </text>

      <rect
        x="37%"
        y="5%"
        rx="10"
        ry="10"
        width="330"
        height="135"
        strokeWidth="15"
        className="logo-rect"
        fill="none"
      />
    </svg>
  )
}
