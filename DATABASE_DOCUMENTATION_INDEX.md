# Database Documentation Index

Welcome to the PropSync Database Documentation! This index will help you navigate all the documentation files.

## 📚 Documentation Files

### 1. **DATABASE_SCHEMA.md** - Complete Schema Reference
**Best for:** Understanding the overall structure and relationships

**Contents:**
- Core entity relationships diagram
- Table groups (User Management, Properties, Operations)
- Detailed table schemas with all columns
- Data flow diagrams (Property Creation, Reservations, Permissions)
- Key relationships summary
- Table statistics
- Security notes

**When to use:**
- First time exploring the database
- Understanding how tables relate to each other
- Planning new features
- Onboarding new developers

---

### 2. **DATABASE_ERD.md** - Entity-Relationship Diagrams
**Best for:** Visual understanding of table relationships

**Contents:**
- Complete ERD with all 24 tables
- Property detail tables (9 wizard steps)
- Property support tables
- Operational tables (reservations, cleaning, tasks)
- RBAC structure diagram
- Cardinality reference (1:1, 1:N, N:M)
- Data type legend
- Index recommendations
- Trigger recommendations

**When to use:**
- Designing new features
- Understanding foreign key relationships
- Planning database migrations
- Creating RLS policies

---

### 3. **DATABASE_QUICK_REFERENCE.md** - Query Patterns & Examples
**Best for:** Day-to-day development and querying

**Contents:**
- Common query patterns for all major tables
- Insert patterns with examples
- Update patterns
- Aggregate queries
- RLS policy examples
- Performance tips
- Backup commands

**When to use:**
- Writing new queries
- Implementing features
- Debugging data issues
- Optimizing performance
- Setting up RLS policies

---

### 4. **DATABASE_VISUAL_SUMMARY.md** - High-Level Overview
**Best for:** Understanding system architecture and workflows

**Contents:**
- System architecture layers
- Property data model (star schema)
- Property creation journey
- Reservation to cleaning workflow
- Permission system flow
- Table size projections
- Query performance patterns
- Backup strategy

**When to use:**
- Explaining the system to stakeholders
- Planning capacity and scaling
- Understanding user journeys
- Optimizing workflows

---

## 🎯 Quick Navigation by Task

### I want to...

#### **Understand the database structure**
→ Start with: `DATABASE_SCHEMA.md` (Core Entity Relationships)
→ Then read: `DATABASE_ERD.md` (Complete ERD)

#### **Write queries for properties**
→ Go to: `DATABASE_QUICK_REFERENCE.md` (Property Queries section)

#### **Understand the property wizard**
→ Read: `DATABASE_VISUAL_SUMMARY.md` (Property Creation Journey)
→ Then: `DATABASE_SCHEMA.md` (Property Detail Tables)

#### **Set up permissions/RBAC**
→ Read: `DATABASE_ERD.md` (RBAC Structure)
→ Then: `DATABASE_QUICK_REFERENCE.md` (RLS Policy Examples)

#### **Understand reservations & cleaning**
→ Read: `DATABASE_VISUAL_SUMMARY.md` (Reservation to Cleaning Workflow)
→ Then: `DATABASE_QUICK_REFERENCE.md` (Reservation & Cleaning Queries)

#### **Optimize performance**
→ Read: `DATABASE_VISUAL_SUMMARY.md` (Query Performance Patterns)
→ Then: `DATABASE_ERD.md` (Index Recommendations)
→ Finally: `DATABASE_QUICK_REFERENCE.md` (Performance Tips)

#### **Plan a new feature**
→ Start with: `DATABASE_VISUAL_SUMMARY.md` (System Architecture)
→ Then: `DATABASE_ERD.md` (Complete ERD)
→ Finally: `DATABASE_SCHEMA.md` (Detailed Schemas)

---

## 📊 Database Statistics

| Metric | Value |
|--------|-------|
| Total Tables | 24 |
| Property Detail Tables | 9 |
| Operational Tables | 3 |
| Auth/RBAC Tables | 5 |
| Support Tables | 4 |
| Core Tables | 3 |
| All Tables Have RLS | ✓ Yes |
| Current Total Rows | 0 (empty database) |
| Estimated Size (100 properties) | ~13 MB |
| Estimated Size (5 years) | ~80 MB |

---

## 🔑 Key Concepts

### Property Model
Properties use a **star schema** design:
- 1 central `properties` table (fact table)
- 9 dimension tables (property_basic_info, property_safety, etc.)
- Each dimension = 1 wizard step
- Benefits: Modular, scalable, wizard-friendly

### Completion Tracking
The `checklist_completion` table tracks wizard progress:
- One row per property
- 9 percentage fields (0-100) for each step
- 1 overall field (calculated average)
- Updated after each wizard step

### RBAC System
Role-Based Access Control uses 5 tables:
- `users` → `user_roles` → `roles` → `role_permissions` → `permissions`
- Many-to-many relationships
- Flexible permission assignment
- Enforced via RLS policies

### Operational Flow
Reservations drive cleaning jobs:
1. Reservation created → Auto-create cleaning job
2. Manager assigns cleaner
3. Cleaner completes job
4. Guest checks in
5. Guest checks out → Cycle repeats

---

## 🛠️ Common Tasks

### Add a new property field

1. **Identify the right table**
   - Basic info? → `property_basic_info`
   - Safety? → `property_safety`
   - Kitchen? → `property_kitchen`
   - etc.

2. **Add the column**
   ```sql
   ALTER TABLE property_kitchen
   ADD COLUMN new_field TEXT;
   ```

3. **Update the wizard UI**
   - Add field to the corresponding step component
   - Update validation schema

4. **Regenerate types**
   ```bash
   npx supabase gen types --linked > lib/types/database.ts
   ```

### Add a new permission

1. **Insert the permission**
   ```sql
   INSERT INTO permissions (resource, action, description)
   VALUES ('properties', 'export', 'Can export property data');
   ```

2. **Assign to roles**
   ```sql
   INSERT INTO role_permissions (role_id, permission_id)
   SELECT r.id, p.id
   FROM roles r, permissions p
   WHERE r.name = 'admin'
   AND p.resource = 'properties'
   AND p.action = 'export';
   ```

3. **Create RLS policy**
   ```sql
   CREATE POLICY "Users with export permission can export"
   ON properties FOR SELECT
   USING (
     EXISTS (
       SELECT 1 FROM user_roles ur
       JOIN role_permissions rp ON ur.role_id = rp.role_id
       JOIN permissions p ON rp.permission_id = p.id
       WHERE ur.user_id = auth.uid()
       AND p.resource = 'properties'
       AND p.action = 'export'
     )
   );
   ```

### Query property with all details

**Option 1: Use the denormalized view**
```sql
SELECT * FROM properties_complete
WHERE id = 'property-uuid';
```

**Option 2: Join only what you need**
```sql
SELECT 
  p.*,
  pbi.full_address,
  pbi.description,
  ps.smoke_detectors,
  pk.major_appliances
FROM properties p
LEFT JOIN property_basic_info pbi ON p.id = pbi.property_id
LEFT JOIN property_safety ps ON p.id = ps.property_id
LEFT JOIN property_kitchen pk ON p.id = pk.property_id
WHERE p.id = 'property-uuid';
```

---

## 🔒 Security Checklist

- [x] All tables have RLS enabled
- [ ] RLS policies defined for each table
- [ ] Service role key secured (never in frontend)
- [ ] Anon key used in frontend (limited permissions)
- [ ] Sensitive fields encrypted (wifi_password, smart_lock_code)
- [ ] User input validated before database insertion
- [ ] SQL injection prevented (use parameterized queries)
- [ ] File uploads validated and scanned
- [ ] Audit logging enabled for sensitive operations

---

## 📈 Performance Checklist

- [ ] Indexes created on all foreign keys
- [ ] Indexes on frequently queried columns
- [ ] VACUUM ANALYZE run regularly
- [ ] Query plans reviewed with EXPLAIN ANALYZE
- [ ] Pagination implemented for large result sets
- [ ] Materialized views for complex aggregations
- [ ] Connection pooling configured
- [ ] Slow query log monitored

---

## 🔄 Migration Workflow

1. **Make changes locally**
   ```bash
   npx supabase migration new add_new_field
   ```

2. **Write migration SQL**
   ```sql
   -- supabase/migrations/20260206_add_new_field.sql
   ALTER TABLE properties ADD COLUMN new_field TEXT;
   ```

3. **Test locally**
   ```bash
   npx supabase db reset
   ```

4. **Apply to hosted database**
   ```bash
   npx supabase db push
   ```

5. **Regenerate types**
   ```bash
   npx supabase gen types --linked > lib/types/database.ts
   ```

---

## 📞 Support & Resources

### Internal Resources
- `schema.md` - Original schema documentation
- `ARCHITECTURE.md` - Application architecture
- `API_DOCUMENTATION.md` - API endpoints

### External Resources
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎓 Learning Path

### Beginner
1. Read `DATABASE_VISUAL_SUMMARY.md` (System Architecture)
2. Explore `DATABASE_SCHEMA.md` (Core Relationships)
3. Try queries from `DATABASE_QUICK_REFERENCE.md`

### Intermediate
1. Study `DATABASE_ERD.md` (Complete ERD)
2. Understand RBAC system
3. Write custom queries
4. Create RLS policies

### Advanced
1. Optimize query performance
2. Design new features
3. Create complex migrations
4. Implement triggers and functions

---

## 📝 Changelog

### 2026-02-06
- Created comprehensive database documentation
- Added visual diagrams and ASCII art
- Documented all 24 tables
- Added query examples and patterns
- Created quick reference guide

---

## 🤝 Contributing

When updating the database:

1. **Update the migration**
   - Create new migration file
   - Document the change

2. **Update documentation**
   - Update relevant .md files
   - Add to changelog
   - Update ERD if structure changes

3. **Update types**
   - Regenerate TypeScript types
   - Update validation schemas

4. **Test thoroughly**
   - Test locally first
   - Verify RLS policies
   - Check performance impact

---

**Last Updated:** February 6, 2026
**Database Version:** PostgreSQL 15.8.1
**Total Tables:** 24
**Documentation Status:** ✓ Complete
