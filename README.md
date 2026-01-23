# Sudoku Lite

A modern, sleek Sudoku playing website built with Vue 3, TypeScript, and Vite.

## Features

- 6 difficulty levels: Beginner, Intermediate, Advanced, Expert, Master, Extreme
- Multiple input modes: Mouse, touch, and keyboard support
- Pencil marks for notation
- Undo and erase functionality
- Real-time validation with visual feedback
- Completion animations with confetti effect
- Responsive design for mobile, tablet, and desktop
- Rules and history content

## Local Development

### Prerequisites

- Node.js 20+ 
- npm 10+

### Setup

```bash
# Install dependencies
npm install

# Start dev server (default: http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run tests
npm run test
```

## Deployment

This project deploys to GitHub Pages automatically via GitHub Actions when changes are pushed to the `main` branch.

### Deployment Requirements

- GitHub Pages enabled in repository settings
- GitHub Actions workflow permissions: Read and write permissions
- Pages deployment source: GitHub Actions

## Project Structure

```
sudoku_lite/
├── src/
│   ├── main.ts          # Application entry point
│   ├── App.vue          # Root component
│   ├── components/      # Vue components
│   ├── game/            # Game logic (generator, solver, validator)
│   ├── styles/          # Global styles
│   └── assets/          # Static assets
├── public/              # Public static files
├── tests/               # Unit and e2e tests
└── .github/workflows/   # CI/CD workflows
```

## Validation Gates

Before merging to main, ensure the following checks pass:

### HTML Validation
```bash
# Use W3C HTML validator or:
npx html-validate index.html dist/**/*.html
```

### CSS Validation
```bash
# Use W3C CSS validator or:
npx stylelint "src/**/*.css" "src/**/*.vue"
```

### JavaScript Linting
```bash
npm run lint
```

### Link Checking
```bash
# Check for broken links in built site
npx linkinator dist --recurse
```

### Accessibility Audit
```bash
# Run accessibility checks (WCAG 2.1 Level A minimum)
npx pa11y-ci dist/index.html
```

## Input Mode Verification

The application supports three input modes:

1. **Mouse/Touch**: Click cells and number buttons
2. **Keyboard**: 
   - Arrow keys: Navigate cells
   - 1-9: Enter numbers
   - Delete/Backspace: Erase
   - P: Toggle pencil mode
   - U: Undo last action
   
3. **Touch gestures**: Tap cells and controls on mobile devices

### Testing Input Modes

1. Test mouse clicks on all interactive elements
2. Test keyboard navigation and shortcuts
3. Test touch interactions on mobile/tablet devices
4. Verify all three modes work without conflicts

## Browser Compatibility

Supports the latest 2 versions of:
- Chrome
- Firefox
- Safari
- Edge

## Performance Targets

- 60 fps animations
- Puzzle generation: ≤ 3 seconds
- Interaction response: ≤ 200ms
- Initial page load: ≤ 5 seconds

## License

MIT
