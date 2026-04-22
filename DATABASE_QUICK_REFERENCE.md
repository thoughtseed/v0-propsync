# Database Quick Reference Guide

## Common Query Patterns

### Property Queries

#### Get all properties with basic info
```sql
SELECT 
  p.*,
  pbi.full_address,
  pbi.description,
  u.full_name as owner_name,
  u.email as owner_email
FROM properties p
LEFT JOIN property_basic_info pbi ON p.id = pbi.property_id
LEFT JOIN users u ON p.user_id = u.id
WHERE p.status = 'active'
ORDER BY p.created_at DESC;
```

#### Get property with all details (complete view)
```sql
SELECT * FROM properties_complete
WHERE id = 'property-uuid-here';
```

#### Get properties by user
```sql
SELECT p.*, COUNT(r.id) as total_reservations
FROM properties p
LEFT JOIN reservations r ON p.id = r.property_id
WHERE p.user_id = 'user-uuid-here'
GROUP BY p.id
ORDER BY p.created_at DESC;
```

#### Get property completion status
```sql
SELECT 
  p.property_reference,
  p.building_name,
  cc.overall as completion_percentage,
  cc.basic_information,
  cc.safety_security,
  cc.kitchen_dining,
  cc.bedrooms,
  cc.bathrooms,
  cc.technology,
  cc.practical_living,
  cc.location_lifestyle,
  cc.accessibility_sustainability
FROM properties p
LEFT JOIN checklist_completion cc ON p.id = cc.property_id
WHERE p.user_id = 'user-uuid-here'
ORDER BY cc.overall ASC;
```

---

### Reservation Queries

#### Get upcoming reservations
```sql
SELECT 
  r.*,
  p.building_name,
  p.unit_number,
  p.property_reference
FROM reservations r
JOIN properties p ON r.property_id = p.id
WHERE r.check_in_date >= CURRENT_DATE
  AND r.status = 'confirmed'
ORDER BY r.check_in_date ASC;
```

#### Get current guests (checked in)
```sql
SELECT 
  r.*,
  p.building_name,
  p.unit_number
FROM reservations r
JOIN properties p ON r.property_id = p.id
WHERE CURRENT_DATE BETWEEN r.check_in_date AND r.check_out_date
  AND r.status = 'confirmed'
ORDER BY r.check_out_date ASC;
```

#### Get reservation history for a property
```sql
SELECT 
  r.*,
  cj.status as cleaning_status,
  cj.completed_at as cleaning_completed
FROM reservations r
LEFT JOIN cleaning_jobs cj ON r.id = cj.reservation_id
WHERE r.property_id = 'property-uuid-here'
ORDER BY r.check_in_date DESC
LIMIT 50;
```

---

### Cleaning Job Queries

#### Get pending cleaning jobs
```sql
SELECT 
  cj.*,
  p.building_name,
  p.unit_number,
  r.guest_name,
  r.check_in_date,
  u.full_name as assigned_cleaner
FROM cleaning_jobs cj
JOIN properties p ON cj.property_id = p.id
LEFT JOIN reservations r ON cj.reservation_id = r.id
LEFT JOIN users u ON cj.assigned_to = u.id
WHERE cj.status = 'pending'
ORDER BY cj.scheduled_date ASC;
```

#### Get cleaning jobs for a specific cleaner
```sql
SELECT 
  cj.*,
  p.building_name,
  p.unit_number,
  p.property_reference
FROM cleaning_jobs cj
JOIN properties p ON cj.property_id = p.id
WHERE cj.assigned_to = 'user-uuid-here'
  AND cj.scheduled_date >= CURRENT_DATE
ORDER BY cj.scheduled_date ASC;
```

#### Get cleaning job completion stats
```sql
SELECT 
  u.full_name,
  COUNT(*) as total_jobs,
  SUM(CASE WHEN cj.status = 'completed' THEN 1 ELSE 0 END) as completed_jobs,
  SUM(CASE WHEN cj.checklist_completed THEN 1 ELSE 0 END) as checklist_completed,
  AVG(EXTRACT(EPOCH FROM (cj.completed_at - cj.started_at))/3600) as avg_hours
FROM cleaning_jobs cj
JOIN users u ON cj.assigned_to = u.id
WHERE cj.scheduled_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY u.id, u.full_name
ORDER BY completed_jobs DESC;
```

---

### User & Permission Queries

#### Get user with roles and permissions
```sql
SELECT 
  u.id,
  u.email,
  u.full_name,
  r.name as role_name,
  p.resource,
  p.action
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
LEFT JOIN role_permissions rp ON r.id = rp.role_id
LEFT JOIN permissions p ON rp.permission_id = p.id
WHERE u.email = 'user@example.com';
```

#### Check if user has specific permission
```sql
SELECT EXISTS (
  SELECT 1
  FROM users u
  JOIN user_roles ur ON u.id = ur.user_id
  JOIN roles r ON ur.role_id = r.id
  JOIN role_permissions rp ON r.id = rp.role_id
  JOIN permissions p ON rp.permission_id = p.id
  WHERE u.id = 'user-uuid-here'
    AND p.resource = 'properties'
    AND p.action = 'create'
) as has_permission;
```

#### Get all users by role
```sql
SELECT 
  u.*,
  r.name as role_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE r.name = 'manager'
ORDER BY u.full_name;
```

---

### Task Queries

#### Get overdue tasks
```sql
SELECT 
  t.*,
  p.building_name,
  p.unit_number,
  u.full_name as assigned_to_name
FROM tasks t
LEFT JOIN properties p ON t.property_id = p.id
LEFT JOIN users u ON t.assigned_to = u.id
WHERE t.due_date < CURRENT_TIMESTAMP
  AND t.status NOT IN ('done', 'cancelled')
ORDER BY t.due_date ASC;
```

#### Get tasks by priority
```sql
SELECT 
  t.*,
  p.building_name,
  u.full_name as assigned_to_name
FROM tasks t
LEFT JOIN properties p ON t.property_id = p.id
LEFT JOIN users u ON t.assigned_to = u.id
WHERE t.status = 'todo'
ORDER BY 
  CASE t.priority
    WHEN 'urgent' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  t.due_date ASC;
```

---

## Common Insert Patterns

### Create a new property (minimal)
```sql
-- Step 1: Insert main property record
INSERT INTO properties (
  property_reference,
  building_name,
  unit_number,
  property_type,
  bedrooms,
  bathrooms,
  max_occupancy,
  user_id
) VALUES (
  'PROP-001',
  'Sunset Apartments',
  '3B',
  'apartment',
  2,
  1,
  4,
  'user-uuid-here'
) RETURNING id;

-- Step 2: Initialize checklist completion
INSERT INTO checklist_completion (property_id)
VALUES ('property-uuid-from-step-1');

-- Step 3: Add basic info
INSERT INTO property_basic_info (
  property_id,
  full_address,
  description
) VALUES (
  'property-uuid-from-step-1',
  '123 Main St, Apt 3B, City, State 12345',
  'Beautiful 2-bedroom apartment with city views'
);
```

### Create a reservation
```sql
INSERT INTO reservations (
  property_id,
  guest_name,
  guest_email,
  guest_phone,
  check_in_date,
  check_out_date,
  check_in_time,
  check_out_time,
  adults,
  children,
  source,
  external_id
) VALUES (
  'property-uuid-here',
  'John Doe',
  'john@example.com',
  '+1234567890',
  '2026-03-01',
  '2026-03-05',
  '15:00:00',
  '11:00:00',
  2,
  0,
  'airbnb',
  'AIRBNB-12345'
) RETURNING id;
```

### Create a cleaning job
```sql
INSERT INTO cleaning_jobs (
  property_id,
  reservation_id,
  assigned_to,
  scheduled_date,
  status
) VALUES (
  'property-uuid-here',
  'reservation-uuid-here',
  'cleaner-user-uuid-here',
  '2026-03-05',
  'pending'
);
```

### Assign role to user
```sql
-- First, get the role ID
SELECT id FROM roles WHERE name = 'manager';

-- Then create the assignment
INSERT INTO user_roles (user_id, role_id)
VALUES ('user-uuid-here', 'role-uuid-from-above');
```

---

## Common Update Patterns

### Update property status
```sql
UPDATE properties
SET status = 'active', updated_at = NOW()
WHERE id = 'property-uuid-here';
```

### Update checklist completion
```sql
UPDATE checklist_completion
SET 
  basic_information = 100,
  safety_security = 75,
  overall = (basic_information + safety_security + kitchen_dining + 
             bedrooms + bathrooms + technology + practical_living + 
             location_lifestyle + accessibility_sustainability) / 9,
  updated_at = NOW()
WHERE property_id = 'property-uuid-here';
```

### Mark cleaning job as complete
```sql
UPDATE cleaning_jobs
SET 
  status = 'completed',
  completed_at = NOW(),
  checklist_completed = true,
  updated_at = NOW()
WHERE id = 'cleaning-job-uuid-here';
```

### Update task status
```sql
UPDATE tasks
SET 
  status = 'done',
  updated_at = NOW()
WHERE id = 'task-uuid-here';
```

---

## Useful Aggregate Queries

### Property statistics
```sql
SELECT 
  COUNT(*) as total_properties,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_properties,
  COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance_properties,
  COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_properties,
  AVG(bedrooms) as avg_bedrooms,
  AVG(bathrooms) as avg_bathrooms,
  AVG(square_meters) as avg_square_meters
FROM properties;
```

### Reservation statistics (monthly)
```sql
SELECT 
  DATE_TRUNC('month', check_in_date) as month,
  COUNT(*) as total_reservations,
  COUNT(DISTINCT property_id) as unique_properties,
  SUM(adults + children) as total_guests,
  AVG(check_out_date - check_in_date) as avg_stay_duration
FROM reservations
WHERE check_in_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', check_in_date)
ORDER BY month DESC;
```

### Cleaning job performance
```sql
SELECT 
  DATE_TRUNC('week', scheduled_date) as week,
  COUNT(*) as total_jobs,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
  SUM(CASE WHEN checklist_completed THEN 1 ELSE 0 END) as checklist_done,
  ROUND(100.0 * SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*), 2) as completion_rate
FROM cleaning_jobs
WHERE scheduled_date >= CURRENT_DATE - INTERVAL '8 weeks'
GROUP BY DATE_TRUNC('week', scheduled_date)
ORDER BY week DESC;
```

---

## RLS Policy Examples

### Properties - Users can only see their own
```sql
CREATE POLICY "Users can view their own properties"
ON properties FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own properties"
ON properties FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties"
ON properties FOR UPDATE
USING (auth.uid() = user_id);
```

### Properties - Admins can see all
```sql
CREATE POLICY "Admins can view all properties"
ON properties FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'admin'
  )
);
```

### Cleaning Jobs - Cleaners see assigned jobs
```sql
CREATE POLICY "Cleaners can view assigned jobs"
ON cleaning_jobs FOR SELECT
USING (
  assigned_to = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('admin', 'manager')
  )
);
```

---

## Performance Tips

1. **Use indexes on foreign keys**
   - All FK columns should have indexes
   - Especially important for joins

2. **Use EXPLAIN ANALYZE**
   ```sql
   EXPLAIN ANALYZE
   SELECT * FROM properties WHERE user_id = 'uuid-here';
   ```

3. **Avoid SELECT ***
   - Only select columns you need
   - Especially important for properties_complete (130 columns!)

4. **Use pagination**
   ```sql
   SELECT * FROM properties
   ORDER BY created_at DESC
   LIMIT 20 OFFSET 0;
   ```

5. **Use materialized views for complex aggregations**
   ```sql
   CREATE MATERIALIZED VIEW property_stats AS
   SELECT 
     p.id,
     COUNT(r.id) as total_reservations,
     AVG(r.adults + r.children) as avg_guests
   FROM properties p
   LEFT JOIN reservations r ON p.id = r.property_id
   GROUP BY p.id;
   
   -- Refresh periodically
   REFRESH MATERIALIZED VIEW property_stats;
   ```

---

## Backup & Maintenance

### Backup specific tables
```bash
pg_dump -h hostname -U username -t properties -t property_* dbname > backup.sql
```

### Vacuum and analyze
```sql
VACUUM ANALYZE properties;
VACUUM ANALYZE reservations;
VACUUM ANALYZE cleaning_jobs;
```

### Check table sizes
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```
