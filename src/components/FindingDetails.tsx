import { useState } from 'react';
import Link from '@cloudscape-design/components/link';
import AssignDropdown, { User } from './AssignDropdown';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import Button from '@cloudscape-design/components/button';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { Finding } from '../types';

interface FindingDetailsProps {
  finding: Finding; primaryResource?: string;
  onClose: () => void;
}

const ALL_TRAITS = ['Reachability', 'Sensitive Data', 'Vulnerability', 'Misconfiguration', 'Assumability'];

export default function FindingDetails({ finding, primaryResource, onClose }: FindingDetailsProps) {
  const [generatingRemediation, setGeneratingRemediation] = useState(false);
  const [assignee, setAssignee] = useState<User | null>(null);
  const [showGeneratedSteps, setShowGeneratedSteps] = useState(false);
  const activeTraitCategories = new Set(finding.traits.map(t => t.category));

  const handleGenerateRemediation = () => {
    setGeneratingRemediation(true);
    setTimeout(() => { setGeneratingRemediation(false); setShowGeneratedSteps(true); }, 2000);
  };

  const renderNode = (node: any, level = 0) => {
    const isPrimary = node.category === 'primary';
    const borderColor = isPrimary ? '#FF9900' : '#D13212';
    const bgColor = '#fff';
    const hasTraits = node.traitCount && node.traitCount > 0;
    
    // AWS service icon mapping (using colored circles with service abbreviations for now)
    const getServiceIcon = (type: string) => {
      const iconMap: Record<string, { bg: string; text: string }> = {
        'Lambda Function': { bg: '#FF9900', text: 'λ' },
        'IAM Role': { bg: '#DD344C', text: 'IAM' },
        'IAM Policy': { bg: '#DD344C', text: 'IAM' },
        'Action': { bg: '#DD344C', text: 'A' },
        'API Gateway': { bg: '#FF4F8B', text: 'API' },
        'Endpoint': { bg: '#FF4F8B', text: 'EP' },
      };
      return iconMap[type] || { bg: '#0972D3', text: '?' };
    };
    
    const icon = getServiceIcon(node.type);
    
    return (
      <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {/* Node box */}
        <div style={{ 
          padding: '12px 14px', 
          border: `2px solid ${borderColor}`, 
          borderRadius: 10, 
          background: bgColor,
          minWidth: 200,
          maxWidth: 240,
          position: 'relative',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          {/* AWS Service Icon */}
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 6,
            background: icon.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            flexShrink: 0
          }}>
            {icon.text}
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: '#5f6b7a', marginBottom: 2, fontWeight: 500 }}>{node.type}</div>
            <div style={{ fontWeight: 600, fontSize: 12, color: '#16191f', wordBreak: 'break-word', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{node.name}</div>
          </div>
          
          {/* Trait count badge */}
          {hasTraits && (
            <div style={{ 
              position: 'absolute', 
              top: -10, 
              right: -10, 
              background: '#D13212', 
              color: '#fff', 
              borderRadius: '50%', 
              width: 24, 
              height: 24, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: 11, 
              fontWeight: 700,
              border: '3px solid #fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {node.traitCount}
            </div>
          )}
        </div>
        
        {/* Connecting arrow */}
        {node.children && node.children.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', margin: '0 6px' }}>
              <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                <path d="M0 10H28M28 10L22 4M28 10L22 16" stroke="#879596" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {node.children[0] && renderNode(node.children[0], level + 1)}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Semi-transparent black overlay */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(0, 0, 0, 0.8)', zIndex: 999 }} onClick={onClose} />
      
      {/* Details panel */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '70%', height: '100vh', background: '#fff', boxShadow: '-4px 0 16px rgba(0,0,0,0.12)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
        {/* Sticky header with actions */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #e9ebed', background: '#fff', zIndex: 10, flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}><Box variant="h4">{finding.title}</Box></div>
          <SpaceBetween direction="horizontal" size="xs">
            <Button iconName="refresh" />
            <Button>Comment</Button>
            <Button>Create ticket</Button>
                <AssignDropdown assignee={assignee} onAssign={setAssignee} />
            <ButtonDropdown items={[
              { text: 'View JSON', id: 'json' },
              { text: 'Update severity', id: 'sev' },
              { text: 'Update status', id: 'status' },
              { text: 'Export', id: 'export' }
            ]}>Update</ButtonDropdown>
            <Button iconName="copy" />
            <Button iconName="close" variant="icon" onClick={onClose} />
          </SpaceBetween>
        </div>
      </div>
      {assignee && (
        <div style={{ padding: "8px 24px", background: "#f0f7ff", borderBottom: "1px solid #e9ebed", fontSize: 13, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ color: "#5f6b7a" }}>Assigned to:</span>
          <span style={{ width: 22, height: 22, borderRadius: "50%", background: assignee.color, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600 }}>{assignee.initials}</span>
          <span style={{ fontWeight: 600 }}>{assignee.name}</span>
          <span style={{ color: "#5f6b7a" }}>{assignee.email}</span>
        </div>
      )}

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <SpaceBetween size="l">
          <Container header={<Header variant="h2">Potential attack path</Header>}>
            <SpaceBetween size="m">
              <Box variant="p" color="text-body-secondary">
                A visualization of AWS resources associated with this finding. The graph indicates how potential attackers could access and take control of your resources.
              </Box>
              <div style={{ 
                padding: 24, 
                background: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #e9ebed 19px, #e9ebed 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #e9ebed 19px, #e9ebed 20px)',
                backgroundColor: '#fafafa',
                borderRadius: 12, 
                overflowX: 'auto', 
                border: '1px solid #e9ebed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 160
              }}>
                {finding.attackPath ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {renderNode(finding.attackPath)}
                  </div>
                ) : (
                  <Box color="text-body-secondary">No attack path data available</Box>
                )}
              </div>
              <div>
                <span style={{ fontWeight: 'bold', fontSize: 14, marginRight: 16, display: 'inline-block' }}>Legend:</span>
                <SpaceBetween direction="horizontal" size="m">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid #FF9900', borderRadius: 4, display: 'inline-block' }} />
                    <span>Primary resource</span>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid #D13212', borderRadius: 4, display: 'inline-block' }} />
                    <span>Involved resource</span>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ width: 20, height: 20, background: '#D13212', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }}>3</span>
                    <span>Contributing trait count</span>
                  </span>
                </SpaceBetween>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', fontSize: 14, marginRight: 12, display: 'inline-block' }}>Trait category:</span>
                <SpaceBetween direction="horizontal" size="xs">
                  {ALL_TRAITS.map(t => {
                    const isActive = activeTraitCategories.has(t as any);
                    return <Badge key={t} color={isActive ? 'red' : 'grey'}>{t}</Badge>;
                  })}
                </SpaceBetween>
              </div>
              <Button variant="link" iconName="external" iconAlign="right">View details</Button>
            </SpaceBetween>
          </Container>


          <Container header={<Header variant="h2" actions={<Button onClick={handleGenerateRemediation} loading={generatingRemediation} iconName="gen-ai">Generate real-time remediation steps</Button>}>Remediation</Header>}>
            <SpaceBetween size="m">
              <Box variant="h4">Recommended actions:</Box>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {finding.remediationSteps.map((step, i) => (
                  <li key={i} style={{ marginBottom: 6, lineHeight: 1.6 }}>{step}</li>
                ))}
              </ul>
              <Box variant="h4">Related documentation</Box>
              <ul style={{ margin: 0, paddingLeft: 20, listStyle: "none" }}>
                <li style={{ marginBottom: 4 }}><Link href="https://docs.aws.amazon.com/securityhub/latest/userguide/" external>AWS Security Hub User Guide</Link></li>
                <li style={{ marginBottom: 4 }}><Link href="https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html" external>IAM Security Best Practices</Link></li>
                <li style={{ marginBottom: 4 }}><Link href="https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/" external>AWS Well-Architected Security Pillar</Link></li>
              </ul>
              <Box variant="h4">Suggested people to contact</Box>
              <div style={{ fontSize: 13 }}>
                <div style={{ display: "flex", gap: 8, padding: "4px 0" }}><Box color="text-body-secondary" fontWeight="bold">Possible resource owner:</Box><Link href="#">jsmith@example.com</Link></div>
                <div style={{ display: "flex", gap: 8, padding: "4px 0" }}><Box color="text-body-secondary" fontWeight="bold">Most used by:</Box><Link href="#">devops-team@example.com</Link>, <Link href="#">platform-eng@example.com</Link></div>
                <div style={{ display: "flex", gap: 8, padding: "4px 0" }}><Box color="text-body-secondary" fontWeight="bold">Security contact:</Box><Link href="#">secops@example.com</Link></div>
              </div>
              {generatingRemediation && <StatusIndicator type="loading">Generating remediation steps...</StatusIndicator>}
              {showGeneratedSteps && (
                <SpaceBetween size="s">
                  <Box variant="h4" color="text-status-success">AI-Generated Remediation Steps</Box>
                  <ol style={{ margin: 0, paddingLeft: 20 }}>
                    <li style={{ marginBottom: 6 }}>Immediately restrict access by implementing AWS IAM authorization</li>
                    <li style={{ marginBottom: 6 }}>Run security scan to identify specific vulnerabilities</li>
                    <li style={{ marginBottom: 6 }}>Update all dependencies to latest secure versions</li>
                    <li style={{ marginBottom: 6 }}>Implement AWS WAF rules to protect endpoints</li>
                    <li style={{ marginBottom: 6 }}>Enable CloudWatch alarms for unauthorized access attempts</li>
                    <li style={{ marginBottom: 6 }}>Review and apply principle of least privilege</li>
                  </ol>
                </SpaceBetween>
              )}
            </SpaceBetween>
          </Container>
          <Container header={<Header variant="h2" counter={`(${finding.similarFindings.length})`}>Resource Details</Header>}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[...finding.similarFindings]
                .sort((a, b) => (a.resource === primaryResource ? -1 : b.resource === primaryResource ? 1 : 0))
                .map(sf => {
                  const isPrimary = sf.resource === primaryResource;
                  return (
                    <div key={sf.id} style={{ border: '1px solid #e9ebed', borderRadius: 8, padding: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Box fontWeight="bold" fontSize="body-m">{sf.resource}</Box>
                        {isPrimary && <Badge color="blue">Primary</Badge>}
                      </div>
                      <KeyValuePairs columns={2} items={[
                        { label: 'Type', value: finding.resourceType },
                        { label: 'Account', value: sf.account },
                        { label: 'Region', value: sf.region },
                        { label: 'Age', value: finding.age },
                      ]} />
                    </div>
                  );
                })}
            </div>
          </Container>
          <Container header={<Header variant="h2">Trait Details</Header>}>
            <SpaceBetween size="s">
              {finding.traits.map(trait => (
                <div key={trait.id} style={{ padding: '10px 14px', background: '#fef2f2', borderRadius: 6, borderLeft: '3px solid #D13212' }}>
                  <Box fontWeight="bold" color="text-status-error">{trait.name}</Box>
                  <Box color="text-body-secondary" fontSize="body-s">Category: {trait.category}</Box>
                </div>
              ))}
            </SpaceBetween>
          </Container>
        </SpaceBetween>
      </div>
    </div>
    </>
  );
}
