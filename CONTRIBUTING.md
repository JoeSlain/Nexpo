# Contributing to Nexpo

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this template.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue using the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md). Include:
- A clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

### Suggesting Features

To suggest a new feature, use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md). Include:
- A clear description of the feature
- The problem it would solve
- Proposed solution
- Alternatives considered

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure code is formatted (`yarn format`)
5. Run linter (`yarn lint`)
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style

This project uses:
- **Biome** for linting and formatting
- **TypeScript** for type safety
- **ESLint** for additional linting (Next.js)

Run the linter and formatter before committing:
```bash
yarn lint:fix
yarn format
```

### Testing

Before submitting a PR, make sure:
- [ ] Code is formatted and linted
- [ ] No TypeScript errors
- [ ] Next.js app builds successfully (`yarn workspace next-app build`)
- [ ] All existing functionality still works
- [ ] New features are documented

### Template-Specific Guidelines

When contributing to a template repository, keep in mind:

1. **Maintain Simplicity**: Templates should be easy to understand and customize
2. **Document Everything**: Add comments and documentation for complex parts
3. **Provide Examples**: Include example files (`.env.example`) but never real credentials
4. **Keep Up to Date**: Ensure dependencies are reasonably up to date
5. **Backward Compatibility**: When possible, maintain backward compatibility

### Review Process

- All PRs require review before merging
- Maintainers will review code style, functionality, and documentation
- Feedback will be provided if changes are needed
- Once approved, maintainers will merge the PR

## Questions?

If you have questions about contributing, feel free to:
- Open a discussion in GitHub Discussions
- Create an issue with the `question` label
- Contact the maintainers directly

Thank you for contributing! 🎉

