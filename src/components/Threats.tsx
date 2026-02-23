import { useState } from 'react';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import Icon from '@cloudscape-design/components/icon';
import { Line } from 'react-chartjs-2';
import { dashboardStats } from '../data/mockData';
import { Finding } from '../types';
import FindingsList from './FindingsList';
import SeverityBadge from './SeverityBadge';

interface Props {
  onSelectFinding: (f: Finding, childRes?: string) => void;
}

export default function Threats({ onSelectFinding }: Props) {
  const [timeRange, setTimeRange] = useState('1day');

  const threatTrendData = {
    labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm', '12am'],
    datasets: [{
      label: 'Threats',
      data: [8, 7, 9, 8, 6, 7, 5],
      borderColor: '#D13212',
      backgroundColor: '#D132121F',
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      borderWidth: 2,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, color: '#687078' },
      },
      y: {
        min: 0,
        max: 15,
        grid: { color: '#e9ebed' },
        ticks: { font: { size: 10 }, color: '#687078', stepSize: 5 },
      },
    },
  };

  return (
    <SpaceBetween size="l">
      <Header variant="h1">Threats</Header>

      <SpaceBetween size="m">
        <SegmentedControl
          selectedId={timeRange}
          onChange={({ detail }) => setTimeRange(detail.selectedId)}
          options={[
            { text: '1 day', id: '1day' },
            { text: '1 week', id: '1week' },
            { text: '1 month', id: '1month' },
            { text: '6 months', id: '6months' },
            { text: '1 year', id: '1year' },
          ]}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, maxWidth: '400px' }}>
          <Container>
            <SpaceBetween size="s">
              <Box variant="h5">
                Total threats{' '}
                <span style={{ color: '#5f6b7a', cursor: 'pointer' }}>
                  <Icon name="status-info" size="small" />
                </span>
              </Box>
              <Box fontSize="display-l" fontWeight="bold" color="text-status-error">
                {dashboardStats.threats.critical + dashboardStats.threats.high + 
                 dashboardStats.threats.medium + dashboardStats.threats.low}
              </Box>
              <SpaceBetween direction="horizontal" size="xs">
                <SeverityBadge severity="Critical" label={`C ${dashboardStats.threats.critical}`} />
                <SeverityBadge severity="High" label={`H ${dashboardStats.threats.high}`} />
                <SeverityBadge severity="Medium" label={`M ${dashboardStats.threats.medium}`} />
                <SeverityBadge severity="Low" label={`L ${dashboardStats.threats.low}`} />
              </SpaceBetween>
            </SpaceBetween>
          </Container>
        </div>

        <Container>
          <SpaceBetween size="m">
            <Box variant="h2">Top threat categories</Box>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { name: 'Malicious activity', count: 4, severity: 'Critical' },
                { name: 'Unauthorized access', count: 3, severity: 'High' },
                { name: 'Data exfiltration', count: 2, severity: 'Critical' },
                { name: 'Suspicious behavior', count: 1, severity: 'Medium' },
              ].map((category, i) => (
                <div key={i} style={{ padding: 12, border: '1px solid #e9ebed', borderRadius: 8 }}>
                  <SpaceBetween size="xs">
                    <Box fontWeight="bold">{category.name}</Box>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box fontSize="heading-l">{category.count}</Box>
                      <SeverityBadge severity={category.severity as any} />
                    </div>
                  </SpaceBetween>
                </div>
              ))}
            </div>
          </SpaceBetween>
        </Container>
      </SpaceBetween>

      <FindingsList onSelectFinding={onSelectFinding} filterType="Threat" />
    </SpaceBetween>
  );
}
