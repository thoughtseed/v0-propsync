# Database Schema Documentation

## Overview

This document provides a comprehensive visual guide to the PropSync database schema, including all tables, relationships, and data flows.

## Table of Contents

1. [Core Entity Relationships](#core-entity-relationships)
2. [Table Groups](#table-groups)
3. [Detailed Table Schemas](#detailed-table-schemas)
4. [Data Flow Diagrams](#data-flow-diagrams)

---

## Core Entity Relationships

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CORE ENTITIES OVERVIEW                          │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │  USERS   │ (auth.users + public.users)
    └────┬─────┘
         │
         ├─────────────────────────────────────────────┐
         │                                             │
         ▼                                             ▼
    ┌──────────┐                                 ┌──────────┐
    │  OWNERS  │                                 │  ROLES   │
    └────┬─────┘                                 └────┬─────┘
         │                                             │
         │                                             ▼
         │                                    ┌─────────────────┐
         │                                    │  PERMISSIONS    │
         │                                    └─────────────────┘
         │
         ▼
    ┌────────────┐
    │ PROPERTIES │ ◄──────────────────────────────────┐
    └─────┬──────┘                                    │
          │                                           │
          ├───────────────┬───────────────┬───────────────┐
          │               │               │               │
          ▼               ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │PROPERTY  │    │PROPERTY  │    │PROPERTY  │    │PROPERTY  │
    │BASIC_INFO│    │  SAFETY  │    │ KITCHEN  │    │ BEDROOMS │
    └──────────┘    └──────────┘    └──────────┘    └──────────┘

          │               │               │               │
          ▼               ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │PROPERTY  │    │PROPERTY  │    │PROPERTY  │    │PROPERTY  │
    │BATHROOMS │    │TECHNOLOGY│    │PRACTICAL │    │ LOCATION │
    └──────────┘    └──────────┘    └──────────┘    └──────────┘

          │               │               │
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │PROPERTY  │    │PROPERTY  │    │CHECKLIST │
    │ACCESSIBIL│    │  IMAGES  │    │COMPLETION│
    └──────────┘    └──────────┘    └──────────┘

    ┌────────────┐
    │ PROPERTIES │
    └─────┬──────┘
          │
          ├───────────────┬───────────────┐
          │               │               │
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │RESERVAT- │    │CLEANING  │    │  TASKS   │
    │  IONS    │    │  JOBS    │    │          │
    └──────────┘    └──────────┘    └──────────┘
          │               │
          └───────┬───────┘
                  │
                  ▼
            (Operational Data)
```

---

## Table Groups

### 1. User Management & Authentication

```
┌─────────────────────────────────────────────────────────────┐
│              USER MANAGEMENT & AUTHENTICATION               │
└─────────────────────────────────────────────────────────────┘

    auth.users (Supabase Auth)
         │
         ▼
    ┌──────────────┐
    │ public.users │ ← Extends auth.users with app-specific data
    └──────┬───────┘
           │
           ├──────────────────┐
           │                  │
           ▼                  ▼
    ┌────────────┐     ┌────────────┐
    │ user_roles │     │   owners   │
    └─────┬──────┘     └────────────┘
          │
          ▼
    ┌────────────┐
    │   roles    │
    └─────┬──────┘
          │
          ▼
    ┌──────────────────┐
    │ role_permissions │
    └─────┬────────────┘
          │
          ▼
    ┌──────────────┐
    │ permissions  │
    └──────────────┘

Fields:
- users: id, email, role, full_name, created_at
- roles: id, name (admin|manager|staff|cleaner|owner), description
- permissions: id, resource, action, description
- user_roles: user_id, role_id (many-to-many)
- role_permissions: role_id, permission_id (many-to-many)
- owners: id, user_id, full_name, email, phone
```

### 2. Core Property System

```
┌─────────────────────────────────────────────────────────────┐
│                   CORE PROPERTY SYSTEM                      │
└─────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │  properties  │ ← Main property table
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ property_    │  │ properties_  │  │ property_    │
│ drafts       │  │ complete     │  │ images       │
└──────────────┘  └──────────────┘  └──────────────┘
  (Work in         (Denormalized      (Photo URLs)
   Progress)        view)

Properties Table Fields:
- id (uuid, PK)
- property_reference (text)
- building_name (text)
- unit_number (text)
- property_type (text)
- square_meters (numeric)
- bedrooms (integer)
- bathrooms (integer)
- max_occupancy (integer)
- status (text: active|maintenance|inactive|pending)
- user_id (uuid, FK → auth.users)
- owner_id (uuid, FK → owners)
- created_at, updated_at (timestamptz)
```

### 3. Property Detail Tables (Wizard Steps)

```
┌─────────────────────────────────────────────────────────────┐
│         PROPERTY DETAIL TABLES (Wizard Steps)               │
└─────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │  properties  │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┬──────────────┐
        │                  │                  │              │
        ▼                  ▼                  ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ property_    │  │ property_    │  │ property_    │  │ property_    │
│ basic_info   │  │ safety       │  │ kitchen      │  │ bedrooms     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
  Step 1: Basic     Step 2: Safety   Step 3: Kitchen   Step 4: Bedrooms
  - full_address    - smoke_detectors - major_appliances - bed_configs
  - year_built      - fire_extinguish - small_appliances - extra_bedding
  - description     - emergency_exit  - cookware        - mattress_type
  - floor_plan_url  - door_lock_type  - dining_capacity - closet_details

        │                  │                  │              │
        ▼                  ▼                  ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ property_    │  │ property_    │  │ property_    │  │ property_    │
│ bathrooms    │  │ technology   │  │ practical    │  │ location     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
  Step 5: Bath      Step 6: Tech      Step 7: Practical Step 8: Location
  - shower_bath     - wifi_network    - washer_details  - public_transport
  - towel_details   - wifi_password   - dryer_details   - nearby_locations
  - toiletries      - internet_speed  - vacuum_details  - walking_score
  - hair_dryer      - smart_home      - ac_units        - restaurants

        │
        ▼
┌──────────────┐
│ property_    │
│ accessibility│
└──────────────┘
  Step 9: Access
  - step_free_access
  - elevator_access
  - energy_rating
  - recycling_info
```

### 4. Progress Tracking

```
┌─────────────────────────────────────────────────────────────┐
│                    PROGRESS TRACKING                        │
└─────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │  properties  │
    └──────┬───────┘
           │
           ▼
    ┌──────────────────────┐
    │ checklist_completion │ ← Tracks wizard completion %
    └──────────────────────┘

Fields (all integers 0-100):
- property_id (FK)
- basic_information
- safety_security
- kitchen_dining
- bedrooms
- bathrooms
- technology
- practical_living
- location_lifestyle
- accessibility_sustainability
- overall (calculated)
```

### 5. Operational Tables

```
┌─────────────────────────────────────────────────────────────┐
│                   OPERATIONAL TABLES                        │
└─────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │  properties  │
    └──────┬───────┘
           │
           ├────────────────┬────────────────┐
           │                │                │
           ▼                ▼                ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │ reservations │  │ cleaning_jobs│  │    tasks     │
    └──────┬───────┘  └──────┬───────┘  └──────────────┘
           │                 │
           └────────┬────────┘
                    │
                    ▼
            (Links reservations
             to cleaning jobs)

Reservations:
- id, property_id
- guest_name, guest_email, guest_phone
- check_in_date, check_out_date
- check_in_time, check_out_time
- status (confirmed|cancelled|completed)
- adults, children
- source (hospitable|airbnb|booking|direct)
- external_id, notes

Cleaning Jobs:
- id, property_id, reservation_id
- assigned_to (FK → users)
- scheduled_date
- status (pending|in_progress|completed|cancelled)
- checklist_completed (boolean)
- started_at, completed_at
- notes

Tasks:
- id, property_id
- assigned_to, created_by (FK → users)
- title, description
- status (todo|in_progress|done|cancelled)
- priority (low|medium|high|urgent)
- due_date
```

---

## Detailed Table Schemas

### Properties Table (Main Entity)

```
┌─────────────────────────────────────────────────────────────┐
│                    PROPERTIES TABLE                         │
└─────────────────────────────────────────────────────────────┘

Table: properties
RLS: Enabled
Rows: 0

Columns:
┌──────────────────┬──────────┬──────────┬─────────────────────┐
│ Column           │ Type     │ Nullable │ Default             │
├──────────────────┼──────────┼──────────┼─────────────────────┤
│ id               │ uuid     │ No       │ uuid_generate_v4()  │
│ created_at       │ timestamptz│ Yes    │ now()               │
│ updated_at       │ timestamptz│ Yes    │ now()               │
│ property_reference│ text    │ No       │ -                   │
│ building_name    │ text     │ No       │ -                   │
│ unit_number      │ text     │ No       │ -                   │
│ property_type    │ text     │ No       │ -                   │
│ square_meters    │ numeric  │ Yes      │ -                   │
│ bedrooms         │ integer  │ No       │ -                   │
│ bathrooms        │ integer  │ No       │ -                   │
│ max_occupancy    │ integer  │ No       │ -                   │
│ status           │ text     │ No       │ 'pending'           │
│ user_id          │ uuid     │ No       │ -                   │
│ owner_id         │ uuid     │ Yes      │ -                   │
└──────────────────┴──────────┴──────────┴─────────────────────┘

Primary Key: id
Foreign Keys:
  - user_id → auth.users.id
  - owner_id → owners.id

Referenced By (14 tables):
  - property_basic_info
  - property_safety
  - property_kitchen
  - property_bedrooms
  - property_bathrooms
  - property_technology
  - property_practical
  - property_location
  - property_accessibility
  - property_images
  - checklist_completion
  - reservations
  - cleaning_jobs
  - tasks
```

---

## Data Flow Diagrams

### Property Creation Workflow

```
┌─────────────────────────────────────────────────────────────┐
│            PROPERTY CREATION WORKFLOW                       │
└─────────────────────────────────────────────────────────────┘

    User Starts Wizard
           │
           ▼
    ┌──────────────────┐
    │ property_drafts  │ ← Auto-save draft data
    │ (JSONB storage)  │
    └────────┬─────────┘
             │
             │ User completes Step 1
             ▼
    ┌──────────────────┐
    │   properties     │ ← Create main record
    └────────┬─────────┘
             │
             ├─────────────────────────────────┐
             │                                 │
             ▼                                 ▼
    ┌──────────────────┐            ┌──────────────────┐
    │ property_        │            │ checklist_       │
    │ basic_info       │            │ completion       │
    └────────┬─────────┘            └──────────────────┘
             │                       (Initialize all to 0)
             │
             │ User completes Step 2
             ▼
    ┌──────────────────┐
    │ property_safety  │
    └────────┬─────────┘
             │
             │ Update completion %
             ▼
    ┌──────────────────┐
    │ checklist_       │
    │ completion       │ ← safety_security = 100
    └────────┬─────────┘
             │
             │ Continue through steps 3-9...
             ▼
    ┌──────────────────┐
    │ All detail       │
    │ tables filled    │
    └────────┬─────────┘
             │
             │ Wizard complete
             ▼
    ┌──────────────────┐
    │ properties       │
    │ status='active'  │ ← Property goes live
    └──────────────────┘
```

### Reservation & Cleaning Workflow

```
┌─────────────────────────────────────────────────────────────┐
│         RESERVATION & CLEANING WORKFLOW                     │
└─────────────────────────────────────────────────────────────┘

    External Booking (Hospitable/Airbnb)
           │
           ▼
    ┌──────────────────┐
    │  reservations    │
    │  status='confirmed'
    └────────┬─────────┘
             │
             │ Auto-create cleaning job
             ▼
    ┌──────────────────┐
    │  cleaning_jobs   │
    │  status='pending'│
    │  scheduled_date  │
    └────────┬─────────┘
             │
             │ Manager assigns cleaner
             ▼
    ┌──────────────────┐
    │  cleaning_jobs   │
    │  assigned_to=    │
    │  user_id         │
    └────────┬─────────┘
             │
             │ Cleaner starts job
             ▼
    ┌──────────────────┐
    │  cleaning_jobs   │
    │  status='in_progress'
    │  started_at=now()│
    └────────┬─────────┘
             │
             │ Cleaner completes checklist
             ▼
    ┌──────────────────┐
    │  cleaning_jobs   │
    │  checklist_      │
    │  completed=true  │
    └────────┬─────────┘
             │
             │ Job finished
             ▼
    ┌──────────────────┐
    │  cleaning_jobs   │
    │  status='completed'
    │  completed_at=now()
    └────────┬─────────┘
             │
             │ Guest checks in
             ▼
    ┌──────────────────┐
    │  reservations    │
    │  status='active' │
    └────────┬─────────┘
             │
             │ Guest checks out
             ▼
    ┌──────────────────┐
    │  reservations    │
    │  status='completed'
    └──────────────────┘
```

### User Permission Flow

```
┌─────────────────────────────────────────────────────────────┐
│              USER PERMISSION FLOW                           │
└─────────────────────────────────────────────────────────────┘

    User Login (Supabase Auth)
           │
           ▼
    ┌──────────────────┐
    │   auth.users     │
    └────────┬─────────┘
             │
             │ Check app profile
             ▼
    ┌──────────────────┐
    │  public.users    │
    │  role='readonly' │ ← Default role
    └────────┬─────────┘
             │
             │ Get assigned roles
             ▼
    ┌──────────────────┐
    │   user_roles     │ ← Many-to-many
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │     roles        │
    │  name='manager'  │
    └────────┬─────────┘
             │
             │ Get role permissions
             ▼
    ┌──────────────────┐
    │ role_permissions │ ← Many-to-many
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │  permissions     │
    │  resource='properties'
    │  action='create' │
    └──────────────────┘
             │
             ▼
    Authorization Check
    (Can user perform action?)
```

---

## Key Relationships Summary

```
┌─────────────────────────────────────────────────────────────┐
│            KEY RELATIONSHIPS SUMMARY                        │
└─────────────────────────────────────────────────────────────┘

1. ONE-TO-MANY Relationships:
   ┌──────────────┐     1:N     ┌──────────────┐
   │    users     │ ──────────> │  properties  │
   └──────────────┘             └──────────────┘

   ┌──────────────┐     1:N     ┌──────────────┐
   │   owners     │ ──────────> │  properties  │
   └──────────────┘             └──────────────┘

   ┌──────────────┐     1:1     ┌──────────────┐
   │  properties  │ ──────────> │ property_*   │
   └──────────────┘             └──────────────┘
                                (9 detail tables)

   ┌──────────────┐     1:N     ┌──────────────┐
   │  properties  │ ──────────> │ reservations │
   └──────────────┘             └──────────────┘

   ┌──────────────┐     1:N     ┌──────────────┐
   │ reservations │ ──────────> │cleaning_jobs │
   └──────────────┘             └──────────────┘

2. MANY-TO-MANY Relationships:
   ┌──────────────┐             ┌──────────────┐
   │    users     │ <────┐  ┌──>│    roles     │
   └──────────────┘      │  │   └──────────────┘
                    ┌────┴──┴────┐
                    │ user_roles  │
                    └─────────────┘

   ┌──────────────┐             ┌──────────────┐
   │    roles     │ <────┐  ┌──>│ permissions  │
   └──────────────┘      │  │   └──────────────┘
                    ┌────┴──┴────┐
                    │role_perms   │
                    └─────────────┘

3. SELF-REFERENCING:
   None currently

4. POLYMORPHIC:
   None currently
```

---

## Table Statistics

| Table Name              | Columns | Has RLS | Current Rows | Primary Use                |
|------------------------|---------|---------|--------------|----------------------------|
| properties             | 14      | ✓       | 0            | Main property records      |
| property_basic_info    | 8       | ✓       | 0            | Step 1: Basic details      |
| property_safety        | 15      | ✓       | 0            | Step 2: Safety features    |
| property_kitchen       | 14      | ✓       | 0            | Step 3: Kitchen details    |
| property_bedrooms      | 11      | ✓       | 0            | Step 4: Bedroom config     |
| property_bathrooms     | 13      | ✓       | 0            | Step 5: Bathroom details   |
| property_technology    | 13      | ✓       | 0            | Step 6: Tech features      |
| property_practical     | 20      | ✓       | 0            | Step 7: Practical living   |
| property_location      | 14      | ✓       | 0            | Step 8: Location info      |
| property_accessibility | 17      | ✓       | 0            | Step 9: Accessibility      |
| property_images        | 6       | ✓       | 0            | Property photos            |
| property_drafts        | 5       | ✓       | 0            | Work-in-progress saves     |
| properties_complete    | 130     | ✓       | 0            | Denormalized view          |
| checklist_completion   | 14      | ✓       | 0            | Progress tracking          |
| users                  | 5       | ✓       | 0            | User profiles              |
| roles                  | 4       | ✓       | 0            | Role definitions           |
| permissions            | 4       | ✓       | 0            | Permission definitions     |
| user_roles             | 3       | ✓       | 0            | User-role assignments      |
| role_permissions       | 3       | ✓       | 0            | Role-permission mapping    |
| owners                 | 7       | ✓       | 0            | Property owners            |
| reservations           | 16      | ✓       | 0            | Guest bookings             |
| cleaning_jobs          | 12      | ✓       | 0            | Cleaning schedules         |
| tasks                  | 11      | ✓       | 0            | General task management    |

---

## Security Notes

All tables have **Row Level Security (RLS) enabled**, which means:
- Access is controlled at the database level
- Users can only see/modify data they have permission for
- Policies must be defined for INSERT, SELECT, UPDATE, DELETE operations
- Auth context (user_id, role) is used to enforce policies

---

## Next Steps

1. **Define RLS Policies**: Create security policies for each table
2. **Seed Initial Data**: Add roles, permissions, and test users
3. **Create Views**: Build convenient views for common queries
4. **Add Indexes**: Optimize frequently queried columns
5. **Set up Triggers**: Auto-update timestamps, completion percentages
