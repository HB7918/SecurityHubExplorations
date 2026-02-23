import { useState } from 'react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import TextFilter from '@cloudscape-design/components/text-filter';
import Icon from '@cloudscape-design/components/icon';

const widgets = [
  { id: 'threat', title: 'Threat summary', desc: 'A threat finding is an event with the potential to adversely impact operations, assets, or individuals. Top severity detections are listed below.' },
  { id: 'exposure', title: 'Exposure summary', desc: 'An exposure finding is a correlation of multiple security findings, resource relationships and configurations. The exposure findings with the greatest severity and most findings are listed below.' },
  { id: 'resource', title: 'Resource summary', desc: 'View resources prioritized by exposures and attack sequences.' },
  { id: 'vulnerability', title: 'Vulnerability summary', desc: 'Track software vulnerabilities across your resources with severity breakdown and remediation status.' },
  { id: 'compliance', title: 'Compliance overview', desc: 'Monitor compliance posture across frameworks like CIS, PCI-DSS, and SOC2 with pass/fail trends.' },
  { id: 'attack-seq', title: 'Attack sequences', desc: 'View correlated attack sequences that chain multiple findings into potential attack paths.' },
];

export default function WidgetPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [filter, setFilter] = useState('');
  if (!open) return null;
  const filtered = widgets.filter(w => w.title.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: 320, height: '100vh', background: '#fff', boxShadow: '-4px 0 16px rgba(0,0,0,0.12)', zIndex: 1200, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e9ebed' }}>
        <Box variant="h3">Add widgets</Box>
        <Button variant="icon" iconName="close" onClick={onClose} />
      </div>
      <div style={{ padding: '12px 20px' }}>
        <TextFilter filteringText={filter} filteringPlaceholder="Find widget" onChange={({ detail }) => setFilter(detail.filteringText)} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        {filtered.map(w => (
          <div key={w.id} style={{ border: '1px solid #e9ebed', borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ color: '#687078', paddingTop: 2 }}><Icon name="drag-indicator" size="normal" /></span>
              <div>
                <Box fontWeight="bold" fontSize="heading-s">{w.title}</Box>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="4" y="20" width="6" height="24" rx="1" fill="#d5dbdb" />
                    <rect x="14" y="12" width="6" height="32" rx="1" fill="#d5dbdb" />
                    <rect x="24" y="8" width="6" height="36" rx="1" fill="#d5dbdb" />
                    <circle cx="38" cy="24" r="10" fill="none" stroke="#0972d3" strokeWidth="2" />
                    <path d="M34 24l3 3 6-6" stroke="#0972d3" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <Box variant="p" color="text-body-secondary" fontSize="body-s">{w.desc}</Box>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
