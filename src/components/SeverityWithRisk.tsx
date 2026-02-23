import Popover from '@cloudscape-design/components/popover';
import { Severity } from '../types';
import {
  colorBackgroundNotificationSeverityCritical,
  colorBackgroundNotificationSeverityHigh,
  colorBackgroundNotificationSeverityMedium,
  colorBackgroundNotificationSeverityLow,
  colorTextNotificationSeverityCritical,
  colorTextNotificationSeverityHigh,
  colorTextNotificationSeverityMedium,
  colorTextNotificationSeverityLow,
} from '@cloudscape-design/design-tokens';
import './SeverityWithRisk.css';

const styles: Record<Severity, { bg: string; text: string }> = {
  Critical: { bg: colorBackgroundNotificationSeverityCritical, text: colorTextNotificationSeverityCritical },
  High: { bg: colorBackgroundNotificationSeverityHigh, text: colorTextNotificationSeverityHigh },
  Medium: { bg: colorBackgroundNotificationSeverityMedium, text: colorTextNotificationSeverityMedium },
  Low: { bg: colorBackgroundNotificationSeverityLow, text: colorTextNotificationSeverityLow },
};

function RiskSignal({ impact, severity }: { impact: number; severity: string }) {
  const color = severity === 'Critical' ? '#870303' : severity === 'High' ? '#ce3311' : severity === 'Medium' ? '#f89256' : '#f2cd54';
  const bars = impact >= 80 ? 4 : impact >= 60 ? 3 : impact >= 40 ? 2 : 1;
  const inactive = '#e0e0e0';
  const label = impact >= 80 ? 'Risk > 80%' : impact >= 60 ? 'Risk ~ 60%' : impact >= 40 ? 'Risk ~ 40%' : 'Risk < 40%';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width="28" height="24" viewBox="0 0 20 18" style={{ transform: 'scaleX(-1)' }}>
        <path d="M3,16 L3,14" stroke={bars >= 1 ? color : inactive} strokeWidth="3" strokeLinecap="round" />
        <path d="M8,16 L8,11" stroke={bars >= 2 ? color : inactive} strokeWidth="3" strokeLinecap="round" />
        <path d="M13,16 L13,7" stroke={bars >= 3 ? color : inactive} strokeWidth="3" strokeLinecap="round" />
        <path d="M18,16 L18,3" stroke={bars >= 4 ? color : inactive} strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: 13, color: '#5f6b7a' }}>{label}</span>
    </div>
  );
}

export default function SeverityWithRisk({ severity, impact }: { severity: Severity; impact: number }) {
  const s = styles[severity];
  return (
    <span className="severity-popover-trigger" style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 4,
      background: s.bg, whiteSpace: 'nowrap', color: s.text,
    }}>
      <Popover
        dismissButton
        position="bottom"
        size="medium"
        triggerType="text"
        renderWithPortal
        header="Estimated business risk"
        content={<RiskSignal impact={impact} severity={severity} />}
      >
        <span style={{ color: 'inherit', fontSize: 12, fontWeight: 400, cursor: 'pointer' }}>{severity}</span>
      </Popover>
    </span>
  );
}
