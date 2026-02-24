import { useState, ReactNode } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import Button from '@cloudscape-design/components/button';
import Icon from '@cloudscape-design/components/icon';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { dashboardStats as ds } from '../data/mockData';
import { Finding } from '../types';
import FindingsList from './FindingsList';
import SeverityBadge from './SeverityBadge';
import './Dashboard.css';
import './Dashboard.css';
import ModeSelector, { useMode } from './ModeSelector';
import WidgetPanel from './WidgetPanel';

interface Props { onSelectFinding: (f: Finding, childRes?: string) => void }
type CD = { x: string[]; y: number; p: number[] };

const TD: Record<string, CD> = {
  '1day': { x: ['12am','4am','8am','12pm','4pm','8pm','12am'], y: 25, p: [20,18,22,19,15,17,12] },
  '1week': { x: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], y: 28, p: [25,23,22,20,18,16,14] },
  '1month': { x: ['Wk1','Wk2','Wk3','Wk4'], y: 30, p: [28,24,20,16] },
  '6months': { x: ['Sep','Oct','Nov','Dec','Jan','Feb'], y: 35, p: [32,28,25,22,18,14] },
  '1year': { x: ['Mar','May','Jul','Sep','Nov','Jan'], y: 40, p: [38,34,30,25,20,14] },
};

// Removed unused RES constant

function Chrt({ d, c, h = 50 }: { d: CD; c: string; h?: number }) {
  return (
    <div style={{ height: h, width: '100%' }}>
      <Line
        data={{
          labels: d.x,
          datasets: [{
            data: d.p,
            borderColor: c,
            backgroundColor: c + '1F',
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 1.5,
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { tooltip: { enabled: true }, legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 9 }, color: '#687078', maxRotation: 0 } },
            y: { min: 0, max: d.y, grid: { color: '#e9ebed' }, ticks: { font: { size: 9 }, color: '#687078', stepSize: Math.round(d.y / 2) } },
          },
        }}
      />
    </div>
  );
}

const IB = () => (
  <span style={{ color: '#5f6b7a', cursor: 'pointer', verticalAlign: 'middle' }}>
    <Icon name="status-info" size="small" />
  </span>
);

function NWT({ v, c, tc, tr }: { v: string; c: string; tc?: string; tr: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Box fontSize="display-l" fontWeight="bold" color={tc as any || undefined}>{v}</Box>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Chrt d={TD[tr] || TD['1day']} c={c} h={60} />
      </div>
    </div>
  );
}

const GH = () => <span style={{ cursor: 'grab', color: '#687078' }}><Icon name="drag-indicator" size="normal" /></span>;
const WT = ({ children }: { children: ReactNode }) => <Box variant="h5">{children}</Box>;
const SH = 134;

export default function Dashboard({ onSelectFinding }: Props) {
  const [tr, setTr] = useState('1day');
  const { mode, setMode, modeLabel } = useMode();
  const [we, setWe] = useState(true);
  const [widgetPanelOpen, setWidgetPanelOpen] = useState(false);

  const sw = (id: string, ct: ReactNode) => (
    <div key={id} className="widget-compact">
      <Container>
        <div style={{ height: SH, display: 'flex', gap: 8, alignItems: 'flex-start', overflow: 'hidden' }}>
          <div style={{ paddingTop: 1 }}><GH /></div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>{ct}</div>
        </div>
      </Container>
    </div>
  );

  return (
    <SpaceBetween size="l">
      <Header variant="h1" actions={
        <SpaceBetween direction="horizontal" size="xs">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#16191f' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.00002 8.99998C5.55231 8.99998 6.00002 8.55227 6.00002 7.99998C6.00002 7.4477 5.55231 6.99998 5.00002 6.99998C4.44774 6.99998 4.00002 7.4477 4.00002 7.99998C4.00002 8.55227 4.44774 8.99998 5.00002 8.99998Z" fill="#16191F"/><path d="M9.00002 7.99998C9.00002 8.55227 8.55231 8.99998 8.00002 8.99998C7.44774 8.99998 7.00002 8.55227 7.00002 7.99998C7.00002 7.4477 7.44774 6.99998 8.00002 6.99998C8.55231 6.99998 9.00002 7.4477 9.00002 7.99998Z" fill="#16191F"/><path d="M11 8.99998C11.5523 8.99998 12 8.55227 12 7.99998C12 7.4477 11.5523 6.99998 11 6.99998C10.4477 6.99998 10 7.4477 10 7.99998C10 8.55227 10.4477 8.99998 11 8.99998Z" fill="#16191F"/><path fillRule="evenodd" clipRule="evenodd" d="M8.00002 0C9.15221 0.768126 10.8945 1.53623 13.0001 1.39795C13.6358 1.35621 14.3045 1.23187 15.0001 1V7.99997C15.0001 12 11 15 8.00002 16C4.99999 15 1.00018 12 1.00012 7.99997V1C1.69575 1.23188 2.3645 1.35622 3.00012 1.39796C5.1057 1.53624 6.84784 0.768122 8.00002 0ZM3.00012 3.40283C4.9779 3.50588 6.68918 2.97512 8.00003 2.31133C9.31094 2.97512 11.0223 3.50587 13.0001 3.40282V7.99997C13.0001 9.30004 12.3506 10.571 11.2109 11.7108C10.2603 12.6614 9.0768 13.4045 8.00002 13.8622C6.92327 13.4045 5.73989 12.6614 4.78932 11.7108C3.64964 10.5711 3.00015 9.30006 3.00012 7.99994V3.40283Z" fill="#16191F"/></svg>
              You're in {modeLabel},
            </span>
            <ModeSelector mode={mode} onModeChange={setMode} />
            <span style={{ borderLeft: '1px solid #d5dbdb', height: 24, display: 'inline-block' }} />
            <div onClick={() => setWidgetPanelOpen(true)} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #0972d3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxSizing: 'border-box' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="7" y1="2" x2="7" y2="12" stroke="#0972d3" strokeWidth="2" strokeLinecap="round"/><line x1="2" y1="7" x2="12" y2="7" stroke="#0972d3" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          </div>
        </SpaceBetween>
      }>Security Hub</Header>

      <ExpandableSection variant="default" headerText="Hub highlights"
        headerActions={<Button variant="inline-link">Export highlights</Button>}
        expanded={we} onChange={({ detail }) => setWe(detail.expanded)}>
        <SpaceBetween size="m">
          <SegmentedControl selectedId={tr} onChange={({ detail }) => setTr(detail.selectedId)} options={[
            { text: '1 day', id: '1day' }, { text: '1 week', id: '1week' },
            { text: '1 month', id: '1month' }, { text: '6 months', id: '6months' },
            { text: '1 year', id: '1year' }
          ]} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {sw('exposures', <>
              <WT>Exposures <IB /></WT>
              <NWT v="20" c="#870303" tc="text-status-info" tr={tr} />
              <SpaceBetween direction="horizontal" size="xs">
                <SeverityBadge severity="Critical" label={`C ${ds.exposures.critical}`} />
                <SeverityBadge severity="High" label={`H ${ds.exposures.high}`} />
                <SeverityBadge severity="Medium" label={`M ${ds.exposures.medium}`} />
                <SeverityBadge severity="Low" label={`L ${ds.exposures.low}`} />
              </SpaceBetween>
            </>)}
            {sw('threat', <>
              <WT>Threat <IB /></WT>
              <NWT v="10" c="#ce3311" tr={tr} />
              <SpaceBetween direction="horizontal" size="xs">
                <SeverityBadge severity="Critical" label={`C ${ds.threats.critical}`} />
                <SeverityBadge severity="High" label={`H ${ds.threats.high}`} />
                <SeverityBadge severity="Medium" label={`M ${ds.threats.medium}`} />
                <SeverityBadge severity="Low" label={`L ${ds.threats.low}`} />
              </SpaceBetween>
            </>)}
            {sw('vulns', <>
              <WT>Vulnerabilities <IB /></WT>
              <NWT v="200" c="#ce3311" tc="text-status-info" tr={tr} />
              <SpaceBetween direction="horizontal" size="xs">
                <SeverityBadge severity="Critical" label={`C ${ds.vulnerabilities.critical}`} />
                <SeverityBadge severity="High" label={`H ${ds.vulnerabilities.high}`} />
                <SeverityBadge severity="Medium" label={`M ${ds.vulnerabilities.medium}`} />
                <SeverityBadge severity="Low" label={`L ${ds.vulnerabilities.low}`} />
              </SpaceBetween>
            </>)}
            {sw('posture', <>
              <WT>Posture <IB /></WT>
              <NWT v="560" c="#ce3311" tr={tr} />
              <SpaceBetween direction="horizontal" size="xs">
                <SeverityBadge severity="Critical" label={`C ${ds.posture.critical}`} />
                <SeverityBadge severity="High" label={`H ${ds.posture.high}`} />
                <SeverityBadge severity="Medium" label={`M ${ds.posture.medium}`} />
                <SeverityBadge severity="Low" label={`L ${ds.posture.low}`} />
              </SpaceBetween>
            </>)}
            {sw('coverage', <>
              <WT>Security coverage</WT>
              <div style={{ fontSize: 12, marginTop: 4 }}>
                {[
                  { name: 'Vulnerability management', by: 'Amazon Inspector', pct: 100 },
                  { name: 'Threat analytics', by: 'Amazon GuardDuty', pct: 100 },
                  { name: 'Sensitive data discovery', by: 'Amazon Macie', pct: 85 },
                  { name: 'Posture management', by: 'Security Hub CSPM', pct: 100 },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: '3px 0', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>{item.name}</div>
                      <div style={{ color: '#5f6b7a', fontSize: 11 }}>By {item.by}</div>
                    </div>
                    <div>
                      <div style={{ background: '#e9ebed', borderRadius: 4, height: 8, width: '100%' }}>
                        <div style={{ background: '#16b378', borderRadius: 4, height: 8, width: `${item.pct}%` }} />
                      </div>
                      <div style={{ fontSize: 10, color: '#5f6b7a' }}>{item.pct}% covered</div>
                    </div>
                  </div>
                ))}
              </div>
            </>)}
            {sw('sensitive', <>
              <WT>Sensitive data <IB /></WT>
              <NWT v="85" c="#9b59b6" tr={tr} />
              <SpaceBetween direction="horizontal" size="xs">
                <SeverityBadge severity="Critical" label={`C ${ds.sensitiveData.critical}`} />
                <SeverityBadge severity="High" label={`H ${ds.sensitiveData.high}`} />
                <SeverityBadge severity="Medium" label={`M ${ds.sensitiveData.medium}`} />
                <SeverityBadge severity="Low" label={`L ${ds.sensitiveData.low}`} />
              </SpaceBetween>
            </>)}
          </div>

          <div className="widget-compact">
            <Container>
              <SpaceBetween size="s">
                <div>
                  <Box variant="h5">Cloud security news stories</Box>
                  <Box fontSize="body-s" color="text-body-secondary">From sources across the web</Box>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                  {[
                    { title: 'AWS patches critical IAM vulnerability', source: 'SecurityWeek' },
                    { title: 'New S3 bucket exposure scanner released', source: 'The Hacker News' },
                    { title: 'Cloud misconfigurations up 40% in Q4', source: 'Dark Reading' },
                    { title: 'Zero-day in Lambda runtime discovered', source: 'BleepingComputer' },
                    { title: 'CISA warns of active cloud exploits', source: 'CyberScoop' },
                    { title: 'Best practices for ECS security posture', source: 'AWS Blog' },
                    { title: 'API Gateway auth bypass techniques', source: 'PortSwigger' },
                    { title: 'CloudTrail logging gaps exploited in wild', source: 'Recorded Future' },
                  ].map((item, i) => (
                    <div key={i} style={{ fontSize: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#0972d3', marginBottom: 2 }}>
                        <Icon name="external" size="small" /> <span style={{ fontWeight: 600 }}>{item.source}</span>
                      </div>
                      <Box color="text-body-secondary" fontSize="body-s">{item.title}</Box>
                    </div>
                  ))}
                </div>
              </SpaceBetween>
            </Container>
          </div>
        </SpaceBetween>
      </ExpandableSection>

      <FindingsList onSelectFinding={onSelectFinding} />
      <WidgetPanel open={widgetPanelOpen} onClose={() => setWidgetPanelOpen(false)} />
    </SpaceBetween>
  );
}
