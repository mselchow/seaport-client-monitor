## 0.2.0 (2024-08-25)

### BREAKING CHANGE

- rename Chart component to BarChart, change props and chart structure

### Feat

- **charts-page**: replace charts component with ApexCharts
- update dashboard chart component to use shadcn/ui

### Fix

- **NextTheme**: explicitly enable system theme capability
- **clockifyProject.ts**: update duration parsing to use ISO 8601 formatting via TinyDuration package

### Refactor

- **dashboard**: refactor chart config to its own file specific to the dashboard
- **charts-page**: refactor chart config to its own file specific to 'hours used' page
- **DashboardChart.tsx**: swap chart color from explicit color to existing CSS var for 'primary'

## 0.1.1 (2024-08-05)

### Fix

- **ExcludedClientSettings.tsx**: enable enter key to submit excluded client settings form

## 0.1.0 (2024-08-04)

### Feat

- **ClockifySettings.tsx**: refresh page after adding/updating clockify key

### Fix

- **clerk.ts**: fix clockify key save to use correct json key

### Refactor

- convert from Vite to NextJS
