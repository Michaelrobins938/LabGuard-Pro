# Victory Charts Usage Guide for LabGuard Pro

## Overview

Victory is a powerful React charting library that's already installed in your LabGuard Pro project. This guide shows you how to effectively use Victory for laboratory analytics, compliance monitoring, and data visualization.

## Installation Status

✅ **Victory is already installed** in your project:
```json
"victory": "^37.3.6"
```

## Key Features

- **Interactive Charts**: Built-in tooltips and hover effects
- **Smooth Animations**: Automatic animations for better UX
- **Responsive Design**: Charts adapt to container size
- **Multiple Chart Types**: Line, bar, pie, scatter, area, and more
- **Customizable Themes**: Material design theme included
- **TypeScript Support**: Full TypeScript compatibility

## Chart Types Available

### 1. Line Charts
Perfect for trends over time (calibration accuracy, compliance rates)

```tsx
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory'

<VictoryChart theme={VictoryTheme.material} height={300}>
  <VictoryAxis dependentAxis tickFormat={(t) => `${t}%`} />
  <VictoryAxis />
  <VictoryLine
    data={calibrationData}
    style={{ data: { stroke: '#3b82f6', strokeWidth: 3 } }}
    animate={{ duration: 2000, onLoad: { duration: 1000 } }}
  />
</VictoryChart>
```

### 2. Bar Charts
Great for comparing values (QC performance, equipment uptime)

```tsx
import { VictoryBar } from 'victory'

<VictoryBar
  data={qcData}
  style={{
    data: {
      fill: ({ datum }) => datum.cv < 2 ? '#10b981' : '#f59e0b',
      fillOpacity: 0.8
    }
  }}
  animate={{ duration: 2000 }}
/>
```

### 3. Pie Charts
Ideal for showing distributions (equipment status, compliance breakdown)

```tsx
import { VictoryPie } from 'victory'

<VictoryPie
  data={equipmentData}
  colorScale={['#10B981', '#F59E0B', '#3B82F6', '#EF4444']}
  height={300}
  animate={{ duration: 2000 }}
  containerComponent={<VictoryTooltip />}
/>
```

### 4. Scatter Plots
Perfect for correlation analysis (sample results, precision vs accuracy)

```tsx
import { VictoryScatter } from 'victory'

<VictoryScatter
  data={sampleData}
  size={({ datum }) => datum.status === 'FAIL' ? 8 : 4}
  style={{
    data: {
      fill: ({ datum }) => getStatusColor(datum.status),
      fillOpacity: 0.8
    }
  }}
/>
```

### 5. Area Charts
Great for showing cumulative data or ranges

```tsx
import { VictoryArea } from 'victory'

<VictoryArea
  data={complianceData}
  style={{
    data: {
      fill: 'url(#gradient)',
      fillOpacity: 0.6,
      stroke: '#3b82f6',
      strokeWidth: 2
    }
  }}
/>
```

### 6. Stacked Bar Charts
Useful for showing composition (test results by month)

```tsx
import { VictoryStack } from 'victory'

<VictoryStack colorScale={['#10b981', '#ef4444']}>
  <VictoryBar data={passedData} />
  <VictoryBar data={failedData} />
</VictoryStack>
```

## Interactive Features

### Tooltips
Add interactive tooltips to any chart:

```tsx
import { VictoryTooltip, VictoryVoronoiContainer } from 'victory'

<VictoryChart
  containerComponent={
    <VictoryVoronoiContainer
      labels={({ datum }) => `${datum.x}: ${datum.y}%`}
      labelComponent={<VictoryTooltip style={{ fontSize: 10 }} />}
    />
  }
>
  {/* Chart components */}
</VictoryChart>
```

### Animations
Smooth animations for better user experience:

```tsx
<VictoryLine
  animate={{
    duration: 2000,
    onLoad: { duration: 1000 }
  }}
/>
```

### Legends
Add legends to explain chart elements:

```tsx
import { VictoryLegend } from 'victory'

<VictoryLegend
  x={125}
  y={50}
  title="Compliance Areas"
  centerTitle
  orientation="horizontal"
  gutter={20}
  data={[
    { name: 'Overall', symbol: { fill: '#3b82f6' } },
    { name: 'Equipment', symbol: { fill: '#10b981' } }
  ]}
/>
```

## Laboratory-Specific Use Cases

### 1. Calibration Tracking
```tsx
// Calibration accuracy over time
const calibrationData = [
  { x: '2024-01-01', y: 98.5, equipment: 'Spectrophotometer A', status: 'PASS' },
  { x: '2024-01-02', y: 97.2, equipment: 'Centrifuge B', status: 'PASS' },
  // ...
]
```

### 2. QC Performance Monitoring
```tsx
// QC results with error bars
const qcData = [
  { test: 'Glucose', mean: 100.2, sd: 2.1, cv: 2.1, target: 100.0 },
  { test: 'Cholesterol', mean: 200.5, sd: 4.2, cv: 2.1, target: 200.0 },
  // ...
]
```

### 3. Equipment Status Dashboard
```tsx
// Equipment uptime and status
const equipmentData = [
  { equipment: 'Spectrophotometer A', status: 'OPERATIONAL', uptime: 98.5 },
  { equipment: 'Centrifuge B', status: 'OPERATIONAL', uptime: 97.2 },
  // ...
]
```

### 4. Compliance Metrics
```tsx
// Multi-line compliance trends
const complianceData = [
  { month: 'Jan', overall: 98.5, equipment: 99.2, personnel: 97.8 },
  { month: 'Feb', overall: 98.8, equipment: 99.5, personnel: 98.1 },
  // ...
]
```

## Styling Best Practices

### 1. Use Consistent Colors
```tsx
const statusColors = {
  PASS: '#10B981',
  WARNING: '#F59E0B',
  FAIL: '#EF4444',
  OPERATIONAL: '#10B981',
  MAINTENANCE: '#F59E0B',
  OFFLINE: '#EF4444'
}
```

### 2. Responsive Design
```tsx
<VictoryChart
  theme={VictoryTheme.material}
  height={300}
  width={window.innerWidth > 768 ? 600 : 400}
/>
```

### 3. Custom Themes
```tsx
const customTheme = {
  ...VictoryTheme.material,
  axis: {
    ...VictoryTheme.material.axis,
    style: {
      axis: { stroke: '#cbd5e1' },
      grid: { stroke: '#e2e8f0', strokeDasharray: '4,4' },
      tickLabels: { fontSize: 10, fill: '#64748b' }
    }
  }
}
```

## Performance Optimization

### 1. Data Formatting
```tsx
// Optimize data for Victory
const optimizedData = rawData.map(item => ({
  x: item.date,
  y: item.value,
  label: `${item.date}: ${item.value}%`
}))
```

### 2. Conditional Rendering
```tsx
{data.length > 0 && (
  <VictoryChart>
    <VictoryLine data={data} />
  </VictoryChart>
)}
```

### 3. Memoization
```tsx
const MemoizedChart = React.memo(({ data }) => (
  <VictoryChart>
    <VictoryLine data={data} />
  </VictoryChart>
))
```

## Integration with Existing Components

### 1. Replace Recharts
You can gradually replace Recharts with Victory:

```tsx
// Before (Recharts)
<LineChart data={data}>
  <Line dataKey="value" />
</LineChart>

// After (Victory)
<VictoryChart>
  <VictoryLine data={data} y="value" />
</VictoryChart>
```

### 2. Combine with UI Components
```tsx
<Card>
  <CardHeader>
    <CardTitle>Calibration Trends</CardTitle>
  </CardHeader>
  <CardContent>
    <VictoryChart height={300}>
      <VictoryLine data={calibrationData} />
    </VictoryChart>
  </CardContent>
</Card>
```

## Demo Pages

I've created two demo pages for you to explore:

1. **Basic Victory Demo**: `/dashboard/victory-demo`
   - Shows all chart types
   - Interactive chart switching
   - Usage tips and features

2. **Laboratory Analytics**: `/dashboard/laboratory-analytics`
   - Specialized for laboratory data
   - Real-world use cases
   - Compliance monitoring

## Migration Strategy

### Phase 1: Add Victory Components
- Create new charts using Victory
- Keep existing Recharts for now
- Test performance and functionality

### Phase 2: Gradual Replacement
- Replace simple charts first
- Update data formatting
- Maintain consistent styling

### Phase 3: Full Integration
- Remove Recharts dependency
- Optimize for performance
- Add advanced features

## Troubleshooting

### Common Issues

1. **Charts not rendering**
   - Check data format (must have x and y properties)
   - Ensure container has defined dimensions
   - Verify Victory components are imported

2. **Styling issues**
   - Use VictoryTheme.material for consistent styling
   - Override specific styles as needed
   - Check CSS conflicts

3. **Performance problems**
   - Limit data points for large datasets
   - Use React.memo for chart components
   - Consider data aggregation

### Debug Tips

```tsx
// Add console logging to debug data
console.log('Chart data:', data)

// Check Victory version
console.log('Victory version:', require('victory/package.json').version)
```

## Resources

- [Victory Documentation](https://formidable.com/open-source/victory/)
- [Victory GitHub](https://github.com/FormidableLabs/victory)
- [Victory Examples](https://formidable.com/open-source/victory/gallery/)

## Next Steps

1. Visit the demo pages to see Victory in action
2. Start with simple line charts for trends
3. Gradually add more complex visualizations
4. Customize styling to match your design system
5. Integrate with real laboratory data

Victory provides powerful, interactive charts that are perfect for laboratory analytics and compliance monitoring. The library is already installed and ready to use in your LabGuard Pro project! 