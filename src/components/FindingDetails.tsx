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
import Icon from '@cloudscape-design/components/icon';
import { Finding } from '../types';
import SeverityBadge from './SeverityBadge';
import { traitPaths } from './TraitBadges';
import CommentsPanel from './CommentsPanel';

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
    const displayName = isPrimary && primaryResource ? primaryResource : node.name;
    const borderColor = isPrimary ? '#FF9900' : '#D13212';
    const bgColor = '#fff';
    const hasTraits = node.traitCount && node.traitCount > 0;
    
    const getServiceIcon = (type: string) => {
      const iconMap: Record<string, { bg: string; text: string }> = {
        'Lambda Function': { bg: '#FF9900', text: 'λ' },
        'IAM Role': { bg: '#DD344C', text: 'IAM' },
        'IAM Policy': { bg: '#DD344C', text: 'IAM' },
        'Action': { bg: '#DD344C', text: 'A' },
        'API Gateway': { bg: '#FF4F8B', text: 'API' },
        'Endpoint': { bg: '#FF4F8B', text: 'EP' },
        'S3 Bucket': { bg: '#3F8624', text: 'S3' },
        'Security Group': { bg: '#DD344C', text: 'SG' },
        'RDS Instance': { bg: '#3B48CC', text: 'RDS' },
        'ECS Task': { bg: '#FF9900', text: 'ECS' },
        'CloudFront': { bg: '#8C4FFF', text: 'CF' },
        'IAM User': { bg: '#DD344C', text: 'IAM' },
        'EC2 Instance': { bg: '#FF9900', text: 'EC2' },
        'OpenSearch Domain': { bg: '#FF4F8B', text: 'OS' },
        'SNS Topic': { bg: '#DD344C', text: 'SNS' },
        'EBS Volume': { bg: '#3B48CC', text: 'EBS' },
        'SQS Queue': { bg: '#FF4F8B', text: 'SQS' },
      };
      return iconMap[type] || { bg: '#0972D3', text: '?' };
    };
    
    const icon = getServiceIcon(node.type);
    
    return (
      <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <div style={{ 
          padding: '8px 10px', 
          border: `2px solid ${borderColor}`, 
          borderRadius: 8, 
          background: bgColor,
          minWidth: 120,
          maxWidth: 160,
          position: 'relative',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 5,
            background: icon.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0
          }}>{icon.text}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9, color: '#5f6b7a', marginBottom: 1, fontWeight: 500 }}>{node.type}</div>
            <div style={{ fontWeight: 600, fontSize: 10, color: '#16191f', wordBreak: 'break-word', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{displayName}</div>
          </div>
          {hasTraits && (
            <div style={{ 
              position: 'absolute', top: -8, right: -8, 
              background: '#D13212', color: '#fff', borderRadius: '50%', 
              width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: 10, fontWeight: 700, border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}>{node.traitCount}</div>
          )}
        </div>
        {node.children && node.children.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', margin: '0 4px' }}>
              <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                <path d="M0 8H20M20 8L15 3M20 8L15 13" stroke="#879596" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}><Box variant="h4">{finding.title}</Box></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '0 8px', borderRadius: 4, background: '#414D5C', color: '#fff', height: 22, fontSize: 12, fontWeight: 400, fontFamily: "'Amazon Ember', 'Helvetica Neue', Roboto, Arial, sans-serif", letterSpacing: '0.005em' }}>
                {finding.type === 'Threat' ? (
                  <svg width="12" height="13" viewBox="0 0 16 17" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M4.99829 8.255C4.99829 6.605 6.34829 5.255 7.99829 5.255C9.64829 5.255 10.9983 6.605 10.9983 8.255C10.9983 9.905 9.64829 11.255 7.99829 11.255C6.34829 11.255 4.99829 9.905 4.99829 8.255ZM6.99829 8.255C6.99829 8.805 7.44829 9.255 7.99829 9.255C8.54829 9.255 8.99829 8.805 8.99829 8.255C8.99829 7.705 8.54829 7.255 7.99829 7.255C7.44829 7.255 6.99829 7.705 6.99829 8.255Z" fill="#fff"/><path fillRule="evenodd" clipRule="evenodd" d="M14.2634 8.36L15.0034 8.99L14.9734 9C15.6834 9.59 15.8634 10.59 15.3934 11.39L14.3934 13.13C13.9434 13.93 12.9734 14.27 12.1134 13.95L11.1734 13.6C11.0734 13.69 11.0234 13.72 10.9634 13.75L10.8234 14.7C10.6734 15.6 9.90339 16.26 8.98339 16.26H6.96339C6.05339 16.26 5.27339 15.6 5.12339 14.69L4.95338 13.7C4.89338 13.7 4.81339 13.65 4.71339 13.58L3.83339 13.94C2.97339 14.26 2.01338 13.91 1.56339 13.11L0.563385 11.37C0.103385 10.57 0.283385 9.57 0.993385 8.99L1.77338 8.35L1.73338 8.15L0.993385 7.52C0.283385 6.93 0.103383 5.93 0.573383 5.13L1.57338 3.39C2.02338 2.6 2.98339 2.25 3.85339 2.57L4.80339 2.92C4.90339 2.83 4.96338 2.79 5.02338 2.76L5.12339 1.83V1.81C5.28339 0.91 6.05338 0.25 6.97338 0.25H8.99339C9.91339 0.25 10.6934 0.9 10.8434 1.81L11.0134 2.81C11.0704 2.81 11.1454 2.855 11.2384 2.911L11.2534 2.92L12.1434 2.57C12.9834 2.26 13.9434 2.59 14.4134 3.38L15.4334 5.14C15.8934 5.94 15.7134 6.94 15.0034 7.52L14.2234 8.16L14.2634 8.36ZM13.6434 10.47L12.9534 9.9L12.9434 9.89C12.4934 9.5 12.2434 8.95 12.2434 8.35V8.15C12.2234 7.56 12.4734 6.99 12.9334 6.61L13.6334 6.04L12.7334 4.48L11.8734 4.8C11.3134 5 10.6934 4.93 10.1734 4.62C10.1634 4.61 10.0434 4.53 10.0234 4.53C9.50338 4.22 9.14338 3.72 9.04338 3.15L8.89338 2.25H7.09338L6.96339 3.13C6.86339 3.74 6.49338 4.25 5.95338 4.54C5.94338 4.54 5.75338 4.65 5.75338 4.65C5.31338 4.93 4.69339 5 4.13338 4.8L3.26339 4.48L2.36338 6.04L3.05339 6.61C3.50339 6.99 3.75338 7.55 3.75338 8.15V8.35C3.77338 8.93 3.52339 9.51 3.06339 9.89L2.36338 10.46L3.26339 12.02L4.11338 11.71C4.67338 11.51 5.29339 11.58 5.81339 11.89C5.81951 11.893 5.83501 11.903 5.85415 11.915C5.8975 11.942 5.95951 11.98 5.97338 11.98C6.49338 12.29 6.85338 12.79 6.95338 13.36L7.10339 14.26H8.90339L9.05338 13.36C9.15339 12.78 9.53339 12.26 10.0634 11.97C10.1434 11.92 10.1934 11.89 10.2534 11.86C10.7034 11.58 11.3234 11.51 11.8834 11.71L12.7434 12.03L13.6434 10.47Z" fill="#fff"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M7.01 9.017L7 4.007l2-.004.01 5.01-2 .004Z" fill="#fff"/><path d="M9 12.005H7v-2h2v2Z" fill="#fff"/><path fillRule="evenodd" clipRule="evenodd" d="M8 16.005l-.005 0c.108-.001.217-.02.325-.06 2.09-.73 3.69-1.82 4.76-3.24C14.29 11.085 14.99 8.995 14.99 6.965V3.485c0-.53-.4-.96-.92-1-2.05-.15-3.97-.94-5.41-2.23-.38-.34-.95-.34-1.33 0C5.89 1.535 3.97 2.335 1.92 2.485c-.52.04-.92.48-.92 1v3.48c0 2.03.69 4.13 1.91 5.74 1.07 1.42 2.67 2.51 4.76 3.24.108.04.217.06.325.06L8 16.005ZM3 4.375v2.59c0 1.61.55 3.26 1.51 4.54.77 1.03 1.95 1.84 3.49 2.44 1.54-.59 2.72-1.41 3.49-2.44C12.45 10.235 13 8.575 13 6.965V4.375c-1.84-.29-3.57-1.01-5-2.08-1.43 1.08-3.16 1.8-5 2.08Z" fill="#fff"/></svg>
                )}
                {finding.type}
              </span>
              <Badge color={finding.severity === 'Critical' || finding.severity === 'High' ? 'red' : 'grey'}>{finding.severity}</Badge>
              <Badge color="blue">{finding.status}</Badge>
              <Box fontSize="body-s" color="text-body-secondary">First detected {finding.age} ago. Last updated 6 hours ago.</Box>
            </div>
          </div>
          <SpaceBetween direction="horizontal" size="xs">
            <Button iconName="contact">Comment</Button>
            <Button iconName="ticket">Create ticket</Button>
            <AssignDropdown assignee={assignee} onAssign={setAssignee} />
            <ButtonDropdown variant="normal" mainAction={{ text: 'View JSON', onClick: () => {} }} items={[{ text: 'Copy JSON', id: 'copy-json' }]} onItemClick={() => {}} />
            <ButtonDropdown expandToViewport expandableGroups items={[
              { id: 'sev', text: 'Update severity', items: [
                { text: 'Fatal', id: 'sev-fatal' }, { text: 'Critical', id: 'sev-critical' },
                { text: 'High', id: 'sev-high' }, { text: 'Medium', id: 'sev-medium' },
                { text: 'Low', id: 'sev-low' }, { text: 'Informational', id: 'sev-info' },
                { text: 'Unknown', id: 'sev-unknown' }, { text: 'Other', id: 'sev-other' },
              ]},
              { id: 'status', text: 'Update status', items: [
                { text: 'Archived', id: 'st-archived' }, { text: 'Resolved', id: 'st-resolved' },
                { text: 'Suppressed', id: 'st-suppressed' }, { text: 'In Progress', id: 'st-inprogress' },
                { text: 'New', id: 'st-new' }, { text: 'Unknown', id: 'st-unknown' },
                { text: 'Other', id: 'st-other' },
              ]},
              { id: 'export', text: 'Export finding', items: [
                { text: 'JSON', id: 'export-json' },
              ]},
              { text: 'Copy finding URL', id: 'copy-url', iconName: 'copy' },
              { text: 'Copy finding ID', id: 'copy-id', iconName: 'copy' },
            ]} onItemClick={() => {}}>Actions</ButtonDropdown>
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
          <Container header={<Header variant="h2">{finding.type === 'Threat' ? 'Investigations path' : 'Potential attack path'}</Header>}>
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
                minHeight: 160
              }}>
                {finding.attackPath ? (
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
                    {/* Internet endpoint node */}
                    <div style={{
                      padding: '8px 10px',
                      border: '2px solid #545B64',
                      borderRadius: 8,
                      background: '#fff',
                      minWidth: 120,
                      maxWidth: 160,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      flexShrink: 0,
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 5,
                        background: '#545B64',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/>
                          <ellipse cx="12" cy="12" rx="4" ry="10" stroke="#fff" strokeWidth="1.5"/>
                          <line x1="2" y1="12" x2="22" y2="12" stroke="#fff" strokeWidth="1.5"/>
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 9, color: '#5f6b7a', marginBottom: 1, fontWeight: 500 }}>Internet</div>
                        <div style={{ fontWeight: 600, fontSize: 9, color: '#0972d3', wordBreak: 'break-all', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{finding.attackPath.endpoint || 'public endpoint'}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '0 4px', flexShrink: 0 }}>
                      <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                        <path d="M0 8H20M20 8L15 3M20 8L15 13" stroke="#879596" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {renderNode(finding.attackPath)}
                  </div>
                ) : (
                  <Box color="text-body-secondary">No attack path data available</Box>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                {/* Left: Trait categories + View details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    <Box fontSize="body-s" fontWeight="bold" color="text-body-secondary">Traits:</Box>
                    {ALL_TRAITS.map(t => {
                      const isActive = activeTraitCategories.has(t as any);
                      return (
                        <div key={t} title={t} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500,
                          background: isActive ? '#414D5C' : '#d5dbdb',
                          color: isActive ? '#fff' : '#687078',
                        }}>
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <path d={traitPaths[t] || ''} fill={isActive ? '#FBFBFB' : '#687078'} fillRule="evenodd" clipRule="evenodd" />
                          </svg>
                          <span>{t}</span>
                        </div>
                      );
                    })}
                  </div>
                  <Button variant="link" iconName="external" iconAlign="right">View details</Button>
                </div>
                {/* Right: Legend */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <Box fontSize="body-s" fontWeight="bold" color="text-body-secondary">Legend:</Box>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                    <span style={{ width: 10, height: 10, border: '2px solid #545B64', borderRadius: 2, display: 'inline-block' }} /> Internet
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                    <span style={{ width: 10, height: 10, border: '2px solid #FF9900', borderRadius: 2, display: 'inline-block' }} /> Primary
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                    <span style={{ width: 10, height: 10, border: '2px solid #D13212', borderRadius: 2, display: 'inline-block' }} /> Involved
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                    <span style={{ width: 14, height: 14, background: '#D13212', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 8, fontWeight: 700 }}>3</span> Trait count
                  </span>
                </div>
              </div>
            </SpaceBetween>
          </Container>


          <Container>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 0 }}>
              {/* Left: Remediation */}
              <div style={{ overflowY: 'auto', maxHeight: 500, paddingRight: 16 }}>
                <SpaceBetween size="m">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box variant="h3">Remediation</Box>
                    <Button onClick={handleGenerateRemediation} loading={generatingRemediation} iconName="gen-ai" variant="normal">Generate steps</Button>
                  </div>
                  {generatingRemediation && <StatusIndicator type="loading">Generating remediation steps...</StatusIndicator>}
                  {showGeneratedSteps && (
                    <SpaceBetween size="s">
                      <Box variant="h4" color="text-status-success">AI-Generated Remediation Steps</Box>
                      <ol style={{ margin: 0, paddingLeft: 20 }}>
                        <li style={{ marginBottom: 6, fontSize: 13 }}>Immediately restrict access by implementing AWS IAM authorization</li>
                        <li style={{ marginBottom: 6, fontSize: 13 }}>Run security scan to identify specific vulnerabilities</li>
                        <li style={{ marginBottom: 6, fontSize: 13 }}>Update all dependencies to latest secure versions</li>
                        <li style={{ marginBottom: 6, fontSize: 13 }}>Implement AWS WAF rules to protect endpoints</li>
                        <li style={{ marginBottom: 6, fontSize: 13 }}>Enable CloudWatch alarms for unauthorized access attempts</li>
                        <li style={{ marginBottom: 6, fontSize: 13 }}>Review and apply principle of least privilege</li>
                      </ol>
                    </SpaceBetween>
                  )}
                  <Box variant="h4">Recommended actions:</Box>
                  <ul style={{ margin: 0, paddingLeft: 20, listStyle: 'none' }}>
                    {finding.remediationSteps.map((step, i) => {
                      const contacts = [
                        { label: 'Owner', link: 'jsmith@example.com' },
                        { label: 'Team', link: 'devops-team@example.com' },
                        { label: 'Security', link: 'secops@example.com' },
                        { label: 'Platform', link: 'platform-eng@example.com' },
                        { label: 'Infra', link: 'infra-team@example.com' },
                      ];
                      const contact = contacts[i % contacts.length];
                      return (
                        <li key={i} style={{ marginBottom: 10, fontSize: 13, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                          <div style={{ lineHeight: 1.6 }}>{step}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3, fontSize: 12 }}>
                            <Box color="text-body-secondary" fontSize="body-s">{contact.label}:</Box>
                            <Link href="#" fontSize="body-s">{contact.link}</Link>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <Box variant="h4">Related documentation</Box>
                  <ul style={{ margin: 0, paddingLeft: 20, listStyle: "none" }}>
                    <li style={{ marginBottom: 4 }}><Link href="https://docs.aws.amazon.com/securityhub/latest/userguide/" external>AWS Security Hub User Guide</Link></li>
                    <li style={{ marginBottom: 4 }}><Link href="https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html" external>IAM Security Best Practices</Link></li>
                    <li style={{ marginBottom: 4 }}><Link href="https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/" external>AWS Well-Architected Security Pillar</Link></li>
                  </ul>
                </SpaceBetween>
              </div>
              {/* Vertical divider */}
              <div style={{ background: '#e9ebed' }} />
              {/* Right: Resource cards */}
              <div style={{ overflowY: 'auto', maxHeight: 500, paddingLeft: 16 }}>
                <SpaceBetween size="s">
                  <Box variant="h3">Resources <span style={{ fontWeight: 400, color: '#5f6b7a' }}>({finding.similarFindings.length})</span></Box>
                  {[...finding.similarFindings]
                    .sort((a, b) => (a.resource === primaryResource ? -1 : b.resource === primaryResource ? 1 : 0))
                    .map((sf, idx) => {
                      const isPrimary = sf.resource === primaryResource;
                      const isActive = idx % 3 !== 2;
                      const lastUsed = idx === 0 ? '2 hours ago' : idx === 1 ? '1 day ago' : idx === 2 ? '5 days ago' : idx === 3 ? '12 hours ago' : '3 days ago';
                      return (
                        <div key={sf.id} style={{ border: '1px solid #e9ebed', borderRadius: 6, padding: '8px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <Box fontWeight="bold" fontSize="body-s">{sf.resource}</Box>
                            {isPrimary && <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600, background: '#FF9900', color: '#fff', lineHeight: '18px' }}>Primary</span>}
                            <Badge color={isActive ? 'green' : 'grey'}>{isActive ? 'Active' : 'Inactive'}</Badge>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 12px', fontSize: 12 }}>
                            <div><span style={{ color: '#5f6b7a' }}>Type: </span>{finding.resourceType}</div>
                            <div><span style={{ color: '#5f6b7a' }}>Account: </span>{sf.account}</div>
                            <div><span style={{ color: '#5f6b7a' }}>Region: </span>{sf.region}</div>
                            <div><span style={{ color: '#5f6b7a' }}>Last used: </span>{lastUsed}</div>
                          </div>
                        </div>
                      );
                    })}
                </SpaceBetween>
              </div>
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
