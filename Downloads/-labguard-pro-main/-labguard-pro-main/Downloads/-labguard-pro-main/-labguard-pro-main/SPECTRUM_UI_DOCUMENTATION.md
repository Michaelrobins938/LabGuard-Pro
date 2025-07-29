# Spectrum UI Components Documentation

## Overview

Spectrum UI is a comprehensive collection of animated, interactive React components designed specifically for modern laboratory management applications. All components are built with TypeScript, Framer Motion for animations, and Tailwind CSS for styling.

## Components

### 1. Alert Components

#### Alert
A versatile alert component with multiple variants and animations.

```tsx
import { Alert, AlertContainer } from '@/components/spectrum'

<AlertContainer>
  <Alert
    variant="success"
    title="Success!"
    message="Operation completed successfully"
    dismissible={true}
    autoDismiss={true}
    autoDismissDelay={5000}
    onDismiss={() => console.log('Alert dismissed')}
  />
</AlertContainer>
```

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'error'
- `title`: Optional title text
- `message`: Alert message
- `dismissible`: Show dismiss button
- `autoDismiss`: Auto-dismiss after delay
- `autoDismissDelay`: Dismiss delay in milliseconds
- `onDismiss`: Dismiss callback

### 2. Animated Chart Components

#### AnimatedChart
Interactive SVG charts with smooth animations and hover effects.

```tsx
import { AnimatedChart } from '@/components/spectrum'

const data = [
  { x: 1, y: 65, label: 'Jan', color: '#3B82F6' },
  { x: 2, y: 78, label: 'Feb', color: '#8B5CF6' }
]

<AnimatedChart
  data={data}
  width={400}
  height={200}
  type="line"
  animate={true}
  showGrid={true}
  showPoints={true}
  gradient={true}
/>
```

**Props:**
- `data`: Array of data points with x, y, label, color
- `width/height`: Chart dimensions
- `type`: 'line' | 'area' | 'bar'
- `animate`: Enable animations
- `showGrid`: Show grid lines
- `showPoints`: Show data points
- `gradient`: Show gradient fill

#### AnimatedBarChart
Animated bar chart with smooth height transitions.

```tsx
import { AnimatedBarChart } from '@/components/spectrum'

<AnimatedBarChart
  data={data}
  width={400}
  height={200}
  animate={true}
  showGrid={true}
/>
```

### 3. Animated Testimonial Components

#### AnimatedTestimonials
Auto-rotating testimonials with smooth transitions.

```tsx
import { AnimatedTestimonials } from '@/components/spectrum'

const testimonials = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Lab Director',
    company: 'Stanford Research Lab',
    content: 'Amazing platform!',
    rating: 5,
    avatar: '/path/to/avatar.jpg'
  }
]

<AnimatedTestimonials
  testimonials={testimonials}
  autoPlay={true}
  interval={5000}
  showNavigation={true}
  showDots={true}
/>
```

#### TestimonialGrid
Grid layout for multiple testimonials.

```tsx
import { TestimonialGrid } from '@/components/spectrum'

<TestimonialGrid
  testimonials={testimonials}
  columns={3}
/>
```

### 4. Event Badge Components

#### EventBadge
Animated badges for events and notifications.

```tsx
import { EventBadge } from '@/components/spectrum'

<EventBadge
  type="new"
  text="New Feature"
  size="md"
  animated={true}
/>
```

**Types:** 'event' | 'live' | 'featured' | 'new' | 'hot' | 'limited' | 'exclusive' | 'beta'

#### CountdownBadge
Badge with live countdown timer.

```tsx
import { CountdownBadge } from '@/components/spectrum'

<CountdownBadge
  endDate={new Date('2024-12-31')}
  text="Limited Time"
  size="md"
/>
```

#### LocationBadge
Badge showing location and attendee count.

```tsx
import { LocationBadge } from '@/components/spectrum'

<LocationBadge
  location="San Francisco"
  attendees={150}
  size="md"
/>
```

#### OfferBadge
Badge for special offers and discounts.

```tsx
import { OfferBadge } from '@/components/spectrum'

<OfferBadge
  offer="Special Discount"
  discount="20% OFF"
  size="md"
/>
```

### 5. Infinite Scroll Components

#### InfiniteScroll
Vertical infinite scroll with intersection observer.

```tsx
import { InfiniteScroll } from '@/components/spectrum'

<InfiniteScroll
  items={items}
  renderItem={(item) => <div>{item.title}</div>}
  loadMore={loadMore}
  hasMore={true}
  loading={false}
  threshold={100}
  autoLoad={true}
/>
```

#### HorizontalInfiniteScroll
Horizontal infinite scroll with navigation buttons.

```tsx
import { HorizontalInfiniteScroll } from '@/components/spectrum'

<HorizontalInfiniteScroll
  items={items}
  renderItem={(item) => <div>{item.title}</div>}
  loadMore={loadMore}
  hasMore={true}
  loading={false}
  showScrollButtons={true}
/>
```

### 6. Multi-Step Form Components

#### MultiStepForm
Multi-step form with progress tracking and validation.

```tsx
import { MultiStepForm } from '@/components/spectrum'

const steps = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Tell us about yourself',
    component: TextInputStep,
    validation: (data) => {
      const errors = {}
      if (!data.fullName) errors.fullName = 'Required'
      return errors
    }
  }
]

<MultiStepForm
  steps={steps}
  onSubmit={handleSubmit}
  showProgress={true}
  showStepNumbers={true}
  submitButtonText="Submit"
  loadingText="Submitting..."
/>
```

#### Pre-built Step Components
- `TextInputStep`: Text and email inputs
- `SelectStep`: Dropdown selections
- `ConfirmationStep`: Review and confirm

### 7. Profile Dropdown Components

#### ProfileDropdown
Full-featured profile dropdown with notifications and theme switching.

```tsx
import { ProfileDropdown } from '@/components/spectrum'

<ProfileDropdown
  user={user}
  onLogout={handleLogout}
  onSettings={handleSettings}
  onProfile={handleProfile}
  showNotifications={true}
  notificationCount={3}
  theme="dark"
  onThemeChange={handleThemeChange}
/>
```

#### CompactProfileDropdown
Simplified profile dropdown for mobile.

```tsx
import { CompactProfileDropdown } from '@/components/spectrum'

<CompactProfileDropdown
  user={user}
  onLogout={handleLogout}
  onSettings={handleSettings}
  onProfile={handleProfile}
/>
```

### 8. Skeleton Loading Components

#### Skeleton
Basic skeleton with multiple variants.

```tsx
import { Skeleton } from '@/components/spectrum'

<Skeleton
  variant="text"
  width="100%"
  height="20px"
  animation="pulse"
/>
```

**Variants:** 'text' | 'circular' | 'rectangular' | 'rounded'
**Animations:** 'pulse' | 'wave' | 'none'

#### Specialized Skeletons
- `CardSkeleton`: Card layout skeleton
- `TableSkeleton`: Table layout skeleton
- `ListSkeleton`: List layout skeleton
- `FormSkeleton`: Form layout skeleton
- `DashboardSkeleton`: Dashboard layout skeleton
- `ProfileSkeleton`: Profile layout skeleton
- `NavigationSkeleton`: Navigation layout skeleton

### 9. Enhanced Navigation

#### EnhancedNavbar
Complete navigation bar with dropdowns, profile, and event badges.

```tsx
import { EnhancedNavbar } from '@/components/spectrum'

<EnhancedNavbar />
```

## Usage Examples

### Basic Implementation

```tsx
import { 
  Alert, 
  AnimatedChart, 
  EventBadge, 
  ProfileDropdown 
} from '@/components/spectrum'

function MyComponent() {
  return (
    <div>
      <Alert variant="success" message="Operation successful!" />
      <AnimatedChart data={chartData} />
      <EventBadge type="new" text="Beta Feature" />
      <ProfileDropdown user={user} onLogout={handleLogout} />
    </div>
  )
}
```

### Dashboard Layout

```tsx
import { 
  DashboardSkeleton, 
  AnimatedChart, 
  AlertContainer 
} from '@/components/spectrum'

function Dashboard() {
  const [loading, setLoading] = useState(true)
  
  if (loading) {
    return <DashboardSkeleton />
  }
  
  return (
    <div>
      <AlertContainer>
        <Alert variant="info" message="Welcome to your dashboard" />
      </AlertContainer>
      <AnimatedChart data={analyticsData} />
    </div>
  )
}
```

### Form with Validation

```tsx
import { MultiStepForm } from '@/components/spectrum'

function RegistrationForm() {
  const steps = [
    {
      id: 'personal',
      title: 'Personal Info',
      component: TextInputStep,
      validation: (data) => {
        const errors = {}
        if (!data.email) errors.email = 'Email required'
        return errors
      }
    }
  ]
  
  return (
    <MultiStepForm
      steps={steps}
      onSubmit={handleSubmit}
      submitButtonText="Create Account"
    />
  )
}
```

## Styling and Customization

All components use Tailwind CSS classes and can be customized through:

1. **className prop**: Add custom classes
2. **CSS Variables**: Override default colors
3. **Tailwind Config**: Extend theme colors
4. **Component Props**: Modify behavior and appearance

## Animation Customization

Components use Framer Motion for animations. Customize by:

1. **Duration**: Modify transition durations
2. **Easing**: Change animation curves
3. **Variants**: Define custom animation states
4. **Triggers**: Control animation triggers

## Accessibility

All components include:
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management
- Color contrast compliance

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Lazy loading for heavy components
- Optimized animations with `will-change`
- Efficient re-renders with React.memo
- Intersection Observer for infinite scroll

## Contributing

To add new components:

1. Create component in `src/components/spectrum/`
2. Add TypeScript interfaces
3. Include accessibility features
4. Add to index.ts exports
5. Update documentation

## License

MIT License - see LICENSE file for details. 