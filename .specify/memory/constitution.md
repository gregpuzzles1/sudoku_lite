<!--
Sync Impact Report - Constitution Update
Version: 0.0.0 → 1.0.0
Change Type: MAJOR (Initial constitution creation)

Modified Principles: NONE (initial creation)
Added Sections:
  - I. Static Assets Only
  - II. Main Branch Deployment
  - III. GitHub Actions CI/CD
  - Deployment Requirements
  - Quality Standards

Templates Status:
  ✅ plan-template.md - Constitution Check section compatible
  ✅ spec-template.md - User story/requirements alignment maintained
  ✅ tasks-template.md - Task structure supports constitution principles

Follow-up TODOs: NONE
-->

# Sudoku Lite Constitution

## Core Principles

### I. Static Assets Only

All deployable artifacts MUST be static files (HTML, CSS, JavaScript, images, fonts). No server-side processing, no backend APIs, no build-time server dependencies. All functionality MUST execute entirely in the browser. External API calls are permitted but MUST NOT be required for core functionality.

**Rationale**: GitHub Pages serves only static content. Any dynamic functionality must be client-side to ensure deployment compatibility.

### II. Main Branch Deployment

Production deployment MUST occur exclusively from the `main` branch. All features MUST be merged to `main` via pull request before deployment. Direct commits to `main` are PROHIBITED except for emergency hotfixes, which MUST be documented in commit messages with "HOTFIX:" prefix.

**Rationale**: Single-branch deployment ensures predictable releases, simplifies CI/CD configuration, and maintains production stability.

### III. GitHub Actions CI/CD

Deployment MUST be automated via GitHub Actions workflows. Manual deployments are PROHIBITED. The workflow MUST validate all assets before deployment (linting, link checking, asset optimization). Failed validation MUST block deployment.

**Rationale**: Automated deployment eliminates human error, ensures consistency, and provides audit trail through workflow logs.

## Deployment Requirements

### Asset Optimization

- All images MUST be optimized for web delivery
- CSS and JavaScript MUST be minified in production builds
- Total page load size SHOULD NOT exceed 5MB for initial page load
- Assets MUST include cache headers via GitHub Pages defaults

### Browser Compatibility

- Application MUST function in latest two major versions of Chrome, Firefox, Safari, Edge
- JavaScript features MUST use ES6+ with documented exceptions if ES5 needed
- CSS MUST validate against standard specifications
- Progressive enhancement: core functionality MUST work without JavaScript where feasible

### Repository Structure

```
/
├── index.html          # Required entry point
├── assets/             # Static assets (CSS, JS, images)
├── .github/
│   └── workflows/
│       └── deploy.yml  # Required deployment workflow
└── .specify/           # Project documentation and templates
```

## Quality Standards

### Validation Gates

Before merge to `main`, code MUST pass:
- HTML validation (W3C validator or equivalent)
- CSS validation
- JavaScript linting (ESLint or equivalent)
- Broken link checking
- Accessibility audit (WCAG 2.1 Level A minimum)

### Documentation

- README.md MUST include: project description, local development setup, deployment instructions
- All configuration files MUST include inline comments explaining non-obvious settings
- Feature specifications MUST document browser compatibility requirements

## Governance

This constitution defines the non-negotiable principles for Sudoku Lite development and deployment. All pull requests MUST comply with these principles. Violations require explicit justification in PR descriptions and approval from repository maintainer.

### Amendment Process

Constitution amendments require:
1. Proposal documented in GitHub issue with rationale
2. Impact analysis on existing features and deployment pipeline
3. Approval from repository maintainer
4. Version bump following semantic versioning (MAJOR for principle changes, MINOR for new sections, PATCH for clarifications)
5. Update of all dependent templates and documentation

### Version Semantics

- **MAJOR**: Backward-incompatible principle changes, removed principles, redefined deployment requirements
- **MINOR**: New principles added, expanded sections, new quality gates
- **PATCH**: Clarifications, typo fixes, formatting, non-semantic refinements

**Version**: 1.0.0 | **Ratified**: 2026-01-23 | **Last Amended**: 2026-01-23
