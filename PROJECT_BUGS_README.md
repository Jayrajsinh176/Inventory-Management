# Project Bugs README

## Scope

This document was created from a direct code review of the current frontend and backend in `client/` and `server/` on April 6, 2026.

Validation used during review:

- code inspection across routes, controllers, pages, and shared components
- `npm.cmd run lint` in `client` (fails)
- recent frontend build checks (passing)

## Current Tooling Status

- Frontend build: passing
- Frontend lint: failing with 12 errors and 1 warning
- Backend syntax checks on recently touched controller files: passing

## Confirmed Functional Bugs

### 1. Frontend protected pages are not actually protected

Files:

- `client/src/App.jsx`

Problem:

- Dashboard, products, categories, users, and subscription routes are mounted directly.
- There is no `ProtectedRoute` wrapper or auth gate.
- A user can browse directly to `/dashboard`, `/products`, `/users`, etc. without being redirected to `/login`.

Impact:

- broken auth flow
- inconsistent UX when APIs fail due to missing token

### 2. Users page expects pagination/search support that the backend does not provide

Files:

- `client/src/components/dashboard/UsersComponents.jsx`
- `client/src/api.js`
- `server/controllers/users.controller.js`

Problem:

- frontend sends `page`, `limit`, and `search` to `GET /api/users`
- backend `getUsersDetails` ignores those query params and returns all company users
- frontend reads `response.meta?.total`, but backend returns `count`

Impact:

- users pagination count is wrong
- search appears wired but is not backed by the API
- frontend filters only the in-memory result set

### 3. Users status filter is broken

Files:

- `client/src/components/dashboard/UsersComponents.jsx`
- `server/models/users.model.js`

Problem:

- frontend filters with `(user.status || 'active').toLowerCase()`
- backend returns `status` as an object like `{ value, deactivatedAt, ... }`

Impact:

- status filtering does not match the real user status model

### 4. Activate/deactivate user endpoints can fall through without a response

Files:

- `server/controllers/users.controller.js`

Problem:

- `deactivateUser` only returns a response when the current status is `active`
- `activateUser` only returns a response when the current status is `inactive`
- if the user is already in the requested state, the function exits the `try` block without sending any response

Impact:

- requests can hang
- client gets a stuck pending request

### 5. Added staff users receive a random password, but the UI never exposes it

Files:

- `server/controllers/users.controller.js`
- `client/src/components/dashboard/UsersComponents.jsx`

Problem:

- backend creates staff with a generated password
- response intentionally strips the password
- there is no invite email flow and no password reset flow

Impact:

- newly created staff cannot log in unless the password is somehow recovered out-of-band

### 6. Category edit exists in backend, but frontend edit is intentionally blocked

Files:

- `server/routes/category.routes.js`
- `server/controllers/category.controller.js`
- `client/src/components/dashboard/CategoriesComponents.jsx`

Problem:

- backend supports `PUT /api/category/:id`
- frontend shows edit controls, but `handleSaveEdit` only displays:
  `Edit functionality will be available soon.`

Impact:

- users see an edit affordance that does not work
- real functionality remains hidden

### 7. Category deletion can orphan products

Files:

- `server/controllers/category.controller.js`
- `server/models/product.model.js`

Problem:

- category delete does not check whether products still reference that category
- there is no reassignment or cascade strategy

Impact:

- products can reference deleted categories
- downstream UI may show blank or inconsistent category data

### 8. Product stats return misleading totals

Files:

- `server/controllers/product.controller.js`
- `client/src/components/dashboard/KPICards.jsx`

Problem:

- `getTotalProducts()` sums product `stock`, not product document count
- UI labels this value as `Total Products`

Impact:

- KPI meaning is incorrect
- dashboard can show total stock units while labeling them as product count

### 9. Product average price calculation can become invalid

Files:

- `server/controllers/product.controller.js`

Problem:

- `getAveragePrice()` divides total price sum by total stock sum
- when total stock is `0`, the result becomes `Infinity` or `NaN`
- the formula also does not represent a normal product average

Impact:

- incorrect analytics
- unstable values for empty or zero-stock catalogs

### 10. Dashboard analytics endpoints are simulated, not real

Files:

- `server/controllers/product.controller.js`
- `client/src/components/dashboard/InventoryTrendChart.jsx`

Problem:

- stock movement and reorder analysis use random values
- responses change between requests even if data does not

Impact:

- dashboard charts are not trustworthy
- users may assume these are real business analytics

### 11. Low stock logic is duplicated and inconsistent

Files:

- `server/controllers/product.controller.js`
- `server/controllers/alert.controller.js`
- `client/src/components/dashboard/LowStockAlerts.jsx`

Problem:

- `GET /api/products/low-stock` and `GET /api/alert/low-stock` implement different logic
- one compares with `<`
- the other compares with `<=`
- frontend does not use the dedicated alert route
- frontend hardcodes threshold `5` in `LowStockAlerts.jsx`

Impact:

- alert counts can differ between endpoints and UI
- threshold behavior is not consistent

### 12. Low stock threshold is only partially implemented

Files:

- `server/models/product.model.js`
- `server/controllers/product.controller.js`
- `client/src/components/dashboard/AddProductComponents.jsx`

Problem:

- product model has `lowStockThreshold`
- add/edit product form renders a threshold input
- form does not bind that input into `formData`
- create/update product controllers do not accept threshold updates

Impact:

- users see a field they cannot actually save
- low stock behavior cannot be configured from the UI

### 13. Product summary cards calculate from the first 1000 products only

Files:

- `client/src/components/dashboard/ProductsComponents.jsx`

Problem:

- summary cards call `getProducts({ limit: 1000 })`
- inventory value and low stock counts are derived from the returned page only

Impact:

- numbers become wrong for companies with more than 1000 products

### 14. Dashboard activity feed is static, not connected to backend activity logs

Files:

- `client/src/components/dashboard/InventoryHealthFeed.jsx`
- `server/models/activity.model.js`
- `server/controllers/users.controller.js`

Problem:

- feed content is hardcoded
- backend activity logging exists, but there is no company-wide activity endpoint or UI integration

Impact:

- dashboard appears live while showing fake events

### 15. Subscription page is mostly static

Files:

- `client/src/components/dashboard/SubscriptionComponents.jsx`
- `server/routes/plan.routes.js`

Problem:

- plan list is fetched, but billing dates, transaction history, plan actions, and cancellation flow are static
- no billing/subscription mutation endpoints exist

Impact:

- page looks functional but cannot actually manage billing

### 16. Header search and notifications are UI-only

Files:

- `client/src/components/dashboard/Header.jsx`

Problem:

- search box is not connected to any state or route
- notifications button has no behavior

Impact:

- non-functional global controls

### 17. Dashboard action buttons are not wired

Files:

- `client/src/pages/DashboardPage.jsx`

Problem:

- `Export Report` button has no action
- `Add Item` button has no navigation or handler

Impact:

- primary dashboard actions are dead ends

### 18. Forgot-password route is referenced but missing

Files:

- `client/src/components/auth/LoginForm.jsx`
- `client/src/App.jsx`

Problem:

- login form links to `/forgot-password`
- no page or route exists for that path

Impact:

- user hits a broken flow and falls back to the wildcard route

### 19. Sidebar active state misses edit pages

Files:

- `client/src/components/dashboard/Sidebar.jsx`

Problem:

- products nav is only active for `/products` and `/products/add`
- users nav is only active for `/users`
- edit pages are not included

Impact:

- navigation highlight is wrong on edit screens

### 20. Backend docs in the repo are stale relative to the current code

Files:

- `README.md`
- `FEATURES_ROADMAP.md`
- `server/API_ENDPOINTS_GUIDE.md`

Problem:

- multiple claims do not match the real codebase
- examples include endpoints, phases, and behaviors that are no longer accurate

Impact:

- onboarding confusion
- incorrect implementation expectations

## Quality and Tooling Issues

### Frontend lint currently fails

Command:

```bash
npm.cmd run lint
```

Current issues reported:

- `client/src/components/auth/LoginForm.jsx`
- `client/src/components/auth/SignupForm.jsx`
- `client/src/components/dashboard/CategoriesComponents.jsx`
- `client/src/components/dashboard/LowStockAlerts.jsx`
- `client/src/components/dashboard/Sidebar.jsx`
- `client/src/components/dashboard/SubscriptionComponents.jsx`
- `client/src/components/dashboard/UsersComponents.jsx`
- `client/src/components/landing/Footer.jsx`
- `client/src/components/landing/Navbar.jsx`
- `client/src/pages/AddProductPage.jsx`

Problem classes:

- unused variables
- missing hook dependency
- `react-hooks/set-state-in-effect`

Impact:

- repo quality gates are not green
- future refactors are harder to trust

## High-Priority Fix Order

1. add frontend route protection
2. fix users API contract mismatch
3. fix activate/deactivate no-response paths
4. implement category edit properly
5. fix staff onboarding password flow
6. wire low stock threshold end to end
7. replace simulated analytics with real data or clearly label them as mock
8. clean up lint errors and stale documentation
