# Playwright + TypeScript Test Automation Framework

[![Playwright Tests](https://github.com/Suchismitanay/playwright-ts-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/Suchismitanay/playwright-ts-portfolio/actions/workflows/playwright.yml)

A portfolio project showing how I structure **UI + API test automation** for real products: Page Object Model, custom fixtures, API-driven test data, cross-browser runs and CI on GitHub Actions.

| Layer | Application under test |
|---|---|
| UI | [SauceDemo](https://www.saucedemo.com) (public e-commerce demo) |
| API | [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html) (public REST API for testing practice) |

## Highlights

- **Page Object Model**: locators and actions live in `src/pages`, specs read like test cases
- **Custom fixtures**: `loggedIn` fixture gives every test a fresh authenticated session, no repeated login code
- **Stable locators only**: `getByTestId` / `getByRole`, no XPath, no hard waits (web-first assertions)
- **API client + data builder**: `BookingClient` hides endpoints/auth; `buildBooking()` creates unique data with overrides for edge cases
- **Positive, negative and edge cases**: auth failures, validation errors, 403/404 paths, sort order checks
- **Tagging**: `@smoke` subset runs cross-browser (Chromium + Firefox)
- **CI-ready**: retries, trace on first retry, screenshots/video on failure, HTML report uploaded as artifact, matrix by project, scheduled weekday run

## Project structure

```
src/
  api/BookingClient.ts       # API client (auth, CRUD)
  data/bookingBuilder.ts     # test data builder
  data/users.ts              # demo users (env-overridable)
  fixtures/index.ts          # custom fixtures (page objects, loggedIn, bookingApi)
  pages/                     # Page Objects: Login, Inventory, Cart, Checkout
tests/
  ui/login.spec.ts
  ui/cart-checkout.spec.ts
  api/booking.spec.ts
playwright.config.ts         # projects: ui-chromium, ui-firefox (@smoke), api
.github/workflows/playwright.yml
```

## Coverage

| Area | Scenarios |
|---|---|
| Login | valid login, locked-out user, invalid creds, required-field validation, protected route redirect |
| Cart & checkout | E2E purchase with subtotal check, add/remove badge count, checkout form validation, sort by price & name |
| Booking API | health check, create → get, full update (PUT), partial update (PATCH), delete, 403 without/with bad token, bad credentials, 404, missing fields |

## Run locally

```bash
npm ci
npx playwright install --with-deps chromium firefox
npm test              # everything
npm run test:api      # API only
npm run test:ui       # UI (Chromium)
npm run test:smoke    # @smoke across projects
npm run report        # open HTML report
```

Environment overrides: `UI_BASE_URL`, `API_BASE_URL`, `SAUCE_PASSWORD`, `API_USER`, `API_PASSWORD`.

## Author

**Suchismita Nayak** — QA Engineer (Playwright, TypeScript, API testing, SQL). Mechanical engineer turned QA.
