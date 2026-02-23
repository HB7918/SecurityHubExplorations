import { useState, useRef, useEffect } from 'react';
import Button from '@cloudscape-design/components/button';
import RadioGroup from '@cloudscape-design/components/radio-group';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Icon from '@cloudscape-design/components/icon';

const MODES = [
  { value: 'full-focus', label: 'Show me everything - Full focus' },
  { value: 'secops-focus', label: 'Security Ops focus' },
  { value: 'cloud-security', label: 'Cloud security focus' },
];

const modeLabels: Record<string, string> = {};
MODES.forEach(m => { modeLabels[m.value] = m.label; });

export function useMode() {
  const [mode, setMode] = useState('full-focus');
  return { mode, setMode, modeLabel: modeLabels[mode] || mode };
}

export default function ModeSelector({ mode, onModeChange }: { mode: string; onModeChange: (m: string) => void }) {
  const [open, setOpen] = useState(false);
  const [tempMode, setTempMode] = useState(mode);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setTempMode(mode); }, [mode]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }} ref={ref}>
      <Button variant="inline-link" iconName="edit" onClick={() => setOpen(!open)}>Change focus</Button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 8,
          background: '#fff', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          padding: 24, zIndex: 1100, width: 320,
        }}>
          <SpaceBetween size="m">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Box variant="h3">Select your working mode</Box>
              <Icon name="status-info" size="small" variant="subtle" />
            </div>
            <RadioGroup
              value={tempMode}
              onChange={({ detail }) => setTempMode(detail.value)}
              items={MODES}
            />
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, paddingTop: 8 }}>
              <Button variant="link" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => { onModeChange(tempMode); setOpen(false); }}>Proceed</Button>
            </div>
          </SpaceBetween>
        </div>
      )}
    </div>
  );
}
