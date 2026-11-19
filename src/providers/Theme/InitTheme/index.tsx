import Script from 'next/script'
import React from 'react'

import { defaultTheme, themeLocalStorageKey } from '../shared'

export const InitTheme: React.FC = () => {
  const script = `
    (function () {
      var validThemes = ['od-dark', 'od-light', 'od-dark-contrast', 'od-light-contrast'];
      var themeToSet = '${defaultTheme}';

      try {
        var preference = window.localStorage.getItem('${themeLocalStorageKey}');
        if (validThemes.indexOf(preference) !== -1) {
          themeToSet = preference;
        } else {
          themeToSet = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'od-dark'
            : 'od-light';
        }
      } catch (error) {
        themeToSet = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'od-dark'
          : 'od-light';
      }

      document.documentElement.setAttribute('data-theme', themeToSet);
    })();
  `

  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{ __html: script }}
      id="theme-script"
      strategy="beforeInteractive"
    />
  )
}
