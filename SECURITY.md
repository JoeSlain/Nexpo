# Security Policy

## Supported Versions

We actively support and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. Email the security team directly at: [your-email@example.com]
3. Include in your report:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Any suggested fixes (optional)

### What to Expect

- **Acknowledgment**: We will acknowledge your report within 48 hours
- **Timeline**: We aim to provide a more detailed response within 7 days
- **Updates**: We will keep you informed of our progress toward a fix
- **Credit**: We will acknowledge your contribution (if you wish)

### Scope

This security policy applies to:
- The main repository code
- All official releases
- Documentation related to the project

### Out of Scope

- Social engineering attacks
- Physical security
- Denial of service attacks (unless they exploit a specific code vulnerability)
- Issues in third-party dependencies (report to the respective maintainers)

## Security Best Practices

When using this template, please follow these security guidelines:

### Environment Variables

- Never commit `.env.local` files or actual secrets to version control
- Use `.env.example` files as templates (without real credentials)
- Rotate API keys and secrets regularly
- Use different credentials for development and production

### Supabase

- Enable Row Level Security (RLS) policies for all tables
- Use the anon key for client-side operations
- Only use the service role key on the server side with proper access controls
- Never expose the service role key to client applications

### Dependencies

- Keep dependencies up to date
- Review dependency changes before updating
- Use `yarn audit` regularly to check for vulnerabilities

## Security Updates

Security updates will be released as patch versions and announced in the release notes.
