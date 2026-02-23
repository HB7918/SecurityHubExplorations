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
import { Severity } from '../types';

const severityStyles: Record<Severity, { bg: string; text: string }> = {
  Critical: { bg: colorBackgroundNotificationSeverityCritical, text: colorTextNotificationSeverityCritical },
  High:     { bg: colorBackgroundNotificationSeverityHigh, text: colorTextNotificationSeverityHigh },
  Medium:   { bg: colorBackgroundNotificationSeverityMedium, text: colorTextNotificationSeverityMedium },
  Low:      { bg: colorBackgroundNotificationSeverityLow, text: colorTextNotificationSeverityLow },
};

export default function SeverityBadge({ severity, label }: { severity: Severity; label?: string }) {
  const s = severityStyles[severity];
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 400,
      background: s.bg,
      color: s.text,
      lineHeight: '18px',
      whiteSpace: 'nowrap',
    }}>
      {label ?? severity}
    </span>
  );
}
