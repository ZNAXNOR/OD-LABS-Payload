module.exports = {
  ci: {
    collect: {
      url: [process.env.LHCI_URL || 'https://odtechlab.com/'],
      numberOfRuns: 3,
      settings: {
        formFactor: 'mobile',
        throttlingMethod: 'simulate',
        screenEmulation: {
          mobile: true,
          width: 390,
          height: 844,
          deviceScaleFactor: 1,
          disabled: false,
        },
        chromeFlags: ['--no-sandbox', '--headless'],
      },
    },
    assert: {
      // Begin with warnings while we establish a stable production baseline.
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'total-blocking-time': ['warn', { maxNumericValue: 500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
    },
  },
}
