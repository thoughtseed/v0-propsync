# Database Entity-Relationship Diagram (ERD)

## Complete ERD - All Tables and Relationships

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           PROPSYNC DATABASE - COMPLETE ERD                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────────┐
                                    │  auth.users     │
                                    │  (Supabase)     │
                                    └────────┬────────┘
                                             │
                                             │ 1:1
                                             ▼
    ┌──────────────┐              ┌─────────────────┐              ┌──────────────┐
    │   owners     │              │  public.users   │              │    roles     │
    │──────────────│  N:1         │─────────────────│  N:M         │──────────────│
    │ PK id        │◄─────────────│ PK id           │◄────────────►│ PK id        │
    │ FK user_id   │              │ FK (auth.users) │              │    name      │
    │    full_name │              │    email        │              │    description│
    │    email     │              │    role         │              └──────┬───────┘
    │    phone     │              │    full_name    │                     │
    └──────┬───────┘              └────────┬────────┘                     │ N:M
           │                               │                              │
           │ 1:N                           │ 1:N                          ▼
           │                               │                    ┌──────────────────┐
           │                               │                    │  permissions     │
           │                               │                    │──────────────────│
           │                               │                    │ PK id            │
           │                               │                    │    resource      │
           │                               │                    │    action        │
           │                               │                    │    description   │
           │                               │                    └──────────────────┘
           │                               │
           │                               │
           ▼                               ▼
    ┌─────────────────────────────────────────────────────────┐
    │                    properties                           │
    │─────────────────────────────────────────────────────────│
    │ PK id                                                   │
    │ FK user_id          → auth.users.id                     │
    │ FK owner_id         → owners.id                         │
    │    property_reference                                   │
    │    building_name                                        │
    │    unit_number                                          │
    │    property_type                                        │
    │    square_meters                                        │
    │    bedrooms                                             │
    │    bathrooms                                            │
    │    max_occupancy                                        │
    │    status (active|maintenance|inactive|pending)         │
    │    created_at, updated_at                               │
    └────────────────────────┬────────────────────────────────┘
                             │
                             │ 1:1 relationships to detail tables
                             │
        ┌────────────────────┼────────────────────┬────────────────────┐
        │                    │                    │                    │
        ▼                    ▼                    ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│property_basic_   │ │property_safety   │ │property_kitchen  │ │property_bedrooms │
│info              │ │                  │ │                  │ │                  │
│──────────────────│ │──────────────────│ │──────────────────│ │──────────────────│
│PK id             │ │PK id             │ │PK id             │ │PK id             │
│FK property_id    │ │FK property_id    │ │FK property_id    │ │FK property_id    │
│  full_address    │ │  smoke_detectors │ │  major_appliances│ │  bed_configs     │
│  year_built      │ │  fire_extinguish │ │  small_appliances│ │  extra_bedding   │
│  year_renovated  │ │  emergency_exit  │ │  cookware        │ │  mattress_type   │
│  description     │ │  first_aid_loc   │ │  dishware_count  │ │  pillow_details  │
│  floor_plan_url  │ │  door_lock_type  │ │  dining_capacity │ │  closet_details  │
│  created_at      │ │  smart_lock_code │ │  water_filtration│ │  blackout_curtain│
│  updated_at      │ │  building_security│ │  coffee_tea     │ │  bedroom_electron│
└──────────────────┘ │  cctv_coverage   │ │  special_features│ │  furniture_inv   │
                     │  emergency_contact│ │  waste_disposal  │ │  bedroom_amenity │
                     │  window_security │ │  pantry_staples  │ │  created_at      │
                     │  balcony_safety  │ │  counter_material│ │  updated_at      │
                     │  child_safety    │ │  kitchen_photos  │ └──────────────────┘
                     │  created_at      │ │  created_at      │
                     │  updated_at      │ │  updated_at      │
                     └──────────────────┘ └──────────────────┘

        │                    │                    │                    │
        ▼                    ▼                    ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│property_bathrooms│ │property_technology│ │property_practical│ │property_location │
│                  │ │                  │ │                  │ │                  │
│──────────────────│ │──────────────────│ │──────────────────│ │──────────────────│
│PK id             │ │PK id             │ │PK id             │ │PK id             │
│FK property_id    │ │FK property_id    │ │FK property_id    │ │FK property_id    │
│  shower_bath_cfg │ │  wifi_network    │ │  washer_details  │ │  public_transport│
│  towel_details   │ │  wifi_password   │ │  dryer_details   │ │  nearby_locations│
│  toiletries      │ │  internet_speed  │ │  detergent_prov  │ │  walking_score   │
│  hair_dryer_avail│ │  smart_home_feat │ │  iron_board_avail│ │  neighborhood    │
│  hair_dryer_det  │ │  router_location │ │  drying_rack_loc │ │  restaurants     │
│  water_pressure  │ │  tv_details      │ │  laundry_basket  │ │  grocery_shopping│
│  hot_water_system│ │  streaming_svc   │ │  building_laundry│ │  tourist_attract │
│  ventilation     │ │  speaker_systems │ │  vacuum_details  │ │  emergency_svc   │
│  special_features│ │  remote_controls │ │  cleaning_supply │ │  local_tips      │
│  accessibility   │ │  charging_station│ │  cleaning_sched  │ │  weather_patterns│
│  created_at      │ │  backup_solutions│ │  special_instruc │ │  safety_assess   │
│  updated_at      │ │  created_at      │ │  stain_removal   │ │  created_at      │
└──────────────────┘ │  updated_at      │ │  ac_units_details│ │  updated_at      │
                     └──────────────────┘ │  heating_system  │ └──────────────────┘
                                          │  thermostat_instr│
                                          │  ventilation_sys │
                                          │  air_purifiers   │
                                          │  electrical_panel│
                                          │  created_at      │
                                          │  updated_at      │
                                          └──────────────────┘

        │
        ▼
┌──────────────────────┐
│property_accessibility│
│                      │
│──────────────────────│
│PK id                 │
│FK property_id        │
│  step_free_access    │
│  elevator_access     │
│  doorway_widths      │
│  bathroom_features   │
│  kitchen_height      │
│  visual_features     │
│  auditory_features   │
│  energy_rating       │
│  renewable_features  │
│  recycling_instruc   │
│  efficient_appliances│
│  water_conservation  │
│  eco_products        │
│  sustainable_material│
│  created_at          │
│  updated_at          │
└──────────────────────┘
```

## Property Support Tables

```
    ┌─────────────────┐
    │   properties    │
    └────────┬────────┘
             │
             ├──────────────────┬──────────────────┬──────────────────┐
             │                  │                  │                  │
             ▼                  ▼                  ▼                  ▼
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │property_images  │ │property_drafts  │ │properties_      │ │checklist_       │
    │                 │ │                 │ │complete         │ │completion       │
    │─────────────────│ │─────────────────│ │─────────────────│ │─────────────────│
    │PK id            │ │PK id            │ │PK id            │ │PK id            │
    │FK property_id   │ │FK user_id       │ │FK user_id       │ │FK property_id   │
    │   url           │ │   data (JSONB)  │ │   (all fields   │ │   basic_info    │
    │   type          │ │   created_at    │ │    from all     │ │   safety_sec    │
    │   display_order │ │   updated_at    │ │    tables       │ │   kitchen_dining│
    │   created_at    │ └─────────────────┘ │    combined)    │ │   bedrooms      │
    └─────────────────┘                     │   *130 columns* │ │   bathrooms     │
                                            └─────────────────┘ │   technology    │
                                                                │   practical     │
                                                                │   location      │
                                                                │   accessibility │
                                                                │   overall       │
                                                                │   created_at    │
                                                                │   updated_at    │
                                                                └─────────────────┘
```

## Operational Tables

```
    ┌─────────────────┐
    │   properties    │
    └────────┬────────┘
             │
             ├──────────────────┬──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │  reservations   │ │  cleaning_jobs  │ │     tasks       │
    │─────────────────│ │─────────────────│ │─────────────────│
    │PK id            │ │PK id            │ │PK id            │
    │FK property_id   │ │FK property_id   │ │FK property_id   │
    │   guest_name    │ │FK reservation_id│ │FK assigned_to   │
    │   guest_email   │ │FK assigned_to   │ │FK created_by    │
    │   guest_phone   │ │   scheduled_date│ │   title         │
    │   check_in_date │ │   status        │ │   description   │
    │   check_out_date│ │   checklist_done│ │   status        │
    │   check_in_time │ │   notes         │ │   priority      │
    │   check_out_time│ │   started_at    │ │   due_date      │
    │   status        │ │   completed_at  │ │   created_at    │
    │   adults        │ │   created_at    │ │   updated_at    │
    │   children      │ │   updated_at    │ └─────────────────┘
    │   source        │ └─────────────────┘
    │   external_id   │          │
    │   notes         │          │
    │   created_at    │          │
    │   updated_at    │          │
    └─────────────────┘          │
             │                   │
             └───────────────────┘
                      │
                      │ Links reservation
                      │ to cleaning job
```

## RBAC (Role-Based Access Control) Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    RBAC RELATIONSHIP DIAGRAM                            │
└─────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐
    │     users       │
    └────────┬────────┘
             │
             │ N:M (via user_roles)
             │
             ▼
    ┌─────────────────┐
    │  user_roles     │ ← Junction table
    │─────────────────│
    │FK user_id       │
    │FK role_id       │
    │   created_at    │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │     roles       │
    │─────────────────│
    │PK id            │
    │   name          │ ← admin, manager, staff, cleaner, owner
    │   description   │
    │   created_at    │
    └────────┬────────┘
             │
             │ N:M (via role_permissions)
             │
             ▼
    ┌─────────────────┐
    │role_permissions │ ← Junction table
    │─────────────────│
    │FK role_id       │
    │FK permission_id │
    │   created_at    │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  permissions    │
    │─────────────────│
    │PK id            │
    │   resource      │ ← properties, users, reservations, etc.
    │   action        │ ← create, read, update, delete
    │   description   │
    │   created_at    │
    └─────────────────┘

Example Permission Check:
  User → user_roles → roles → role_permissions → permissions
  
  Can user "john@example.com" perform "create" on "properties"?
  1. Get user's roles
  2. Get permissions for those roles
  3. Check if permission exists for resource="properties", action="create"
```

---

## Cardinality Reference

```
Relationship Types Used:

1:1  (One-to-One)
  - properties → property_basic_info
  - properties → property_safety
  - properties → property_kitchen
  - properties → property_bedrooms
  - properties → property_bathrooms
  - properties → property_technology
  - properties → property_practical
  - properties → property_location
  - properties → property_accessibility
  - properties → checklist_completion

1:N  (One-to-Many)
  - users → properties
  - owners → properties
  - properties → property_images
  - properties → reservations
  - properties → cleaning_jobs
  - properties → tasks
  - reservations → cleaning_jobs
  - users → tasks (assigned_to)
  - users → tasks (created_by)
  - users → cleaning_jobs (assigned_to)

N:M  (Many-to-Many)
  - users ↔ roles (via user_roles)
  - roles ↔ permissions (via role_permissions)
```

---

## Data Type Legend

```
Common Data Types Used:

uuid          - Universally Unique Identifier (Primary/Foreign Keys)
text          - Variable-length string
integer       - Whole numbers
numeric       - Decimal numbers
boolean       - true/false
timestamptz   - Timestamp with timezone
date          - Date only (no time)
time          - Time only (no date)
jsonb         - JSON Binary (structured data)
ARRAY         - PostgreSQL array type (e.g., text[])

Special Constraints:

CHECK         - Validates data against conditions
              Example: status IN ('active', 'inactive', 'pending')
              
UNIQUE        - Ensures no duplicate values
              Example: roles.name must be unique
              
NOT NULL      - Field must have a value
              Example: properties.property_reference
              
DEFAULT       - Auto-fills value if not provided
              Example: status DEFAULT 'pending'
```

---

## Index Recommendations

```
Suggested Indexes for Performance:

Properties:
  - CREATE INDEX idx_properties_user_id ON properties(user_id);
  - CREATE INDEX idx_properties_owner_id ON properties(owner_id);
  - CREATE INDEX idx_properties_status ON properties(status);
  - CREATE INDEX idx_properties_created_at ON properties(created_at DESC);

Reservations:
  - CREATE INDEX idx_reservations_property_id ON reservations(property_id);
  - CREATE INDEX idx_reservations_check_in ON reservations(check_in_date);
  - CREATE INDEX idx_reservations_check_out ON reservations(check_out_date);
  - CREATE INDEX idx_reservations_status ON reservations(status);

Cleaning Jobs:
  - CREATE INDEX idx_cleaning_jobs_property_id ON cleaning_jobs(property_id);
  - CREATE INDEX idx_cleaning_jobs_assigned_to ON cleaning_jobs(assigned_to);
  - CREATE INDEX idx_cleaning_jobs_scheduled_date ON cleaning_jobs(scheduled_date);
  - CREATE INDEX idx_cleaning_jobs_status ON cleaning_jobs(status);

Tasks:
  - CREATE INDEX idx_tasks_property_id ON tasks(property_id);
  - CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
  - CREATE INDEX idx_tasks_due_date ON tasks(due_date);
  - CREATE INDEX idx_tasks_status ON tasks(status);

Users:
  - CREATE INDEX idx_users_email ON users(email);
  - CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
  - CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
```

---

## Trigger Recommendations

```
Suggested Triggers for Automation:

1. Auto-update timestamps:
   CREATE TRIGGER update_properties_updated_at
   BEFORE UPDATE ON properties
   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

2. Auto-calculate completion percentage:
   CREATE TRIGGER calculate_overall_completion
   AFTER INSERT OR UPDATE ON checklist_completion
   FOR EACH ROW EXECUTE FUNCTION calculate_overall_completion();

3. Auto-create cleaning job on reservation:
   CREATE TRIGGER create_cleaning_job_on_reservation
   AFTER INSERT ON reservations
   FOR EACH ROW EXECUTE FUNCTION auto_create_cleaning_job();

4. Sync user profile on auth user creation:
   CREATE TRIGGER sync_user_profile
   AFTER INSERT ON auth.users
   FOR EACH ROW EXECUTE FUNCTION create_public_user_profile();
```
