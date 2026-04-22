# Database Visual Summary

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROPSYNC SYSTEM LAYERS                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (Next.js Frontend)                                      │
│  - Property Wizard (9 steps)                                                │
│  - Dashboard & Analytics                                                    │
│  - Reservation Management                                                   │
│  - Cleaning Job Scheduler                                                   │
│  - Task Management                                                          │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 │ API Calls
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  APPLICATION LAYER (Server Actions / API Routes)                           │
│  - Authentication & Authorization                                           │
│  - Business Logic                                                           │
│  - Data Validation                                                          │
│  - File Upload (Supabase Storage)                                           │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 │ Supabase Client
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  DATA LAYER (Supabase / PostgreSQL)                                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│  │  Auth System    │  │  Core Tables    │  │  Operational    │            │
│  │  - auth.users   │  │  - properties   │  │  - reservations │            │
│  │  - public.users │  │  - property_*   │  │  - cleaning_jobs│            │
│  │  - roles        │  │  - owners       │  │  - tasks        │            │
│  │  - permissions  │  │  - images       │  │                 │            │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│                                                                             │
│  Row Level Security (RLS) enforced on all tables                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Property Data Model - The Heart of the System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PROPERTY DATA MODEL (STAR SCHEMA)                        │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   PROPERTIES    │ ◄─── FACT TABLE
                              │   (Core Data)   │
                              └────────┬────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
        │                              │                              │
┌───────▼────────┐            ┌────────▼────────┐            ┌───────▼────────┐
│  DIMENSION 1   │            │  DIMENSION 2    │            │  DIMENSION 3   │
│  Basic Info    │            │  Safety         │            │  Kitchen       │
│  - Address     │            │  - Detectors    │            │  - Appliances  │
│  - Year Built  │            │  - Locks        │            │  - Cookware    │
│  - Description │            │  - Emergency    │            │  - Dining      │
└────────────────┘            └─────────────────┘            └────────────────┘

        │                              │                              │
┌───────▼────────┐            ┌────────▼────────┐            ┌───────▼────────┐
│  DIMENSION 4   │            │  DIMENSION 5    │            │  DIMENSION 6   │
│  Bedrooms      │            │  Bathrooms      │            │  Technology    │
│  - Bed Config  │            │  - Shower/Bath  │            │  - WiFi        │
│  - Bedding     │            │  - Towels       │            │  - Smart Home  │
│  - Closets     │            │  - Toiletries   │            │  - TV/Streaming│
└────────────────┘            └─────────────────┘            └────────────────┘

        │                              │                              │
┌───────▼────────┐            ┌────────▼────────┐            ┌───────▼────────┐
│  DIMENSION 7   │            │  DIMENSION 8    │            │  DIMENSION 9   │
│  Practical     │            │  Location       │            │  Accessibility │
│  - Laundry     │            │  - Transport    │            │  - Step-free   │
│  - Cleaning    │            │  - Nearby       │            │  - Energy      │
│  - Climate     │            │  - Restaurants  │            │  - Sustainable │
└────────────────┘            └─────────────────┘            └────────────────┘

Benefits of this design:
✓ Modular - Each dimension can be updated independently
✓ Scalable - Easy to add new dimensions
✓ Wizard-friendly - Maps directly to UI steps
✓ Query-efficient - Join only what you need
```

---

## Data Flow: Property Creation Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   PROPERTY CREATION USER JOURNEY                            │
└─────────────────────────────────────────────────────────────────────────────┘

START: User clicks "Add Property"
  │
  ▼
┌─────────────────────────────────────┐
│ Step 0: Initialize                  │
│ ┌─────────────────────────────────┐ │
│ │ CREATE property_drafts record   │ │ ← Auto-save as user types
│ │ Store: { step: 0, data: {} }    │ │
│ └─────────────────────────────────┘ │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ Step 1: Basic Information           │  Progress: 0% → 11%
│ ┌─────────────────────────────────┐ │
│ │ INSERT INTO properties          │ │
│ │ INSERT INTO property_basic_info │ │
│ │ INSERT INTO checklist_completion│ │
│ │ UPDATE property_drafts          │ │
│ └─────────────────────────────────┘ │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ Step 2: Safety & Security           │  Progress: 11% → 22%
│ ┌─────────────────────────────────┐ │
│ │ INSERT INTO property_safety     │ │
│ │ UPDATE checklist_completion     │ │
│ │   SET safety_security = 100     │ │
│ │ UPDATE property_drafts          │ │
│ └─────────────────────────────────┘ │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ Step 3: Kitchen & Dining            │  Progress: 22% → 33%
│ ┌─────────────────────────────────┐ │
│ │ INSERT INTO property_kitchen    │ │
│ │ UPDATE checklist_completion     │ │
│ │   SET kitchen_dining = 100      │ │
│ └─────────────────────────────────┘ │
└────────────────┬────────────────────┘
                 │
                 ▼
        ... Steps 4-8 ...
                 │
                 ▼
┌─────────────────────────────────────┐
│ Step 9: Accessibility               │  Progress: 89% → 100%
│ ┌─────────────────────────────────┐ │
│ │ INSERT INTO property_accessibility│ │
│ │ UPDATE checklist_completion     │ │
│ │   SET accessibility = 100       │ │
│ │   SET overall = 100             │ │
│ │ UPDATE properties               │ │
│ │   SET status = 'active'         │ │
│ │ DELETE FROM property_drafts     │ │
│ └─────────────────────────────────┘ │
└────────────────┬────────────────────┘
                 │
                 ▼
END: Property is live and searchable!
```

---

## Operational Workflow: Reservation to Cleaning

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              RESERVATION → CLEANING → GUEST CYCLE                           │
└─────────────────────────────────────────────────────────────────────────────┘

DAY -7: Booking Received
  │
  ▼
┌──────────────────────────────┐
│ INSERT INTO reservations     │
│ - guest_name                 │
│ - check_in_date: 2026-03-01  │
│ - check_out_date: 2026-03-05 │
│ - status: 'confirmed'        │
└──────────────┬───────────────┘
               │
               │ TRIGGER: Auto-create cleaning job
               ▼
┌──────────────────────────────┐
│ INSERT INTO cleaning_jobs    │
│ - scheduled_date: 2026-03-05 │
│ - status: 'pending'          │
│ - assigned_to: NULL          │
└──────────────┬───────────────┘
               │
               │
DAY -3: Manager assigns cleaner
               │
               ▼
┌──────────────────────────────┐
│ UPDATE cleaning_jobs         │
│ SET assigned_to = cleaner_id │
└──────────────┬───────────────┘
               │
               │ Email notification sent
               │
DAY 0 (Check-out): Cleaner arrives
               │
               ▼
┌──────────────────────────────┐
│ UPDATE cleaning_jobs         │
│ SET status = 'in_progress'   │
│ SET started_at = NOW()       │
└──────────────┬───────────────┘
               │
               │ Cleaner uses mobile app
               │ Completes checklist
               ▼
┌──────────────────────────────┐
│ UPDATE cleaning_jobs         │
│ SET checklist_completed=true │
│ SET status = 'completed'     │
│ SET completed_at = NOW()     │
└──────────────┬───────────────┘
               │
               │ Property ready notification
               │
DAY 0 (Check-in): Guest arrives
               │
               ▼
┌──────────────────────────────┐
│ UPDATE reservations          │
│ SET status = 'active'        │
└──────────────┬───────────────┘
               │
               │
DAY +4: Guest checks out
               │
               ▼
┌──────────────────────────────┐
│ UPDATE reservations          │
│ SET status = 'completed'     │
└──────────────────────────────┘
               │
               ▼
        CYCLE REPEATS
```

---

## Permission System Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    RBAC PERMISSION CHECK FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

User Action: "Create Property"
  │
  ▼
┌─────────────────────────────────────┐
│ 1. Get User ID from auth.uid()      │
│    user_id = "abc-123"              │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 2. Query user_roles table           │
│    SELECT role_id                   │
│    FROM user_roles                  │
│    WHERE user_id = "abc-123"        │
│                                     │
│    Result: ["role-manager"]         │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 3. Query role_permissions table     │
│    SELECT permission_id             │
│    FROM role_permissions            │
│    WHERE role_id = "role-manager"   │
│                                     │
│    Result: ["perm-1", "perm-2"...]  │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 4. Query permissions table          │
│    SELECT *                         │
│    FROM permissions                 │
│    WHERE id IN ("perm-1", "perm-2") │
│    AND resource = 'properties'      │
│    AND action = 'create'            │
│                                     │
│    Result: 1 row found ✓            │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 5. Authorization Decision           │
│    ✓ ALLOW: User can create property│
└─────────────────────────────────────┘

If no permission found:
  ✗ DENY: Return 403 Forbidden
```

---

## Table Size & Growth Projections

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ESTIMATED TABLE SIZES                                    │
└─────────────────────────────────────────────────────────────────────────────┘

Assumptions:
- 100 properties
- 50 reservations per property per year
- 1 cleaning job per reservation
- 10 tasks per property per year

┌──────────────────────┬──────────┬────────────┬──────────────┐
│ Table                │ Rows     │ Avg Row KB │ Total Size   │
├──────────────────────┼──────────┼────────────┼──────────────┤
│ properties           │ 100      │ 1 KB       │ 100 KB       │
│ property_basic_info  │ 100      │ 2 KB       │ 200 KB       │
│ property_safety      │ 100      │ 3 KB       │ 300 KB       │
│ property_kitchen     │ 100      │ 2 KB       │ 200 KB       │
│ property_bedrooms    │ 100      │ 2 KB       │ 200 KB       │
│ property_bathrooms   │ 100      │ 2 KB       │ 200 KB       │
│ property_technology  │ 100      │ 2 KB       │ 200 KB       │
│ property_practical   │ 100      │ 3 KB       │ 300 KB       │
│ property_location    │ 100      │ 2 KB       │ 200 KB       │
│ property_accessibility│ 100     │ 2 KB       │ 200 KB       │
│ property_images      │ 500      │ 0.5 KB     │ 250 KB       │
│ checklist_completion │ 100      │ 1 KB       │ 100 KB       │
├──────────────────────┼──────────┼────────────┼──────────────┤
│ reservations         │ 5,000    │ 1 KB       │ 5 MB         │
│ cleaning_jobs        │ 5,000    │ 1 KB       │ 5 MB         │
│ tasks                │ 1,000    │ 1 KB       │ 1 MB         │
├──────────────────────┼──────────┼────────────┼──────────────┤
│ users                │ 50       │ 0.5 KB     │ 25 KB        │
│ roles                │ 5        │ 0.2 KB     │ 1 KB         │
│ permissions          │ 20       │ 0.3 KB     │ 6 KB         │
│ user_roles           │ 50       │ 0.2 KB     │ 10 KB        │
│ role_permissions     │ 50       │ 0.2 KB     │ 10 KB        │
├──────────────────────┼──────────┼────────────┼──────────────┤
│ TOTAL                │ 12,575   │            │ ~13 MB       │
└──────────────────────┴──────────┴────────────┴──────────────┘

Growth Rate (per year):
- Properties: +20% (20 new properties)
- Reservations: +5,000 (50 per property × 100 properties)
- Cleaning Jobs: +5,000 (1 per reservation)
- Tasks: +1,000 (10 per property × 100 properties)

After 3 years: ~50 MB
After 5 years: ~80 MB

Conclusion: Database will remain small and performant
```

---

## Query Performance Patterns

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    QUERY PERFORMANCE GUIDE                                  │
└─────────────────────────────────────────────────────────────────────────────┘

FAST QUERIES (< 10ms):
✓ SELECT * FROM properties WHERE id = 'uuid'
  - Uses primary key index
  - Returns 1 row

✓ SELECT * FROM properties WHERE user_id = 'uuid'
  - Uses foreign key index
  - Returns ~10 rows per user

✓ SELECT * FROM reservations WHERE property_id = 'uuid'
  - Uses foreign key index
  - Returns ~50 rows per property

MEDIUM QUERIES (10-100ms):
⚠ SELECT p.*, pbi.*, ps.*, pk.* 
  FROM properties p
  JOIN property_basic_info pbi ON p.id = pbi.property_id
  JOIN property_safety ps ON p.id = ps.property_id
  JOIN property_kitchen pk ON p.id = pk.property_id
  - Multiple joins
  - Returns ~100 rows with many columns

⚠ SELECT * FROM properties_complete WHERE id = 'uuid'
  - Denormalized table with 130 columns
  - Large row size

SLOW QUERIES (> 100ms):
✗ SELECT * FROM properties WHERE building_name LIKE '%apartment%'
  - Full table scan (no index on building_name)
  - Use full-text search instead

✗ SELECT * FROM reservations WHERE guest_name LIKE '%John%'
  - Full table scan
  - Add index or use search service

OPTIMIZATION TIPS:
1. Always filter by indexed columns (id, user_id, property_id)
2. Use LIMIT for pagination
3. Only SELECT columns you need
4. Use properties_complete sparingly (130 columns!)
5. Add indexes for frequently filtered columns
```

---

## Backup Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    RECOMMENDED BACKUP STRATEGY                              │
└─────────────────────────────────────────────────────────────────────────────┘

TIER 1: Critical Data (Backup every 6 hours)
  ┌─────────────────────────────────────┐
  │ • properties                        │
  │ • property_* (all detail tables)    │
  │ • users                             │
  │ • reservations                      │
  └─────────────────────────────────────┘
  
  Why: Core business data, difficult to recreate

TIER 2: Operational Data (Backup daily)
  ┌─────────────────────────────────────┐
  │ • cleaning_jobs                     │
  │ • tasks                             │
  │ • property_images                   │
  └─────────────────────────────────────┘
  
  Why: Important but can be recreated from external sources

TIER 3: Reference Data (Backup weekly)
  ┌─────────────────────────────────────┐
  │ • roles                             │
  │ • permissions                       │
  │ • role_permissions                  │
  │ • user_roles                        │
  │ • owners                            │
  └─────────────────────────────────────┘
  
  Why: Rarely changes, easy to recreate

TIER 4: Transient Data (No backup needed)
  ┌─────────────────────────────────────┐
  │ • property_drafts                   │
  │ • checklist_completion              │
  └─────────────────────────────────────┘
  
  Why: Temporary data, can be recalculated

Retention Policy:
- Hourly backups: Keep 7 days
- Daily backups: Keep 30 days
- Weekly backups: Keep 1 year
- Monthly backups: Keep forever
```
