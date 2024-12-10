# Using Playwright with Bun

## Installing Bun

To use this project with Playwright, you'll need to have Bun installed. Run the
following command in your terminal:

```
bun install bun -g
```

### Installing Dependencies

Once Bun is installed, navigate to the project directory and run:

```bash
bun install
```

This will install all dependencies required for the project.

## Setting up Playwright

- Create a new file `tests/your-test.spec.ts` to write your tests.
- Use the following template as an example:

```typescript
import { test, expect } from '@playwright/test'

test('sample test', async ({ page }) => {
  await page.goto('https://example.com')
  expect(page.title()).toBe('Example Domain')
})
```

- Run `bun playwright test` to execute the tests.

## Running Tests

To run the tests in headless mode, use:

```bash
bun playwright test --headless --reporter dot
```

## Tips and Tricks

- Utilize Playwright's built-in assertions (e.g., `expect(page.title()).toBe(...)`)
  instead of external libraries.
- Should use auto-wait assertions instead of normal assertions where possible.
- Should use AI to generate tests, don't use the auto-generated tests feature of
  Playwright.
