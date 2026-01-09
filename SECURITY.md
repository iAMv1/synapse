# Security Policy

## Supported Versions

The following versions of Synapse are currently being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Synapse seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security issues by emailing **[your-email@example.com]** with the following information:

- **Description:** A clear description of the vulnerability
- **Impact:** Potential impact if exploited
- **Steps to Reproduce:** Detailed steps to reproduce the issue
- **Proof of Concept:** If applicable, include POC code or screenshots
- **Suggested Fix:** (Optional) If you have ideas on how to fix it

### What to Expect

- **Acknowledgment:** We will acknowledge receipt of your report within **48 hours**.
- **Assessment:** We will investigate and assess the severity within **5 business days**.
- **Updates:** You will receive regular updates on our progress toward a fix.
- **Credit:** If you wish, we will publicly credit you for responsible disclosure once the issue is resolved.

---

## Security Measures in Place

Synapse implements multiple layers of security to protect user data and system integrity:

### 1. **Row Level Security (RLS)**
- All database tables enforce strict Row Level Security policies.
- Users can only access their own data via Supabase policies.
- Example: A user cannot query another user's documents, even with direct database access.

### 2. **Secure API Key Management**
- **Edge Functions:** All sensitive API keys (OpenRouter, OpenAI) are stored server-side.
- **BYOK (Bring Your Own Key):** User-provided keys are stored encrypted in localStorage and never logged.
- **No Client Exposure:** API keys are never exposed in client-side bundles.

### 3. **Authentication & Authorization**
- **Supabase Auth:** Industry-standard OAuth 2.0 flows.
- **JWT Tokens:** Short-lived tokens with automatic refresh.
- **Session Management:** Secure session handling with httpOnly cookies where applicable.

### 4. **Input Validation & Sanitization**
- All user inputs are validated before processing.
- Document uploads are scanned for size limits and MIME type verification.
- SQL injection protection via parameterized queries (Supabase RLS).

### 5. **HTTPS Everywhere**
- All communication between client and server is encrypted via HTTPS/TLS.
- Vercel deployment enforces HTTPS by default.

### 6. **Content Security Policy (CSP)**
- Strict CSP headers to prevent XSS attacks.
- Inline scripts are minimized; nonces used where necessary.

---

## Known Limitations (v0.1)

As this is an early version, please be aware of the following:

- **BYOK Storage:** User-provided API keys are stored in `localStorage`. While functional, we recommend avoiding sharing devices.
- **Rate Limiting:** No global rate limiting is implemented yet. Users should monitor their own API usage.
- **Audit Logs:** Comprehensive audit logging is not yet implemented.

---

## Security Best Practices for Users

- **Protect Your Keys:** If using BYOK, treat your API keys like passwords.
- **Use Strong Passwords:** Ensure your Supabase account has a strong, unique password.
- **Enable 2FA:** If available, enable two-factor authentication on your account.
- **Review Permissions:** Regularly review which rooms and documents you have access to.

---

## Disclosure Policy

- We follow a **coordinated disclosure** approach.
- Vulnerabilities will be patched before public disclosure.
- Security advisories will be published in the GitHub Security tab.

---

**Last Updated:** January 10, 2026  
**Version:** 0.1
