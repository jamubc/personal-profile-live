# Security Headers & Vulnerability Disclosure Policy

This document outlines the security headers implemented in the 2025 Profile application, their purposes, implementation status, testing procedures, and our vulnerability disclosure policy.

## Table of Contents

- [Security Headers](#security-headers)
- [Implementation Status](#implementation-status)
- [Testing Instructions](#testing-instructions)
- [Security Contact Information](#security-contact-information)
- [Responsible Disclosure Policy](#responsible-disclosure-policy)
- [Security Best Practices](#security-best-practices)
- [Common Vulnerabilities Prevention](#common-vulnerabilities-prevention)

---

## Security Headers

### Overview

Security headers are HTTP response headers that provide additional layers of protection against various web-based attacks. The 2025 Profile application implements security headers via meta tags in the HTML document, as the application is a static/client-side React application served through Vite.

### Implemented Security Headers

#### 1. Content-Security-Policy (CSP)

**Header:**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://img.shields.io data: blob:; connect-src 'self'; frame-ancestors 'none';
```

**Purpose:**
- Prevents Cross-Site Scripting (XSS) attacks by restricting where scripts, styles, and other resources can be loaded from
- Controls inline script execution to prevent injection attacks
- Allows only trusted sources for external resources (Google Fonts, shields.io badges)

**Directives Explained:**
- `default-src 'self'`: Default policy requiring resources from the same origin
- `script-src 'self' 'wasm-unsafe-eval'`: Allows scripts from the same origin and WebAssembly execution (required for React Three Fiber and Three.js)
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`: Allows inline styles (from styled-components/Tailwind) and Google Fonts
- `font-src 'self' https://fonts.gstatic.com`: Restricts font loading to same origin and Google Fonts CDN
- `img-src 'self' https://img.shields.io data: blob:`: Allows images from self, shields.io badges, data URIs, and blob URLs (for canvas rendering)
- `connect-src 'self'`: Restricts API connections to same origin
- `frame-ancestors 'none'`: Prevents the application from being embedded in iframes

**Status:** IMPLEMENTED
**Location:** `/2025-profile/vite.config.js` (lines 6-19)

---

#### 2. X-Frame-Options

**Header:**
```
X-Frame-Options: DENY
```

**Purpose:**
- Prevents clickjacking attacks by preventing the application from being loaded in an iframe
- Ensures the application can only be viewed in its own context

**Options Explained:**
- `DENY`: Disallows embedding in any frame
- Alternative options not used:
  - `SAMEORIGIN`: Would allow framing on the same origin only
  - `ALLOW-FROM uri`: Deprecated, not recommended

**Status:** IMPLEMENTED
**Location:** `/2025-profile/vite.config.js` (line 12)

---

#### 3. X-Content-Type-Options

**Header:**
```
X-Content-Type-Options: nosniff
```

**Purpose:**
- Prevents MIME-type sniffing attacks
- Forces the browser to respect the declared Content-Type instead of guessing
- Protects against attacks where servers serve incorrect file types

**Effect:**
- JavaScript files must be served with `application/javascript` MIME type
- Prevents execution of JavaScript served with incorrect MIME types
- Protects against polyglot file attacks

**Status:** IMPLEMENTED
**Location:** `/2025-profile/vite.config.js` (line 13)

---

#### 4. Referrer-Policy

**Header:**
```
Referrer-Policy: strict-origin-when-cross-origin
```

**Purpose:**
- Controls how much referrer information is sent with requests
- Protects user privacy by limiting information disclosure
- Prevents sensitive information in URLs from leaking to external sites

**Policy Explanation:**
- `strict-origin-when-cross-origin`:
  - For same-origin requests: Sends full referrer
  - For cross-origin requests: Sends only the origin (protocol + domain)
  - On downgrade (HTTPS to HTTP): Sends no referrer
  - Provides good privacy while maintaining necessary functionality

**Status:** IMPLEMENTED
**Location:** `/2025-profile/vite.config.js` (line 14)

---

### Not Implemented Headers (Considered But Not Applicable)

#### Strict-Transport-Security (HSTS)
- **Reason Not Implemented:** Application served through Vite dev server and static hosting. HSTS should be configured at the server/hosting level (nginx, Vercel, Netlify, etc.)
- **Recommendation:** Add to server configuration for production deployments
- **Example:** `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

#### Permissions-Policy
- **Reason Not Implemented:** Application does not use camera, microphone, geolocation, or other restricted features
- **Recommendation:** Add if future features require restricted APIs
- **Example:** `Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()`

#### X-Permitted-Cross-Domain-Policies
- **Reason Not Implemented:** Not a cross-domain Flash/PDF application
- **Recommendation:** Add for production deployments serving mixed content
- **Example:** `X-Permitted-Cross-Domain-Policies: none`

---

## Implementation Status

### Current Implementation

| Header | Status | Location | Notes |
|--------|--------|----------|-------|
| Content-Security-Policy | ✅ Implemented | vite.config.js | Injected via HTML meta tag |
| X-Frame-Options | ✅ Implemented | vite.config.js | Injected via HTML meta tag |
| X-Content-Type-Options | ✅ Implemented | vite.config.js | Injected via HTML meta tag |
| Referrer-Policy | ✅ Implemented | vite.config.js | Injected via HTML meta tag |
| Strict-Transport-Security | ⚠️ Server-Level | deployment config | Configure at hosting level |
| Permissions-Policy | 📋 Not Needed | N/A | Add if restricted APIs used |
| X-Permitted-Cross-Domain-Policies | 📋 Not Needed | N/A | Static SPA, not applicable |

### Build Security Features

| Feature | Status | Location |
|---------|--------|----------|
| Source Maps Disabled | ✅ Implemented | vite.config.js, line 25 |
| Code Minification | ✅ Implemented | vite.config.js, line 26 |
| Console/Debugger Removal | ✅ Implemented | vite.config.js, lines 29-30 |
| Node Modules Lockfile | ✅ Implemented | package-lock.json |
| Dependency Vulnerability Scanning | ✅ Implemented | scripts/security-scan.sh |

---

## Testing Instructions

### 1. Manual Testing with Browser DevTools

#### Test CSP Headers

1. **Open browser DevTools** (F12 or Right-click → Inspect)
2. **Navigate to Network tab**
3. **Reload the page** and click on the HTML document
4. **Look for Response Headers section**
5. **Verify the following meta tags exist in the `<head>` section:**
   - `<meta http-equiv="Content-Security-Policy" ...>`
   - `<meta http-equiv="X-Frame-Options" content="DENY">`
   - `<meta http-equiv="X-Content-Type-Options" content="nosniff">`
   - `<meta name="referrer" content="strict-origin-when-cross-origin">`

#### Test CSP Violations (Inspector Console)

1. **Open Browser Console** (F12 → Console tab)
2. **Try to execute inline script:**
   ```javascript
   // This should be blocked by CSP if injected
   eval('console.log("CSP Test")');
   ```
3. **Verify CSP violation warning appears** in the console
4. **Check the error message** indicates policy violation

#### Test X-Frame-Options

1. **Create a test HTML file:**
   ```html
   <!DOCTYPE html>
   <html>
   <body>
     <h1>Iframe Test</h1>
     <iframe src="http://localhost:5173/" style="width:100%;height:600px;"></iframe>
   </body>
   </html>
   ```
2. **Open this file in the browser**
3. **Verify the iframe does not load** the application
4. **Check DevTools for CSP/Frame violation warnings**

### 2. Automated Testing with Security Headers Scanner

#### Using Online Tools

1. **Scott Helme's Security Headers Tool**
   - Visit: https://securityheaders.com
   - Enter your production domain URL
   - Review all security grades and recommendations
   - Note: Vite dev server cannot be tested with this tool

2. **Mozilla Observatory**
   - Visit: https://observatory.mozilla.org
   - Enter your production domain URL
   - Get detailed security assessment
   - Track improvements over time

#### Using Command-Line Tools

1. **Check with curl for HTTP headers:**
   ```bash
   curl -i https://your-production-domain.com | grep -i "content-security-policy\|x-frame-options\|x-content-type-options\|referrer-policy\|strict-transport-security"
   ```

2. **Using npm security audit:**
   ```bash
   npm audit
   npm audit --audit-level=moderate
   ```

3. **Run the included security scan script:**
   ```bash
   bash scripts/security-scan.sh
   ```

### 3. Security Audit Script Testing

**Run the comprehensive security scan:**

```bash
# From the project root
bash scripts/security-scan.sh
```

**This script performs:**
- NPM dependency vulnerability checks
- Outdated package detection
- ESLint security scanning
- Production build verification
- Source map detection in distribution
- Git security configuration validation
- Node modules integrity checks

**Expected output:**
- All checks should pass with green checkmarks
- No security vulnerabilities should be found
- No source maps should exist in the build output

### 4. Development Verification

#### Verify CSP in Development

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open the application** in your browser

3. **Check the HTML source:**
   ```bash
   # View the injected security headers
   curl http://localhost:5173/ | grep -A 10 "<head>" | grep "meta http-equiv"
   ```

4. **Verify build process:**
   ```bash
   npm run build
   ```

5. **Check build output:**
   ```bash
   # Verify no source maps in dist
   find dist -name "*.map" -o -name "*.js.map" -o -name "*.css.map"

   # Should return nothing if secure
   ```

---

## Security Contact Information

### Reporting Security Vulnerabilities

We take security seriously and appreciate responsible disclosure of security vulnerabilities.

**Security Contact Email:**
```
security@2025-profile.dev
```

**Alternative Contact:**
```
GitHub Issues (Private): Not recommended for security issues
Direct Email: Recommended for all security reports
```

### What to Include in Your Report

When reporting a security vulnerability, please include:

1. **Description of the vulnerability**
   - Type of vulnerability (XSS, CSRF, SQLi, etc.)
   - How the vulnerability can be exploited
   - Potential impact assessment

2. **Steps to reproduce**
   - Clear, detailed steps to trigger the vulnerability
   - Environment details (browser, OS, version)
   - Screenshots or video recordings (if applicable)

3. **Affected components**
   - Which parts of the application are affected
   - Version numbers if applicable
   - Configuration that triggers the issue

4. **Your contact information**
   - Name and affiliation
   - Email address
   - Phone number (optional)

### Security Vulnerability Response Timeline

| Timeline | Action |
|----------|--------|
| Within 24 hours | Acknowledge receipt of vulnerability report |
| Within 7 days | Initial assessment and triage |
| Within 30 days | Release patch or mitigation for critical issues |
| Within 60 days | Release patch or mitigation for non-critical issues |
| Upon publication | Public disclosure coordination |

---

## Responsible Disclosure Policy

### Our Commitment

We are committed to maintaining the security of the 2025 Profile application and protecting our users. We appreciate the work of security researchers who help identify and responsibly disclose security vulnerabilities.

### Guidelines for Security Researchers

#### DO:
- ✅ Report vulnerabilities privately to security@2025-profile.dev
- ✅ Include detailed information about the vulnerability
- ✅ Allow reasonable time for us to respond and patch
- ✅ Avoid public disclosure until a fix is available
- ✅ Test in a safe, isolated environment
- ✅ Use HTTPS for all communications

#### DON'T:
- ❌ Publicly disclose the vulnerability before we have patched
- ❌ Exploit the vulnerability for unauthorized access
- ❌ Modify or delete user data
- ❌ Perform denial-of-service attacks
- ❌ Attempt to access other users' data
- ❌ Test on production systems without authorization

### Coordinated Disclosure Process

1. **Initial Report** (Day 0)
   - Submit vulnerability details to security contact
   - Include reproduction steps and impact assessment

2. **Acknowledgment** (Within 24 hours)
   - We will acknowledge receipt of your report
   - Provide a ticket/reference number
   - Estimate timeline for fix

3. **Investigation** (Days 1-7)
   - We will verify the vulnerability
   - Assess impact and severity
   - Develop a fix
   - Communicate progress

4. **Patch Development** (Days 7-30)
   - Create and test security patch
   - Prepare release notes with mitigation advice
   - Schedule coordinated release

5. **Release & Disclosure** (Day 30+)
   - Publish security patch and update
   - Release security advisory
   - Public disclosure of vulnerability details
   - Credit researcher (if desired)

6. **Post-Disclosure** (Ongoing)
   - Monitor for any exploitation attempts
   - Provide extended support for users
   - Implement additional protections if needed

---

## Security Best Practices

### For Developers

#### 1. Code Security
- Always validate and sanitize user input
- Use parameterized queries for any database operations
- Avoid `eval()` and `innerHTML` with user data
- Use Content Security Policy to mitigate injection attacks
- Keep dependencies updated regularly

#### 2. Dependency Management
```bash
# Regular security audits
npm audit

# Update all packages (test thoroughly)
npm update

# Audit specific package
npm audit --package [package-name]

# Use npm ci for reproducible installs
npm ci
```

#### 3. Build Security
- Never commit `.env` files with secrets
- Always set `sourcemap: false` in production builds
- Minify and obfuscate code in production
- Remove console logs and debugger statements
- Use Content Security Policy in production

#### 4. Testing
- Write security-focused unit tests
- Test CSP violations and error handling
- Use OWASP testing methodologies
- Perform regular penetration testing
- Monitor for known vulnerabilities

### For Operators/DevOps

#### 1. Deployment Security
- Configure HSTS headers at the server level
- Use HTTPS/TLS with valid certificates
- Implement rate limiting and DDoS protection
- Use security headers at both server and application levels
- Enable security monitoring and alerting

#### 2. Server Configuration (nginx example)
```nginx
# Add to your server block
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

#### 3. Server Configuration (Apache example)
```apache
# Add to .htaccess or server config
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
```

#### 4. Monitoring
- Set up alerts for security header violations
- Monitor for abnormal traffic patterns
- Track vulnerability disclosures
- Review security logs regularly
- Maintain incident response procedures

### For Users

#### 1. Account Security
- Use strong, unique passwords
- Enable two-factor authentication (when available)
- Never share your credentials
- Log out when using shared devices

#### 2. Browser Security
- Keep your browser updated
- Use an adblocker and script blocker if desired
- Review browser security settings
- Clear cookies/cache periodically
- Use HTTPS connections

#### 3. Safe Practices
- Verify URLs before entering sensitive data
- Be cautious with email links and attachments
- Report suspicious behavior
- Avoid public WiFi for sensitive transactions

---

## Common Vulnerabilities Prevention

### Cross-Site Scripting (XSS)

**How We Prevent It:**
- Content-Security-Policy blocks inline scripts
- React automatically escapes content in JSX
- No use of `dangerouslySetInnerHTML` without proper sanitization
- Input validation on all user-provided content

**Testing:**
```javascript
// These should be blocked by CSP
const maliciousScript = '<img src=x onerror="alert(\'XSS\')">';
// Should be properly escaped by React
<div>{maliciousScript}</div>
```

### Clickjacking

**How We Prevent It:**
- X-Frame-Options: DENY prevents iframe embedding
- Frame-ancestors CSP directive reinforces this

**Testing:**
```html
<!-- This should not work -->
<iframe src="https://your-app.com"></iframe>
<!-- Browser should refuse to load -->
```

### MIME-Type Sniffing

**How We Prevent It:**
- X-Content-Type-Options: nosniff ensures correct MIME types
- Server must serve files with correct Content-Type headers

**Testing:**
```bash
curl -i https://your-app.com/app.js | grep "Content-Type"
# Should show: application/javascript
```

### Information Disclosure

**How We Prevent It:**
- Referrer-Policy limits referrer information
- Source maps removed from production builds
- Console logs stripped from minified code
- Error messages don't expose internal details

**Testing:**
```bash
# Verify no source maps in production
find dist -name "*.map" -o -name "*.js.map"
# Should return nothing
```

### Dependency Vulnerabilities

**How We Prevent It:**
- Automatic vulnerability scanning with npm audit
- Dependency pinning via package-lock.json
- Regular updates and security patches
- Security-focused ESLint rules enabled

**Testing:**
```bash
# Run security audit
npm audit

# Check for outdated packages
npm outdated

# Run security scan script
bash scripts/security-scan.sh
```

---

## Security Header Reference

### CSP Directives Quick Reference

| Directive | Purpose | Example |
|-----------|---------|---------|
| `default-src` | Default policy for all content | `default-src 'self'` |
| `script-src` | Controls script execution | `script-src 'self'` |
| `style-src` | Controls stylesheet loading | `style-src 'self' 'unsafe-inline'` |
| `img-src` | Controls image loading | `img-src 'self' data:` |
| `font-src` | Controls font loading | `font-src 'self'` |
| `connect-src` | Controls fetch/WebSocket connections | `connect-src 'self'` |
| `frame-ancestors` | Prevents framing | `frame-ancestors 'none'` |
| `report-uri` | Report CSP violations | `report-uri /csp-report` |

### HTTP Security Headers Quick Reference

| Header | Value | Purpose |
|--------|-------|---------|
| X-Frame-Options | DENY, SAMEORIGIN, ALLOW-FROM | Prevent clickjacking |
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| Strict-Transport-Security | max-age=31536000 | Force HTTPS |
| Referrer-Policy | strict-origin-when-cross-origin | Control referrer info |
| Permissions-Policy | geolocation=(), camera=() | Restrict APIs |

---

## Resources

### Security Standards & Documentation
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Content Security Policy Guide](https://content-security-policy.com/)
- [Security Headers Best Practices](https://securityheaders.com)

### Tools for Testing
- [Mozilla Observatory](https://observatory.mozilla.org)
- [Scott Helme's Security Headers Checker](https://securityheaders.com)
- [SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/)
- [OWASP ZAP Scanner](https://www.zaproxy.org/)

### Vulnerability Databases
- [National Vulnerability Database (NVD)](https://nvd.nist.gov/)
- [CVE Details](https://www.cvedetails.com/)
- [GitHub Security Advisories](https://github.com/advisories)
- [npm Security Advisories](https://www.npmjs.com/advisories)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-08 | Initial comprehensive security documentation |

---

## Document Maintenance

This security documentation should be reviewed and updated:
- **Quarterly**: Review security headers effectiveness
- **Annually**: Comprehensive security assessment
- **Upon Changes**: Update whenever security implementations change
- **Upon Incidents**: Update based on lessons learned

**Last Updated:** 2025-11-08
**Maintained By:** Security Team
**Next Review Date:** 2025-02-08

---

**For questions or concerns about this document, please contact:** security@2025-profile.dev
