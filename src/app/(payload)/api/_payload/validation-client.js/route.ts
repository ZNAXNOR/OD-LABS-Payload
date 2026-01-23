/**
 * API Route for Client-Side Validation Script
 */

export async function GET() {
  const clientScript = `
(function() {
  'use strict';
  
  const CONFIG = {
    enabled: ${process.env.NODE_ENV === 'development'},
    showInBrowser: true,
    debounceDelay: 500
  };
  
  if (!CONFIG.enabled || !CONFIG.showInBrowser) {
    return;
  }
  
  let lastCheck = 0;
  let checkTimeout;
  
  // Validation function
  async function validateIdentifiers() {
    try {
      const response = await fetch('/_payload/validate-identifiers');
      const result = await response.json();
      
      if (result.success && result.warnings.length > 0) {
        console.group('⚠️ Payload Identifier Warnings');
        console.log(result.formatted);
        console.groupEnd();
        
        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Payload CMS: Identifier Warnings', {
            body: \`Found \${result.count.total} identifier warnings\`,
            icon: '/favicon.ico',
            tag: 'payload-validation'
          });
        }
      }
      
      lastCheck = Date.now();
    } catch (error) {
      console.warn('Payload identifier validation failed:', error);
    }
  }
  
  // Debounced validation
  function scheduleValidation() {
    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(validateIdentifiers, CONFIG.debounceDelay);
  }
  
  // Initial validation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleValidation);
  } else {
    scheduleValidation();
  }
  
  // Periodic validation (every 30 seconds)
  setInterval(() => {
    if (Date.now() - lastCheck > 30000) {
      scheduleValidation();
    }
  }, 30000);
  
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  
  // Add global validation function
  window.validatePayloadIdentifiers = async () => {
    try {
      const response = await fetch('/_payload/validate-identifiers');
      const result = await response.json();
      
      if (result.success) {
        console.log(result.formatted);
        return result.warnings;
      } else {
        console.error('Validation failed:', result.error);
      }
    } catch (error) {
      console.error('Validation request failed:', error);
    }
  };
  
  console.log('🔍 Payload identifier validation enabled');
  console.log('💡 Run validatePayloadIdentifiers() to check identifier compliance');
})();
`

  return new Response(clientScript, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache',
    },
  })
}
