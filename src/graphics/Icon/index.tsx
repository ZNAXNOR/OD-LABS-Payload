import React from 'react'

const css = `
  .graphic-icon {
    width: 50px;
    height: 50px;
  }

  .inter-heavy {
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    font-size: 5px;
    user-select: none;
  }`

export const Icon = () => {
  return (
    <svg
      className="graphic-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 22 22"
      fill="none"
    >
      <style>{css}</style>

      <text x="-1%" y="60%" fill="#E94235" className="inter-heavy">
        OD
      </text>
    </svg>
  )
}
