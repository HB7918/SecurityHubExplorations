# AWS Security Hub - Future Console

A modern, future-facing version of the AWS Security Hub console built with React, TypeScript, and custom styling inspired by CloudScape Design System.

## ✨ Features

### 1. Summary Dashboard
- Widget-based dashboard showing current security state
- Key metrics: Exposures, Total Findings, Threats, Vulnerabilities, Posture
- Time range filters (1 day, 1 week, 1 month, 6 months, 1 year)
- Severity breakdowns with color-coded badges
- Trend indicators (MoM changes)

### 2. Priority Lane Findings
- Tabbed view (All, Exposures, Threats)
- Keyword search functionality
- Advanced filtering by Severity, Status, Trait, Age
- Expandable findings with AI summaries
- Similar findings grouped together with counts

### 3. Finding Details
- Individual finding expansion showing:
  - AI-generated summary
  - Severity, Type, Traits
  - Resource, Region, Account information
  - Age and Status
  - Associated actions

### 4. Actions Available
- Create ticket
- Add comment
- Copy link
- See Remediation
- Update severity
- Update status
- Export

### 5. Remediation Panel (Sliding from Right)
- 70% width sliding panel
- Interactive attack path visualization showing:
  - Primary resources (orange)
  - Involved resources (blue)
  - Contributing trait counts (red badges)
  - Resource relationships and connections
- Resource details section
- Trait details with categories
- High-level remediation steps
- AI-powered real-time remediation generation
- All associated actions accessible

## 🚀 User Journey Flow

1. **Landing** → User sees Summary dashboard with widgets and metrics
2. **Navigate** → Click "View Priority Lane Findings" to see findings list
3. **Filter** → Use tabs, search, and filters to narrow down findings
4. **Expand** → Click on a finding to see AI summary and details table
5. **Remediate** → Click "See remediation" to open details panel
6. **Visualize** → View attack path diagram and understand the threat
7. **Generate** → Click "Generate real-time remediation steps" for AI assistance
8. **Act** → Take actions (ticket, comment, update) from the panel
9. **Close** → Close panel to return to findings list

## 📦 Installation

```bash
npm install
```

## 🏃 Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Build

```bash
npm run build
```

## 🛠️ Technology Stack

- React 18
- TypeScript
- Vite
- Custom CSS (CloudScape-inspired)
- Real scenario data with Lambda functions, API Gateways, IAM roles

## 🎨 Design Principles

- CloudScape Design System inspired
- AWS console look and feel
- Responsive layout
- Accessible UI components
- Interactive visualizations
- AI-powered insights

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx          # Summary dashboard with widgets
│   ├── Dashboard.css
│   ├── FindingsList.tsx       # Findings list with filters
│   ├── FindingsList.css
│   ├── FindingDetails.tsx     # Sliding panel with attack path
│   └── FindingDetails.css
├── data/
│   └── mockData.ts            # Real scenario security findings
├── types.ts                   # TypeScript interfaces
├── App.tsx                    # Main app with navigation
├── App.css
└── main.tsx                   # Entry point
```

## 🔍 Key Components

### Dashboard
- Time range selector
- Stat cards with metrics
- Navigation to findings

### FindingsList
- Tab navigation
- Search and filters
- Expandable finding rows
- AI summaries

### FindingDetails
- Attack path visualization
- Remediation steps
- AI-generated recommendations
- Resource and trait details

## 🎯 Real Data Scenarios

The app includes realistic security findings:
- Lambda function with code vulnerabilities
- API Gateway without authorization
- S3 bucket with public access
- IAM role misconfigurations
- Attack paths showing resource relationships

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Notes

- The app is fully functional and clickable
- All interactions work without backend
- Mock data represents real AWS security scenarios
- Attack path visualization is interactive
- AI remediation generation simulated with 2s delay
