# Component Usage Guide

This guide provides comprehensive documentation for all components in the PropSync application, including UI components, custom components, and their usage patterns.

## Table of Contents

1. [UI Components (shadcn/ui)](#ui-components-shadcnui)
2. [Custom Components](#custom-components)
3. [Wizard System](#wizard-system)
4. [Layout Components](#layout-components)
5. [Authentication Components](#authentication-components)
6. [Property Management Components](#property-management-components)
7. [Admin Components](#admin-components)
8. [Analytics Components](#analytics-components)
9. [Usage Patterns](#usage-patterns)
10. [Best Practices](#best-practices)

---

## UI Components (shadcn/ui)

The application uses shadcn/ui components built on top of Radix UI primitives. All UI components are located in `/components/ui/`.

### Form Components

#### Button
```tsx
import { Button } from "@/components/ui/button"

// Basic usage
<Button>Click me</Button>

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>
```

#### Input
```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>
```

#### Textarea
```tsx
import { Textarea } from "@/components/ui/textarea"

<Textarea
  placeholder="Enter description..."
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
/>
```

#### Select
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

#### Switch
```tsx
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

<div className="flex items-center space-x-2">
  <Switch id="notifications" checked={enabled} onCheckedChange={setEnabled} />
  <Label htmlFor="notifications">Enable notifications</Label>
</div>
```

#### Checkbox
```tsx
import { Checkbox } from "@/components/ui/checkbox"

<div className="flex items-center space-x-2">
  <Checkbox id="terms" checked={accepted} onCheckedChange={setAccepted} />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>
```

### Layout Components

#### Card
```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Tabs
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    Content for tab 1
  </TabsContent>
  <TabsContent value="tab2">
    Content for tab 2
  </TabsContent>
</Tabs>
```

#### Sidebar
```tsx
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"

<Sidebar>
  <SidebarHeader>
    <h2>Navigation</h2>
  </SidebarHeader>
  <SidebarContent>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/dashboard">Dashboard</Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarContent>
</Sidebar>
```

### Feedback Components

#### Toast
```tsx
import { useToast } from "@/hooks/use-toast"

const { toast } = useToast()

// Success toast
toast({
  title: "Success!",
  description: "Operation completed successfully.",
})

// Error toast
toast({
  title: "Error",
  description: "Something went wrong.",
  variant: "destructive",
})
```

#### Alert
```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

<Alert>
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Warning!</AlertTitle>
  <AlertDescription>
    This action cannot be undone.
  </AlertDescription>
</Alert>
```

#### Dialog
```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description
      </DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

### Data Display Components

#### Table
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.role}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### Badge
```tsx
import { Badge } from "@/components/ui/badge"

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

#### Avatar
```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

## Custom Components

### Responsive Layout
```tsx
import { ResponsiveLayout } from "@/components/layout/responsive-layout"

<ResponsiveLayout>
  {/* Your page content */}
</ResponsiveLayout>
```

**Purpose**: Provides consistent responsive layout with proper spacing and mobile optimization.

### Theme Provider
```tsx
import { ThemeProvider } from "@/components/theme-provider"

<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

**Purpose**: Manages theme state and provides theme switching functionality.

---

## Wizard System

The wizard system is a complex multi-step form implementation for property creation.

### Wizard Context
```tsx
import { useWizard } from "@/components/wizard/wizard-context"

const {
  formData,
  updateFormData,
  currentStep,
  setCurrentStep,
  isStepValid,
  saveProgress
} = useWizard()
```

### Wizard Layout
```tsx
import { WizardLayout } from "@/components/wizard/wizard-layout"

<WizardLayout>
  {/* Step content */}
</WizardLayout>
```

### Custom Wizard Fields

#### Visual Counter
```tsx
import { VisualCounter } from "@/components/wizard/fields/visual-counter"

<VisualCounter
  label="Number of bedrooms"
  value={bedrooms}
  onChange={setBedrooms}
  min={0}
  max={10}
  icon="🛏️"
/>
```

#### Icon Checkbox Grid
```tsx
import { IconCheckboxGrid } from "@/components/wizard/fields/icon-checkbox-grid"

<IconCheckboxGrid
  label="Amenities"
  options={[
    { id: 'wifi', label: 'WiFi', icon: '📶' },
    { id: 'parking', label: 'Parking', icon: '🚗' },
  ]}
  value={selectedAmenities}
  onChange={setSelectedAmenities}
/>
```

#### Tag Input
```tsx
import { TagInput } from "@/components/wizard/fields/tag-input"

<TagInput
  label="Keywords"
  value={tags}
  onChange={setTags}
  placeholder="Add tags..."
/>
```

#### Feature Builder
```tsx
import { FeatureBuilder } from "@/components/wizard/fields/feature-builder"

<FeatureBuilder
  label="Special Features"
  value={features}
  onChange={setFeatures}
  fields={[
    { key: 'name', label: 'Feature Name', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' }
  ]}
/>
```

#### Image Upload
```tsx
import { ImageUpload } from "@/components/wizard/fields/image-upload"

<ImageUpload
  label="Property Images"
  value={images}
  onChange={setImages}
  maxFiles={10}
  accept="image/*"
/>
```

---

## Layout Components

### Desktop Sidebar
```tsx
import { DesktopSidebar } from "@/components/layout/desktop-sidebar"

<DesktopSidebar />
```

### Mobile Navigation
```tsx
import { MobileNavigation } from "@/components/layout/mobile-navigation"

<MobileNavigation />
```

---

## Authentication Components

### Auth Form
```tsx
import { AuthForm } from "@/components/auth/auth-form"

<AuthForm mode="signin" /> // or "signup"
```

### Role Gate
```tsx
import { RoleGate } from "@/components/auth/role-gate"

<RoleGate allowedRoles={['admin', 'manager']}>
  {/* Content only visible to admin/manager */}
</RoleGate>
```

### User Profile
```tsx
import { UserProfile } from "@/components/auth/user-profile"

<UserProfile />
```

### Logout Button
```tsx
import { LogoutButton } from "@/components/auth/logout-button"

<LogoutButton />
```

---

## Property Management Components

### Property Grid
```tsx
import { PropertyGrid } from "@/components/properties/property-grid"

<PropertyGrid properties={properties} />
```

### Property Table
```tsx
import { PropertyTable } from "@/components/properties/property-table"

<PropertyTable properties={properties} />
```

### Property Card
```tsx
import { PropertyCard } from "@/components/properties/property-card"

<PropertyCard property={property} />
```

### Swipeable Property Card
```tsx
import { SwipeablePropertyCard } from "@/components/properties/swipeable-property-card"

<SwipeablePropertyCard property={property} />
```

### View Switcher
```tsx
import { ViewSwitcher } from "@/components/properties/view-switcher"

<ViewSwitcher
  currentView={view}
  onViewChange={setView}
  options={['grid', 'table']}
/>
```

---

## Admin Components

### Users Table
```tsx
import { UsersTable } from "@/components/admin/users-table"

<UsersTable />
```

### Setup Database
```tsx
import { SetupDatabase } from "@/components/admin/setup-database"

<SetupDatabase />
```

### Seed Button
```tsx
import { SeedButton } from "@/components/admin/seed-button"

<SeedButton />
```

---

## Analytics Components

### Charts
```tsx
import { BarChart, LineChart, PieChart } from "@/components/analytics/charts"

<BarChart data={data} />
<LineChart data={data} />
<PieChart data={data} />
```

---

## Usage Patterns

### 1. Form Handling with Toast Feedback
```tsx
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const { toast } = useToast()

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    await submitForm(formData)
    toast({
      title: "Success!",
      description: "Form submitted successfully.",
    })
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to submit form.",
      variant: "destructive",
    })
  }
}
```

### 2. Responsive Design Pattern
```tsx
import { useIsMobile } from "@/hooks/use-mobile"

const isMobile = useIsMobile()

return (
  <div className={cn(
    "grid gap-4",
    isMobile ? "grid-cols-1" : "grid-cols-3"
  )}>
    {/* Content */}
  </div>
)
```

### 3. Role-Based Rendering
```tsx
import { RoleGate } from "@/components/auth/role-gate"

<div>
  {/* Content for all users */}
  <RoleGate allowedRoles={['admin']}>
    {/* Admin-only content */}
    <Button variant="destructive">Delete</Button>
  </RoleGate>
</div>
```

### 4. Loading States
```tsx
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

{loading ? (
  <Skeleton className="h-10 w-full" />
) : (
  <Button disabled={submitting}>
    {submitting ? "Saving..." : "Save"}
  </Button>
)}
```

---

## Best Practices

### 1. Component Composition
- Prefer composition over inheritance
- Use compound components for complex UI patterns
- Keep components focused on a single responsibility

### 2. Accessibility
- Always use proper ARIA labels
- Ensure keyboard navigation works
- Use semantic HTML elements
- Test with screen readers

### 3. Performance
- Use React.memo for expensive components
- Implement proper loading states
- Lazy load non-critical components
- Optimize re-renders with useCallback and useMemo

### 4. Styling
- Use Tailwind CSS classes consistently
- Follow the design system color palette
- Use responsive design patterns
- Maintain consistent spacing

### 5. Error Handling
- Always provide user feedback for actions
- Use toast notifications for temporary messages
- Use alerts for persistent warnings
- Implement proper error boundaries

### 6. Type Safety
- Define proper TypeScript interfaces
- Use generic types for reusable components
- Leverage type inference where possible
- Document complex type definitions

---

## Component Development Guidelines

### Creating New Components

1. **File Structure**
   ```
   components/
   ├── ui/           # shadcn/ui components
   ├── feature/      # Feature-specific components
   └── shared/       # Shared utility components
   ```

2. **Component Template**
   ```tsx
   import * as React from "react"
   import { cn } from "@/lib/utils"
   
   interface ComponentProps {
     className?: string
     // Other props
   }
   
   const Component = React.forwardRef<
     HTMLDivElement,
     ComponentProps
   >(({ className, ...props }, ref) => {
     return (
       <div
         ref={ref}
         className={cn("base-styles", className)}
         {...props}
       />
     )
   })
   Component.displayName = "Component"
   
   export { Component }
   ```

3. **Documentation Requirements**
   - Add JSDoc comments for complex components
   - Include usage examples
   - Document prop interfaces
   - Add accessibility notes

### Testing Components

1. **Unit Tests**
   - Test component rendering
   - Test user interactions
   - Test accessibility features
   - Test error states

2. **Integration Tests**
   - Test component composition
   - Test data flow
   - Test form submissions

---

This guide serves as a comprehensive reference for all components in the PropSync application. Keep it updated as new components are added or existing ones are modified.