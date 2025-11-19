#!/usr/bin/env node

/**
 * CSP Validation Script
 *
 * This script validates Content Security Policy effectiveness by:
 * 1. Launching a headless browser
 * 2. Navigating to the preview server at localhost:4173
 * 3. Listening for CSP violation reports
 * 4. Attempting to execute inline scripts
 * 5. Reporting whether CSP is working correctly
 */

const puppeteer = require('puppeteer');

const PREVIEW_URL = 'http://localhost:4173';
const TIMEOUT = 10000; // 10 seconds

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function validateCSP() {
  let browser;
  let violations = [];
  let inlineScriptAttempted = false;
  let inlineScriptBlocked = false;

  try {
    log('\n=== CSP Validation Script ===\n', 'cyan');
    log(`Launching headless browser...`, 'blue');

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Set up a handler for console messages to capture CSP-related logs
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('CSP') || text.includes('violation') || text.includes('Refused')) {
        log(`[Console] ${text}`, 'yellow');
      }
    });

    // Listen for CSP violation reports
    page.on('requestfailed', (request) => {
      const failure = request.failure();
      if (failure.errorText.includes('CSP') || failure.errorText.includes('blocked')) {
        violations.push({
          url: request.url(),
          error: failure.errorText,
          type: 'request_blocked',
        });
      }
    });

    // Listen for page errors (including CSP violations)
    page.on('error', (error) => {
      if (error.message.includes('CSP') || error.message.includes('Refused')) {
        violations.push({
          error: error.message,
          type: 'page_error',
        });
      }
    });

    // Set up a listener for CSP violation reports sent to the console
    page.evaluateOnNewDocument(() => {
      window.__cspViolations = [];

      // Listen for CSP violation events
      document.addEventListener('securitypolicyviolation', (event) => {
        window.__cspViolations.push({
          blockedURI: event.blockedURI,
          violatedDirective: event.violatedDirective,
          originalPolicy: event.originalPolicy,
          disposition: event.disposition,
          timestamp: new Date().toISOString(),
        });

        // Log to console for visibility
        console.warn('[CSP Violation]', {
          blockedURI: event.blockedURI,
          violatedDirective: event.violatedDirective,
          disposition: event.disposition,
        });
      });
    });

    log(`Navigating to ${PREVIEW_URL}...`, 'blue');

    try {
      await page.goto(PREVIEW_URL, {
        waitUntil: 'networkidle2',
        timeout: TIMEOUT,
      });
    } catch (error) {
      if (error.name === 'TimeoutError') {
        log(`Warning: Navigation timed out (${TIMEOUT}ms), continuing with validation...`, 'yellow');
      } else {
        throw error;
      }
    }

    log('Page loaded successfully', 'green');

    // Get the CSP meta tag or header info
    const cspInfo = await page.evaluate(() => {
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      return {
        metaCSP: cspMeta ? cspMeta.getAttribute('content') : 'Not found in meta',
        hasMeta: !!cspMeta,
      };
    });

    log('\n--- CSP Configuration ---', 'blue');
    if (cspInfo.hasMeta) {
      log(`CSP Meta Tag: ${cspInfo.metaCSP}`, 'green');
    } else {
      log('No CSP meta tag found (may be set via HTTP header)', 'yellow');
    }

    // Attempt to execute an inline script
    log('\n--- Testing Inline Script Execution ---', 'blue');
    log('Attempting to execute inline script...', 'yellow');

    inlineScriptAttempted = true;
    const inlineScriptResult = await page.evaluate(() => {
      try {
        // Attempt to create and execute an inline script
        const script = document.createElement('script');
        script.textContent = 'window.__inlineScriptExecuted = true;';
        document.head.appendChild(script);

        return {
          executed: typeof window.__inlineScriptExecuted !== 'undefined',
          blocked: typeof window.__inlineScriptExecuted === 'undefined',
        };
      } catch (error) {
        return {
          executed: false,
          blocked: true,
          error: error.message,
        };
      }
    });

    inlineScriptBlocked = inlineScriptResult.blocked;

    if (inlineScriptResult.executed) {
      log('Inline script executed (CSP may not be properly configured)', 'red');
    } else {
      log('Inline script blocked by CSP (CSP working correctly)', 'green');
    }

    // Retrieve collected CSP violations
    const cspViolations = await page.evaluate(() => {
      return window.__cspViolations || [];
    });

    if (cspViolations.length > 0) {
      violations = violations.concat(cspViolations);
    }

    // Wait a bit to allow any CSP reports to be processed
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if there are any additional CSP violations
    const finalViolations = await page.evaluate(() => {
      return window.__cspViolations || [];
    });

    // Report Results
    log('\n--- CSP Validation Results ---', 'blue');

    if (finalViolations.length > 0) {
      log(`\nCSP Violations Detected: ${finalViolations.length}`, 'green');
      finalViolations.forEach((violation, index) => {
        log(`\n  Violation #${index + 1}:`, 'cyan');
        log(`  - Blocked URI: ${violation.blockedURI}`, 'yellow');
        log(`  - Directive: ${violation.violatedDirective}`, 'yellow');
        log(`  - Disposition: ${violation.disposition}`, 'yellow');
      });
    } else {
      log(`\nNo CSP violations detected on page load`, 'yellow');
    }

    // Final assessment
    log('\n--- Final Assessment ---', 'blue');

    const isCspWorking = inlineScriptBlocked && (cspInfo.hasMeta || finalViolations.length > 0);

    if (isCspWorking) {
      log('CSP Status: WORKING CORRECTLY ✓', 'green');
      log('- Inline scripts are being blocked', 'green');
      log('- CSP policy is in place and enforced', 'green');
    } else if (!inlineScriptBlocked && finalViolations.length > 0) {
      log('CSP Status: PARTIALLY WORKING', 'yellow');
      log('- Inline scripts were executed but CSP violations were recorded', 'yellow');
    } else if (!inlineScriptBlocked && !cspInfo.hasMeta) {
      log('CSP Status: NOT CONFIGURED', 'red');
      log('- No CSP meta tag or inline script blocking detected', 'red');
      log('- CSP may be missing or not properly configured', 'red');
    } else {
      log('CSP Status: UNCERTAIN', 'yellow');
      log('- Unable to definitively determine CSP effectiveness', 'yellow');
    }

    // Summary
    log('\n--- Summary ---', 'blue');
    log(`URL Tested: ${PREVIEW_URL}`, 'cyan');
    log(`CSP Meta Tag Present: ${cspInfo.hasMeta}`, 'cyan');
    log(`Inline Script Attempted: ${inlineScriptAttempted}`, 'cyan');
    log(`Inline Script Blocked: ${inlineScriptBlocked}`, 'cyan');
    log(`Total CSP Violations: ${finalViolations.length}`, 'cyan');

    await browser.close();

    // Exit with appropriate code
    process.exit(isCspWorking ? 0 : 1);

  } catch (error) {
    log(`\nError during validation: ${error.message}`, 'red');
    log(error.stack, 'red');

    if (browser) {
      await browser.close();
    }

    process.exit(1);
  }
}

// Run the validation
validateCSP();
