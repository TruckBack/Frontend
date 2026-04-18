# TruckBack UI Implementation Plan

## Project Overview

**Application:** TruckBack - Two-sided delivery logistics marketplace  
**Type:** Mobile-first web app (responsive across mobile & desktop)  
**Tech Stack:** React 19, React Router 7, MUI 7, Emotion, TypeScript, Vite  
**Purpose:** Connect customers needing deliveries with available drivers

---

## Core Architecture

### User Roles
- **Driver**: Browse orders, assign to self, mark complete (Primary color: #1976d2)
- **Customer**: Create orders, track own, review history (Secondary color: #dc004e)

### Current Pages
- `Login.tsx` - Dual-mode (login/register), role selector, OAuth options
- `DriverHome.tsx` - Driver dashboard with workflow list
- `CustomerHome.tsx` - Customer dashboard with workflow list

### Routing
- `/login` - Public route
- `/` - Auto-redirects by role
- `/driver/home` - Driver-only dashboard
- `/customer/home` - Customer-only dashboard

### State Management
- **AuthContext**: User state, login/logout/register, token management
- **ThemeContext**: Light/dark mode toggle (persistent in localStorage)

### Services
- **auth.ts**: Login, register, OAuth (currently mocked)
- **api.ts**: Axios client with auto token refresh via interceptors
- **storage.ts**: localStorage wrapper for auth tokens
- **types.ts**: User & Role type definitions

---

## Design Constraints & Guidelines

### Mobile-First Approach ✅
- **Primary design target:** Mobile viewports (UI specs provided are mobile)
- **Responsive scaling:** Use MUI breakpoints (`xs`, `sm`, `md`, `lg`) to enhance for desktop
- **All components** must work seamlessly on both mobile and larger screens
- **Layout:** Stack vertically on mobile, adjust spacing/grid on desktop

### Styling Requirements ✅
- Use MUI `sx` prop (emotion-based) for all styling
- **Never hardcode colors** - use `useTheme()` and theme palette
- **Preserve existing theme** - colors, dark/light mode, typography
- **Implement layout only** - not colors or theme changes
- Maintain consistency with current design patterns

### Component Patterns ✅
- Use MUI components: `Paper`, `Stack`, `Box`, `Button`, `TextField`, `Card`, etc.
- Role badges: `color="primary"` for drivers, `color="secondary"` for customers
- Responsive spacing: `sx={{ padding: { xs: 2, sm: 3, md: 4 } }}`
- Keep auth flow & navigation intact - don't modify core logic

---

## Implementation Workflow

### Process for Each UI Spec
1. **Receive image** specifying which side (Driver/Customer) and which page
2. **Analyze layout** - identify sections, components, hierarchy
3. **Implement structure** - use MUI components and responsive design
4. **Apply mobile-first** - default to mobile, enhance with breakpoints
5. **Preserve theme** - use existing colors, maintain design system
6. **Test responsiveness** - ensure works on mobile and desktop
7. **Maintain auth & routing** - don't break existing navigation

### File Structure for New Components
```
src/
├── components/           (reusable UI components)
├── pages/               (page-level components)
│   ├── Login.tsx        (existing)
│   ├── DriverHome.tsx   (existing)
│   └── CustomerHome.tsx (existing)
├── contexts/            (existing: AuthContext, ThemeContext)
└── services/            (existing: api, auth, storage, types)
```

---

## Current State & Ready State

### Existing Implementation
✅ Full auth flow with OAuth integration  
✅ Role-based routing & protection  
✅ MUI theme system with light/dark modes  
✅ Basic home pages for driver & customer  
✅ Responsive login page  
✅ Token refresh via interceptors  

### Ready for
✅ New UI layout implementations  
✅ New pages or page modifications  
✅ New components as needed  
✅ Additional features on existing pages  

### Not to Modify
❌ AuthContext or auth flow logic  
❌ ThemeContext or color definitions  
❌ API interceptors or token strategy  
❌ Core routing structure  

---

## Mobile Breakpoints (MUI Standard)

- **xs**: 0px (mobile default)
- **sm**: 600px (tablet)
- **md**: 960px (small desktop)
- **lg**: 1280px (large desktop)
- **xl**: 1920px (extra large)

**Example responsive pattern:**
```jsx
sx={{
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: { xs: 1, sm: 2, md: 3 },
  padding: { xs: 2, sm: 3, md: 4 },
  maxWidth: { xs: '100%', md: '1200px' }
}}
```

---

## Next Steps

⏳ **Awaiting:** UI spec images with layout mockups  
📍 **For each spec, provide:** Image + indication of (Driver/Customer) + target page  
🎨 **Will implement:** Layout structure only, preserving existing theme & functionality  

---

## Notes for Refinement
- Add any specific design patterns or component requirements here
- Specify any deviations from standard MUI approach
- Document any custom components that should be created
- List any additional pages or features beyond what's shown
