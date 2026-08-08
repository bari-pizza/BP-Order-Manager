# Bari Pizza Order Manager - Application Specification

## Overview

A Progressive Web App (PWA) for managing pizza delivery operations at a single pizzeria. The system tracks delivery orders, driver assignments, cash management, and end-of-day reconciliation. Built to replace a Bubble.io app with a faster, more maintainable React application.

**Tech Stack**: React + TypeScript, Vite, Supabase (backend), Material-UI, React Query

---

## User Roles & Permissions

### 👨‍💼 Admin
**Full system access** - Can configure the system and manage all data
- Manage employees (create, edit, delete drivers and managers)
- Configure order origins (DoorDash, UberEats, etc.) with logos
- Upload and manage resources (PDFs, images, documents)
- Adjust application settings (tax rates, defaults, etc.)
- Access all Manager and Driver features

### 👔 Manager
**Day-to-day operations** - Manages drivers, orders, and cash
- View and manage all drawers (cash registers and driver drawers)
- Assign/unassign drivers to the business day
- Create and manage orders (assign to drivers, edit, delete)
- View sales analytics and reports
- Handle cash transfers between drawers
- Close individual drawers
- Close the entire business day (end-of-day reconciliation)

### 🚗 Driver
**Mobile-first** - Manages their own orders and cash
- View orders assigned to their drawer (filtered by driver)
- Add/edit tips and payments on their orders
- Mark orders as paid/unpaid
- View their drawer balance and ticket total
- Cannot see other drivers' orders or drawers

---

## Application Pages

### 1. Login Page (`/`)
**Purpose**: Authentication gateway

**Features**:
- Email/password authentication via Supabase
- Auto-login for returning users (session persistence)
- Responsive design (works on mobile and desktop)

---

### 2. Home Page (`/home`)
**Purpose**: Navigation hub based on user role

**Features**:
- Shows different navigation options based on role
- Quick access to:
  - Orders Dashboard (all roles)
  - Manager Dashboard (managers/admins)
  - Admin Dashboard (admins only)
  - Profile/Account settings

---

### 3. Orders Dashboard (`/orders`)
**Purpose**: Real-time order management and driver interface

#### Desktop View (Managers/Admins)
- **Header**: Shows current drawer, date, ticket count, and total balance
- **Order Grid**: All orders for the day in a grid layout
  - Color-coded by order origin (DoorDash = red, UberEats = green, etc.)
  - Shows order number, customer name, total, tip, payment status
  - Click to edit order details
- **Ticket Area**: Print-ready view of unassigned orders
- **Speed Dial**: Quick actions (create order, bulk actions)
- **Sidebar**: Drawer summary, statistics, and filters

#### Mobile View (Drivers)
- **My Orders**: Filtered to show only orders assigned to this driver
- **Drawer Header**: Driver's current cash balance and ticket total
- **Order Cards**: Swipeable cards with order details
  - Tap to add/edit tips
  - Mark as paid/unpaid
  - View payment details
- **Optimized for single-hand use**

**Real-time Updates**: Uses Supabase subscriptions to sync orders across all devices instantly

---

### 4. Manager Dashboard (`/manager`)
**Purpose**: Day-to-day operations center for managers

#### Tabs:

##### 📊 Drawers Tab (Default)
- **Drawer Cards**: One card per active drawer
  - Shows driver name, avatar, orders, tips, total
  - Quick actions: Transfer cash, close drawer, view details
  - Color-coded by status (open, closed, locked)
- **Add Driver Card**: Assign drivers to today's shift
- **Close Business Day**: End-of-day reconciliation button

##### 💰 Sales Tab
- **Sales Chart**: Revenue over time (line chart)
- **Summary Statistics**: 
  - Total sales for the day
  - Average order value
  - Tips collected
  - Orders per hour
- **Filters**: By time range, payment type, origin

##### 📋 Orders Tab
- **Data Grid**: All orders with advanced filtering
  - Filter by: Driver, payment status, origin, time
  - Sort by: Any column
  - Search: Order number, customer name
- **Bulk Actions**: Assign multiple orders, export data
- **Details View**: Click row for full order details

##### 💳 Cards Tab (Cash Transfers)
- **Transfer History**: Log of all cash transfers between drawers
- **Create Transfer**: Move money between driver drawers and registers
- **Balance Tracking**: Ensures cash accountability

---

### 5. Admin Dashboard (`/admin`)
**Purpose**: System configuration and employee management

#### Tabs:

##### 👥 Employees Tab (Default)
- **Employee Table**: All users (drivers, managers, admins)
  - Add new employee (auto-generates password, sends email)
  - Edit roles and permissions
  - Soft-delete employees (marks as deleted, doesn't remove from DB)
  - Reset passwords
  - View employee activity
- **Employee Details**: Click to view full profile

##### 🌐 Origins Tab
- **Order Origins Table**: Delivery platforms (DoorDash, UberEats, etc.)
  - Add new origin with logo upload
  - Edit origin details (name, color, default tip %)
  - Set as active/inactive
  - Logo management (upload PNG/SVG)

##### 📁 Resources Tab
- **File Manager**: Upload and manage documents
  - PDFs (training manuals, forms)
  - Images (menu photos, signs)
  - Shared with all employees
- **Categories**: Organize by type

##### ⚙️ Settings Tab
- **Application Settings**: System-wide configuration
  - Tax rate (for order calculations)
  - Default tip percentage
  - Business hours
  - Currency formatting
  - Other operational defaults

---

### 6. Profile / My Account (`/profile`)
**Purpose**: Personal account management

**Features**:
- View profile information
- Upload/change avatar
- Change password
- View role and permissions
- (Future: Edit name, email)

---

### 7. How To Page (`/howto`)
**Purpose**: In-app help and tutorials

**Features**:
- Role-specific guides
- Video tutorials (when available)
- Step-by-step instructions for common tasks
- FAQ section

---

## Key Features & Workflows

### 📱 Progressive Web App (PWA)
- **Installable**: Add to home screen on mobile
- **Offline-capable**: Service worker caches assets
- **Fast loading**: Optimized bundle splitting
- **Mobile-first**: Responsive design for all screen sizes

### 🔄 Real-time Synchronization
- **Supabase Subscriptions**: Changes sync instantly across all devices
- **Optimistic Updates**: UI updates immediately, syncs in background
- **Conflict Resolution**: Handles concurrent edits gracefully

### 💰 Cash Management
- **Drawer System**: Each driver has a virtual cash drawer
  - Starts at $0 each day
  - Tracks cash collected from orders
  - Handles tips separately
- **Cash Transfers**: Move money between drawers
  - Driver → Register (driver drops off cash)
  - Register → Driver (giving change)
  - Full audit trail
- **End-of-Day Close**: 
  - Lock all drawers
  - Generate summary report
  - Calculate discrepancies
  - Archive the business day

### 📋 Order Management
- **Order Lifecycle**:
  1. Create order (number, customer, origin, amount)
  2. Add initial payment (delivery fee, tip estimate)
  3. Assign to driver drawer
  4. Driver delivers order
  5. Driver updates final tip amount
  6. Mark as paid
  7. Order locked when drawer closes

- **Order Fields**:
  - Order number (auto-incrementing)
  - Customer name
  - Origin (platform)
  - Address (text field)
  - Order total (delivery fee)
  - Tip amount (editable)
  - Payment type (cash, card, app)
  - Notes

### 🎨 Design System
- **Material-UI**: Consistent component library
- **Themed**: Primary color (pizza theme), secondary color
- **Icons**: Lottie animations for enhanced UX
- **Responsive**: Mobile-first, scales to desktop
- **Dark mode ready**: Theme supports light/dark (currently light only)

---

## Data Model (High Level)

### Core Tables

#### `Profile` (Users)
- User account information
- Role (admin, manager, driver)
- Avatar, name, email
- `is_deleted` flag (soft delete)

#### `Drawer`
- Represents a cash drawer
- Types: `driver` (one per driver) or `register` (stationary)
- Linked to a Profile (for driver drawers)
- Tracks current balance

#### `Driver`
- Links Profile to Drawer
- Tracks driver status (active, deleted)
- Assignment to business days

#### `BusinessDayDriver`
- Junction table: Which drivers worked which days
- Enables historical tracking

#### `Order`
- Delivery order details
- Linked to Drawer (assignment)
- Linked to OrderOrigin (platform)
- Business date (for filtering)
- Status fields (paid, locked)

#### `Payment`
- Cash collected on an order
- Types: `tip`, `delivery_fee`, `food` (food not used in this system)
- Payment method (cash, card, app)
- Linked to Order

#### `Order_Payment`
- Junction table: Orders can have multiple payments
- Tracks which payments belong to which orders

#### `CashTransfer`
- Money movement between drawers
- From drawer → To drawer
- Amount, timestamp, business date
- Notes/reason

#### `BusinessDaySummary`
- End-of-day totals
- Total sales, tips, orders
- Per-driver breakdown
- Discrepancies

#### `OrderOrigin`
- Delivery platforms (DoorDash, UberEats, Phone, etc.)
- Logo image
- Color theme
- Default tip percentage

#### `Resource`
- File uploads (PDFs, images)
- Categorized for organization
- Accessible to all employees

#### `AppSetting`
- Key-value configuration
- Tax rate, defaults, etc.

---

## Technical Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **React Router** for navigation
- **React Query** for data fetching, caching, and state management
- **Material-UI** for UI components
- **Paraglide** for internationalization (prepared, not fully implemented)

### Backend
- **Supabase**:
  - PostgreSQL database
  - Row Level Security (RLS) for access control
  - Real-time subscriptions
  - Authentication
  - Storage (for avatars, logos, resources)
  - Remote Procedure Calls (RPCs) for complex operations

### State Management
- **React Query**: Server state, caching, mutations
- **Context API**: User session, business date, layout (mobile/desktop)
- **Local Storage**: User preferences, last selected tab

### Testing
- **Vitest**: Unit tests
- **Playwright**: End-to-end tests
- **React Testing Library**: Component tests

---

## Key Business Rules

1. **Orders must be assigned to a drawer** before they can be marked as paid
2. **Drawers must be closed** before the business day can be closed
3. **Closed drawers are locked** - orders cannot be edited
4. **Drivers can only see their own orders** (filtered by their drawer)
5. **Cash transfers require both source and destination drawers** to be open
6. **Business dates are timezone-aware** - day changes at system-defined cutoff
7. **Soft deletes** - Users and data are marked deleted, not removed from DB
8. **Food orders are out of scope** - This system tracks delivery fees and tips only

---

## Known Limitations

### Current Scope
- **Single location only**: Not designed for multi-location franchises
- **Food menu not included**: This is for delivery logistics, not POS
- **No customer database**: Customer names are text fields, not linked entities
- **No inventory tracking**: Tracks cash and orders, not ingredients

### Future Enhancements (TODOs in code)
- Profile editing (change name, email)
- Registers view in Admin Dashboard
- Report generation and export
- Business date display at top of screen
- Improved scrolling in mobile order area
- Custom toast animations (sad/happy pizza icons)
- Undo functionality for mutations

---

## Deployment Notes

- **Recommended Hosting**: Vercel (free tier sufficient)
- **Database**: Supabase (free tier sufficient for single pizzeria)
- **Cost**: Can run for $0/month using free tiers
- **Environment Variables**: See `.env.example`
- **Build Command**: `npm run build`
- **Dev Server**: `npm run dev`

---

## Support & Handoff

This application was built to be handed off to a non-technical pizzeria owner. Key considerations:

✅ **Low maintenance**: Built with stable, popular technologies  
✅ **Well documented**: SETUP.md, DEPLOYMENT.md, CODE_REVIEW.md  
✅ **Free to run**: Uses free tiers of Vercel + Supabase  
✅ **Mobile-first**: Works on any device  
✅ **Tested**: E2E tests ensure reliability  
✅ **Type-safe**: TypeScript reduces runtime errors  

For setup instructions, see `SETUP.md`  
For deployment instructions, see `DEPLOYMENT.md`  
For cost optimization, see `COST_OPTIMIZATION.md`
