<<<<<<< HEAD
# Automation
=======
# Automation Test Suite

A Playwright-based test automation framework for web testing.

## Setup

### Prerequisites
- Node.js 18+ installed

### Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

### Run tests with debug mode
```bash
npm run test:debug
```

### Generate test code
```bash
npm run codegen
```

## Project Structure

- `tests/` - Contains test files (*.spec.ts)
- `playwright.config.ts` - Playwright configuration
- `tsconfig.json` - TypeScript configuration

## Configuration

Edit `playwright.config.ts` to customize:
- Test directories
- Base URL
- Browser configurations
- Reporters
- Retry logic
>>>>>>> 0a3e1eb (Initial commit from local workspace)
