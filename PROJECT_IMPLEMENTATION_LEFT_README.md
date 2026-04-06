# Project Implementation Left README

## Purpose

This document captures:

- what is currently implemented in the backend
- what each backend route returns
- what is currently implemented in the frontend
- which pages and components are still missing, partial, or not wired

## Snapshot

- Backend foundation: mostly present for auth, products, categories, users, plan lookup, and low-stock alerts
- Frontend routing/pages: present for landing, auth, dashboard, products, categories, users, and subscription
- Large remaining area: route protection, billing, settings, export/reporting, user activity UI, category edit wiring, alert workflows, and realistic analytics

## Backend: Current Route Inventory

### Auth Routes

| Method | Path | Auth | Controller | Returns |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | `registerUser` | `success`, `message`, `user`, `token`, `company` |
| `POST` | `/api/auth/login` | Public | `loginUser` | `success`, `message`, `user`, `token`, `company` |

### Product Routes

| Method | Path | Auth | Controller | Returns |
|---|---|---|---|---|
| `GET` | `/api/products` | Protected | `getProducts` | `success`, `message`, `page`, `limit`, `totalPages`, `count`, `products[]` |
| `GET` | `/api/products/:id` | Protected | `getProductById` | `success`, `message`, `product` |
| `POST` | `/api/products` | Protected | `createProduct` | `success`, `message`, `product`, `subscription` |
| `PUT` | `/api/products/:id` | Protected | `updateProduct` | `success`, `message`, `data` |
| `DELETE` | `/api/products/:id` | Protected | `deleteProduct` | `message` |
| `GET` | `/api/products/stats` | Protected | `getProductStats` | `success`, `stats` |
| `GET` | `/api/products/low-stock` | Protected | `getLowStock` | `success`, `low-stock-products`, `count` |
| `GET` | `/api/products/by-category/:categoryId` | Protected | `getProductsByCategory` | `success`, `products`, `count`, `categoryName` |
| `GET` | `/api/products/analytics/stock-movement` | Protected | `getStockMovementAnalysis` | `success`, `message`, `data`, `totalProductsAnalyzed`, `totalInventoryValue` |
| `GET` | `/api/products/analytics/category-performance` | Protected | `getCategoryPerformanceAnalysis` | `success`, `message`, `data`, `totalCategoriesAnalyzed`, `totalInventoryValue` |
| `GET` | `/api/products/analytics/reorder-patterns` | Protected | `getReorderPatternsAnalysis` | `success`, `message`, `data`, `avgReorderFrequency`, `totalProductsAnalyzed`, `currentLowStockItems` |

Notes:

- product payload now returns category as `{ id, name }` when populated
- analytics endpoints exist, but some calculations are simulated rather than event-driven

### Category Routes

| Method | Path | Auth | Controller | Returns |
|---|---|---|---|---|
| `GET` | `/api/category` | Protected | `getCategory` | `success`, `count`, `data[]` |
| `POST` | `/api/category` | Protected | `createCategory` | `success`, `message`, `data` |
| `PUT` | `/api/category/:id` | Protected | `updateCategory` | `success`, `message`, `data` |
| `DELETE` | `/api/category/:id` | Protected | `deleteCategory` | `success`, `message` |

### User Routes

| Method | Path | Auth | Controller | Returns |
|---|---|---|---|---|
| `GET` | `/api/users` | Protected | `getUsersDetails` | `success`, `count`, `data[]` |
| `GET` | `/api/users/:id` | Protected | `getUserById` | `success`, `user` |
| `POST` | `/api/users` | Protected | `addUsers` | `success`, `message`, `data` |
| `PUT` | `/api/users/:id` | Protected | `updateUsersDetails` | `success`, `message`, `data` |
| `DELETE` | `/api/users/:id` | Protected | `deleteUser` | `success`, `message` |
| `PATCH` | `/api/users/:id/activate` | Protected | `activateUser` | `success`, `message` on the happy path |
| `PATCH` | `/api/users/:id/deactivate` | Protected | `deactivateUser` | `success`, `message` on the happy path |
| `GET` | `/api/users/:id/activity` | Protected | `getUserActivity` | `success`, `activities[]`, `pagination` |

### Plan Route

| Method | Path | Auth | Controller | Returns |
|---|---|---|---|---|
| `GET` | `/api/company/plan` | Public in current code | `planDetails` | `success`, `message`, `data[]` |

### Alert Route

| Method | Path | Auth | Controller | Returns |
|---|---|---|---|---|
| `GET` | `/api/alert/low-stock` | Protected | `getLowStockAlerts` | `success`, `data[]` |

## Backend: What Is Still Left

### Missing or partial route families

These are not implemented as real route groups yet:

- subscription mutation routes
- billing history routes
- invoice routes
- Stripe webhook routes
- company profile read/update routes
- report generation/download routes
- import/export routes
- password reset routes
- settings/preferences routes
- company-wide activity feed route

### Existing backend areas that are still partial

#### Users API

- no true server-side pagination
- no server-side search
- no server-side role/status filter
- activation/deactivation needs safe fallback responses

#### Products API

- `lowStockThreshold` is in the model but not fully supported in create/update payloads
- product stats naming and formulas need cleanup
- analytics should be driven by real movement/order data instead of random numbers

#### Categories API

- category deletion should guard against products still assigned to the category

#### Plans/Billing

- only plan catalog lookup exists
- no upgrade, downgrade, cancel, renew, or billing history workflow exists

#### Alerts

- there are two overlapping low-stock implementations
- alert preferences, notification delivery, and alert acknowledgement do not exist

## Frontend: Current Route and Page Inventory

| Path | Page | Major Components | Status |
|---|---|---|---|
| `/` | `LandingPage` | `Navbar`, `HeroSection`, `FeaturesSection`, `HowItWorksSection`, `PricingSection`, `Footer`, others | implemented, mostly marketing/static |
| `/login` | `LoginPage` | `LoginBranding`, `LoginForm` | implemented |
| `/register` | `SignupPage` | `SignupBranding`, `SignupForm` | implemented |
| `/dashboard` | `DashboardPage` | `Sidebar`, `Header`, `KPICards`, `InventoryTrendChart`, `InventoryHealthFeed`, `LowStockAlerts` | partial |
| `/products` | `ProductsPage` | `ProductsHeader`, `SummaryCards`, `ProductsTable` | implemented, partial |
| `/products/add` | `AddProductPage` | `AddProductForm` | implemented, partial |
| `/products/edit/:productId` | `EditProductPage` | `AddProductForm` reused for edit | implemented |
| `/categories` | `CategoriesPage` | `CategoriesHeader`, `CategoriesGrid` | partial |
| `/users` | `UsersPage` | `UsersHeader`, `UsersTable` | partial |
| `/users/edit/:userId` | `EditUserPage` | inline edit form | implemented |
| `/subscription` | `SubscriptionPage` | `CurrentPlanBanner`, `UsageProgressBar`, `PlanUpgradeCards`, `TransactionHistory` | partial |

## Frontend: What Is Still Left

### Missing pages

These pages are referenced by current UI, implied by backend capabilities, or clearly needed by the product surface:

- `ForgotPasswordPage`
- `SettingsPage`
- `SecuritySettingsPage`
- `NotificationSettingsPage`
- `BillingPage`
- `BillingHistoryPage`
- `UpdatePaymentMethodPage`
- `ReportsPage`
- `LowStockPage`
- `UserActivityPage` or user-activity modal/drawer
- `CompanyProfilePage`
- `ProductDetailPage` if individual product detail is intended

### Missing shared components / architecture

- `ProtectedRoute` or auth-aware route guard
- app-level auth state provider or equivalent redirect logic
- reusable toast/notification system actually used across CRUD flows
- company-wide activity timeline component
- export/report action components
- billing/checkout components
- settings forms

### Partial dashboard components

#### `KPICards`

- wired to backend stats
- still depends on backend stats that need formula fixes

#### `InventoryTrendChart`

- renders charts from backend endpoints
- data is only partially meaningful because backend uses simulated values

#### `InventoryHealthFeed`

- currently hardcoded
- should be replaced with real activity or alert data

#### `LowStockAlerts`

- fetches low-stock products
- edit action button is not wired
- "View All Low Stock Items" button is not wired
- threshold display is frontend-hardcoded

### Partial product-management components

#### `ProductsComponents`

- list, search, filter, pagination, edit, and delete are present
- no product detail page
- summary cards derive stats from a paged list instead of dedicated full stats

#### `AddProductForm`

- create and edit work for main fields
- low stock threshold input is displayed but not persisted

### Partial category-management components

#### `CategoriesGrid`

- create and delete work
- edit UI is present but save action is intentionally blocked

### Partial user-management components

#### `UsersTable`

- list, create, edit, delete UI exists
- frontend expects pagination/search contract that backend does not provide
- activate/deactivate is not surfaced
- user activity view is not surfaced

### Partial subscription components

#### `CurrentPlanBanner`

- shows current plan from local storage
- billing dates and action buttons are placeholders

#### `UsageProgressBar`

- shows usage against plan limits
- plan mutation is not implemented

#### `PlanUpgradeCards`

- renders available plan cards
- upgrade button is visual only

#### `TransactionHistory`

- fully static sample data

### Partial global layout components

#### `Header`

- global search is visual only
- notifications are visual only
- user avatar is static initials

#### `Sidebar`

- navigation works
- no settings route enabled
- active-state matching is incomplete for nested edit pages

## Backend Features That Exist but Are Not Surfaced in Frontend

- `PATCH /api/users/:id/activate`
- `PATCH /api/users/:id/deactivate`
- `GET /api/users/:id/activity`
- `GET /api/alert/low-stock`
- detailed plan limits from `GET /api/company/plan`

## Recommended Build Order

### Immediate product-quality work

1. add `ProtectedRoute`
2. fix users API contract and users page filtering
3. wire category edit to `PUT /api/category/:id`
4. complete low stock threshold support end to end
5. expose user activate/deactivate and activity in UI

### Next feature work

1. build settings pages
2. build forgot-password flow
3. build reports/export workflow
4. build billing/subscription mutation flow
5. replace static dashboard sections with real backend data

### Longer-term platform work

1. company profile management
2. email notifications
3. import/export
4. real event-based analytics
5. testing, CI, and docs cleanup
