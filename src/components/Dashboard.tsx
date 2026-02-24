import { useState, useEffect, useRef, ReactNode } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement);
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import Button from '@cloudscape-design/components/button';
import Icon from '@cloudscape-design/components/icon';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { dashboardStats as ds, mockFindings } from '../data/mockData';
import { Finding } from '../types';
import FindingsList from './FindingsList';
import SeverityBadge from './SeverityBadge';
import './Dashboard.css';
import ModeSelector, { useMode } from './ModeSelector';
import WidgetPanel from './WidgetPanel';

interface Props { 
  onSelectFinding: (f: Finding, childRes?: string) => void;
  onNavigateToThreats?: (severityFilter?: string) => void;
}
type CD = { x: string[]; y: number; p: number[] };

const TD: Record<string, CD> = {
  'lastlogin': { x: ['12am','4am','8am','12pm','4pm','8pm','12am'], y: 25, p: [18,16,20,17,13,15,10] },
  '1day': { x: ['12am','4am','8am','12pm','4pm','8pm','12am'], y: 25, p: [20,18,22,19,15,17,12] },
  '1week': { x: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], y: 28, p: [25,23,22,20,18,16,14] },
  '1month': { x: ['Wk1','Wk2','Wk3','Wk4'], y: 30, p: [28,24,20,16] },
  '6months': { x: ['Sep','Oct','Nov','Dec','Jan','Feb'], y: 35, p: [32,28,25,22,18,14] },
  '1year': { x: ['Mar','May','Jul','Sep','Nov','Jan'], y: 40, p: [38,34,30,25,20,14] },
};

const RD: Record<string, number[]> = {
  'lastlogin': [1,3,5,7,9,12,15],
  '1day': [2,4,6,8,10,14,18],
  '1week': [3,5,8,11,14,17,20],
  '1month': [4,10,16,22],
  '6months': [5,10,16,20,26,30],
  '1year': [4,10,18,24,30,36],
};

function Chrt({ d, c, h = 50, resData }: { d: CD; c: string; h?: number; resData?: number[] }) {
  const datasets: any[] = [{
    label: 'Open',
    data: d.p,
    borderColor: c,
    backgroundColor: c + '1F',
    fill: true,
    tension: 0.3,
    pointRadius: 1,
    pointBackgroundColor: c,
    borderWidth: 2,
  }];
  if (resData) {
    datasets.push({
      label: 'Resolved',
      data: resData,
      borderColor: '#16b378',
      backgroundColor: 'transparent',
      fill: false,
      tension: 0.3,
      pointRadius: 1,
      pointBackgroundColor: '#16b378',
      borderWidth: 2,
    });
  }
  return (
    <div style={{ height: h, width: '100%' }}>
      <Line
        data={{ labels: d.x, datasets }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: { enabled: true },
            legend: { display: !!resData, position: 'bottom', align: 'end' as const, labels: { boxWidth: 8, font: { size: 10 }, padding: 6 } },
          },
          scales: {
            x: {
              display: true,
              grid: { display: true, color: '#f0f0f0' },
              ticks: { font: { size: 9 }, color: '#687078', maxRotation: 0 },
              border: { display: true, color: '#d5dbdb' },
            },
            y: {
              display: true,
              min: 0,
              max: d.y,
              grid: { display: true, color: '#e9ebed' },
              ticks: { font: { size: 9 }, color: '#687078', stepSize: Math.round(d.y / 4) },
              border: { display: true, color: '#d5dbdb' },
            },
          },
        }}
      />
    </div>
  );
}

function CoveragePie({ pct, label, by, color }: { pct: number; label: string; by: string; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{ width: 52, height: 52, position: 'relative' }}>
        <Doughnut
          data={{
            datasets: [{
              data: [pct, 100 - pct],
              backgroundColor: [color, '#e9ebed'],
              borderWidth: 0,
            }],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            cutout: '70%',
            plugins: { tooltip: { enabled: false }, legend: { display: false } },
          }}
        />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 10, fontWeight: 700, color: '#16191f' }}>{pct}%</div>
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, textAlign: 'center', lineHeight: '1.3', color: '#16191f', minHeight: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 80, whiteSpace: 'pre-line' }}>{label}</div>
      <div style={{ fontSize: 9, color: '#5f6b7a', textAlign: 'center' }}>{by}</div>
    </div>
  );
}

const IB = () => (
  <span style={{ color: '#5f6b7a', cursor: 'pointer', verticalAlign: 'middle' }}>
    <Icon name="status-info" size="small" />
  </span>
);

function NWT({ v, c, tr }: { v: string; c: string; tr: string }) {
  const td = TD[tr] || TD['1day'];
  const rd = RD[tr] || RD['1day'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Box fontSize="display-l" fontWeight="heavy" color="text-status-info">{v}</Box>
      <div style={{ flex: 1, minWidth: 0, height: 100 }}>
        <Chrt d={td} c={c} h={100} resData={rd} />
      </div>
    </div>
  );
}

const GH = () => <span style={{ cursor: 'grab', color: '#687078' }}><Icon name="drag-indicator" size="normal" /></span>;
const WT = ({ children }: { children: ReactNode }) => <Box variant="h5">{children}</Box>;

const NEWS_ITEMS = [
  { title: 'AWS patches critical IAM vulnerability', source: 'SecurityWeek' },
  { title: 'New S3 bucket exposure scanner released', source: 'The Hacker News' },
  { title: 'Cloud misconfigurations up 40% in Q4', source: 'Dark Reading' },
  { title: 'Zero-day in Lambda runtime discovered', source: 'BleepingComputer' },
  { title: 'CISA warns of active cloud exploits', source: 'CyberScoop' },
  { title: 'Best practices for ECS security posture', source: 'AWS Blog' },
  { title: 'API Gateway auth bypass techniques', source: 'PortSwigger' },
  { title: 'CloudTrail logging gaps exploited in wild', source: 'Recorded Future' },
];

function NewsTicker() {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [fade, setFade] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iv = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % NEWS_ITEMS.length);
        setFade(true);
      }, 150);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const item = NEWS_ITEMS[idx];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          padding: '4px 10px', borderRadius: 4, background: '#ffffff',
          border: '1px solid #d5dbdb', fontSize: 12, whiteSpace: 'nowrap',
          transition: 'opacity 0.15s', opacity: fade ? 1 : 0,
          width: 360, overflow: 'hidden',
        }}
      >
        <Icon name="status-info" size="small" />
        <span style={{ fontWeight: 600, color: '#0972d3' }}>{item.source}</span>
        <span style={{ color: '#16191f', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</span>
        <Icon name="caret-down-filled" size="small" />
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 1000,
          background: '#fff', border: '1px solid #d5dbdb', borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)', width: 380, maxHeight: 320, overflow: 'auto',
        }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #eaeded' }}>
            <Box variant="h5">Cloud security news stories</Box>
            <Box fontSize="body-s" color="text-body-secondary">From sources across the web</Box>
          </div>
          {NEWS_ITEMS.map((n, i) => (
            <div key={i} style={{
              padding: '8px 14px', borderBottom: i < NEWS_ITEMS.length - 1 ? '1px solid #f2f3f3' : 'none',
              cursor: 'pointer',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f2f8fd')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#0972d3', marginBottom: 2, fontSize: 12 }}>
                <Icon name="external" size="small" /> <span style={{ fontWeight: 600 }}>{n.source}</span>
              </div>
              <div style={{ fontSize: 12, color: '#16191f' }}>{n.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ onSelectFinding, onNavigateToThreats }: Props) {
  const [tr, setTr] = useState('lastlogin');
  const { mode, setMode, modeLabel } = useMode();
  const [we, setWe] = useState(true);
  const [widgetPanelOpen, setWidgetPanelOpen] = useState(false);

  const threatFindings = mockFindings.filter(f => f.type === 'Threat');
  const threatTotal = threatFindings.reduce((sum, f) => sum + f.similarFindings.length, 0);
  const threatBySev = {
    critical: threatFindings.filter(f => f.severity === 'Critical').reduce((s, f) => s + f.similarFindings.length, 0),
    high: threatFindings.filter(f => f.severity === 'High').reduce((s, f) => s + f.similarFindings.length, 0),
    medium: threatFindings.filter(f => f.severity === 'Medium').reduce((s, f) => s + f.similarFindings.length, 0),
    low: threatFindings.filter(f => f.severity === 'Low').reduce((s, f) => s + f.similarFindings.length, 0),
  };

  const sw = (id: string, ct: ReactNode) => (
    <div key={id} className="widget-compact">
      <Container>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ paddingTop: 1 }}><GH /></div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>{ct}</div>
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
        headerActions={
          <SpaceBetween direction="horizontal" size="xs">
            <div style={{ position: 'relative', minWidth: 200 }}>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              >
                <path 
                  d="M11.5 6.5C11.5 9.26142 9.26142 11.5 6.5 11.5C3.73858 11.5 1.5 9.26142 1.5 6.5C1.5 3.73858 3.73858 1.5 6.5 1.5C9.26142 1.5 11.5 3.73858 11.5 6.5Z" 
                  stroke="#0972d3" 
                  strokeWidth="1.5"
                />
                <path 
                  d="M10 10L14.5 14.5" 
                  stroke="#0972d3" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search"
                style={{
                  width: '100%',
                  padding: '6px 10px 6px 32px',
                  border: '1px solid #aab7b8',
                  borderRadius: 8,
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                  height: '31px'
                }}
              />
            </div>
            <Button variant="inline-link">Share highlights</Button>
          </SpaceBetween>
        }
        expanded={we} onChange={({ detail }) => setWe(detail.expanded)}>
        <SpaceBetween size="m">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <SegmentedControl selectedId={tr} onChange={({ detail }) => setTr(detail.selectedId)} options={[
              { text: 'Since last login', id: 'lastlogin' },
              { text: '1 day', id: '1day' }, { text: '1 week', id: '1week' },
              { text: '1 month', id: '1month' }, { text: '6 months', id: '6months' },
              { text: '1 year', id: '1year' }
            ]} />
            <NewsTicker />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {sw('exposures', <>
              <WT>Exposures <IB /></WT>
              <NWT v="20" c="#870303" tr={tr} />
              <SpaceBetween direction="horizontal" size="xs">
                <SeverityBadge severity="Critical" label={`C ${ds.exposures.critical}`} />
                <SeverityBadge severity="High" label={`H ${ds.exposures.high}`} />
                <SeverityBadge severity="Medium" label={`M ${ds.exposures.medium}`} />
                <SeverityBadge severity="Low" label={`L ${ds.exposures.low}`} />
              </SpaceBetween>
            </>)}
            {sw('threat', <>
              <WT>Threat <IB /></WT>
              <div 
                onClick={() => onNavigateToThreats?.('all')}
                style={{ cursor: 'pointer' }}
              >
                <NWT v={String(threatTotal)} c="#ce3311" tr={tr} />
              </div>
              <SpaceBetween direction="horizontal" size="xs">
                <div onClick={() => onNavigateToThreats?.('Critical')} style={{ cursor: 'pointer' }}>
                  <SeverityBadge severity="Critical" label={`C ${threatBySev.critical}`} />
                </div>
                <div onClick={() => onNavigateToThreats?.('High')} style={{ cursor: 'pointer' }}>
                  <SeverityBadge severity="High" label={`H ${threatBySev.high}`} />
                </div>
                <div onClick={() => onNavigateToThreats?.('Medium')} style={{ cursor: 'pointer' }}>
                  <SeverityBadge severity="Medium" label={`M ${threatBySev.medium}`} />
                </div>
                <div onClick={() => onNavigateToThreats?.('Low')} style={{ cursor: 'pointer' }}>
                  <SeverityBadge severity="Low" label={`L ${threatBySev.low}`} />
                </div>
              </SpaceBetween>
            </>)}
            {sw('vulns', <>
              <WT>Vulnerabilities <IB /></WT>
              <NWT v="200" c="#ce3311" tr={tr} />
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
            {sw('coverage', <>
              <WT>Security coverage</WT>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 4 }}>
                <CoveragePie pct={92} label="Vulnerability management" by="Amazon Inspector" color="#16b378" />
                <CoveragePie pct={78} label="Threat analytics" by="Amazon GuardDuty" color="#16b378" />
                <CoveragePie pct={64} label={"Sensitive\ndata discovery"} by="Amazon Macie" color="#16b378" />
                <CoveragePie pct={88} label="Posture management" by="Security Hub CSPM" color="#16b378" />
              </div>
              <div style={{ fontSize: 13 }}><StatusIndicator type="success">Configure Macie in remaining 32% accounts to become 20% more secure</StatusIndicator></div>
            </>)}
          </div>
        </SpaceBetween>
      </ExpandableSection>

      <FindingsList onSelectFinding={onSelectFinding} />
      <WidgetPanel open={widgetPanelOpen} onClose={() => setWidgetPanelOpen(false)} />
    </SpaceBetween>
  );
}
