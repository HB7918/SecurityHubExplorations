import { useState } from 'react';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import Button from '@cloudscape-design/components/button';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import TextFilter from '@cloudscape-design/components/text-filter';
import Select from '@cloudscape-design/components/select';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import Icon from '@cloudscape-design/components/icon';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import { Finding } from '../types';
import { mockFindings } from '../data/mockData';
import SeverityBadge from './SeverityBadge';
import TraitBadges from './TraitBadges';
import SeverityWithRisk from './SeverityWithRisk';
import "./FindingsList.css";
interface FindingsListProps {
  onSelectFinding: (finding: Finding, childResource?: string) => void;
  filterType?: 'Threat' | 'Exposure';
  statusFilter?: string | 'all';
  severityFilter?: string | 'all';
  title?: string;
}
const ThreatIcon = () => (
  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4.99829 8.255C4.99829 6.605 6.34829 5.255 7.99829 5.255C9.64829 5.255 10.9983 6.605 10.9983 8.255C10.9983 9.905 9.64829 11.255 7.99829 11.255C6.34829 11.255 4.99829 9.905 4.99829 8.255ZM6.99829 8.255C6.99829 8.80501 7.44829 9.255 7.99829 9.255C8.54829 9.255 8.99829 8.80501 8.99829 8.255C8.99829 7.705 8.54829 7.255 7.99829 7.255C7.44829 7.255 6.99829 7.705 6.99829 8.255Z" fill="#424650"/><path fillRule="evenodd" clipRule="evenodd" d="M14.2634 8.36L15.0034 8.99L14.9734 9C15.6834 9.59 15.8634 10.59 15.3934 11.39L14.3934 13.13C13.9434 13.93 12.9734 14.27 12.1134 13.95L11.1734 13.6C11.0734 13.69 11.0234 13.72 10.9634 13.75L10.8234 14.7C10.6734 15.6 9.90339 16.26 8.98339 16.26H6.96339C6.05339 16.26 5.27339 15.6 5.12339 14.69L4.95338 13.7C4.89338 13.7 4.81339 13.65 4.71339 13.58L3.83339 13.94C2.97339 14.26 2.01338 13.91 1.56339 13.11L0.563385 11.37C0.103385 10.57 0.283385 9.57 0.993385 8.99L1.77338 8.35L1.73338 8.15L0.993385 7.52C0.283385 6.93 0.103383 5.93 0.573383 5.13L1.57338 3.39C2.02338 2.6 2.98339 2.25 3.85339 2.57L4.80339 2.92C4.90339 2.83 4.96338 2.79 5.02338 2.76L5.12339 1.83V1.81C5.28339 0.91 6.05338 0.25 6.97338 0.25H8.99339C9.91339 0.25 10.6934 0.9 10.8434 1.81L11.0134 2.81C11.0704 2.81 11.1454 2.85508 11.2384 2.91099L11.2534 2.92L12.1434 2.57C12.9834 2.26 13.9434 2.59 14.4134 3.38L15.4334 5.14C15.8934 5.94 15.7134 6.94 15.0034 7.52L14.2234 8.16L14.2634 8.36ZM13.6434 10.47L12.9534 9.9L12.9434 9.89C12.4934 9.5 12.2434 8.95 12.2434 8.35V8.15C12.2234 7.56 12.4734 6.99 12.9334 6.61L13.6334 6.04L12.7334 4.48L11.8734 4.8C11.3134 5 10.6934 4.93 10.1734 4.62C10.1634 4.61 10.0434 4.53 10.0234 4.53C9.50338 4.22 9.14338 3.72 9.04338 3.15L8.89338 2.25H7.09338L6.96339 3.13C6.86339 3.74 6.49338 4.25 5.95338 4.54C5.94338 4.54 5.75338 4.65 5.75338 4.65C5.31338 4.93 4.69339 5 4.13338 4.8L3.26339 4.48L2.36338 6.04L3.05339 6.61C3.50339 6.99 3.75338 7.55 3.75338 8.15V8.35C3.77338 8.93 3.52339 9.51 3.06339 9.89L2.36338 10.46L3.26339 12.02L4.11338 11.71C4.67338 11.51 5.29339 11.58 5.81339 11.89C5.81951 11.8931 5.83501 11.9027 5.85415 11.9146C5.8975 11.9415 5.95951 11.98 5.97338 11.98C6.49338 12.29 6.85338 12.79 6.95338 13.36L7.10339 14.26H8.90339L9.05338 13.36C9.15339 12.78 9.53339 12.26 10.0634 11.97C10.1434 11.92 10.1934 11.89 10.2534 11.86C10.7034 11.58 11.3234 11.51 11.8834 11.71L12.7434 12.03L13.6434 10.47Z" fill="#424650"/></svg>
);
const ExposureIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.01001 9.01706L7 4.00705L9 4.00305L9.01001 9.01306L7.01001 9.01706Z" fill="#0F141A"/><path d="M9 12.005H7V10.005H9V12.005Z" fill="#0F141A"/><path fillRule="evenodd" clipRule="evenodd" d="M8 16.005L7.995 16.005C8.10333 16.0044 8.21167 15.9844 8.32 15.945C10.41 15.215 12.01 14.125 13.08 12.705C14.29 11.085 14.99 8.995 14.99 6.965V3.485C14.99 2.955 14.59 2.525 14.07 2.485C12.02 2.335 10.1 1.545 8.66 0.255C8.28 -0.085 7.71 -0.085 7.33 0.255C5.89 1.535 3.97 2.335 1.92 2.485C1.4 2.525 1 2.965 1 3.485V6.965C1 8.995 1.69 11.095 2.91 12.705C3.98 14.125 5.58 15.215 7.67 15.945C7.77833 15.9844 7.88667 16.0044 7.995 16.005L7.99 16.005H8ZM3 4.375V6.965C3 8.575 3.55 10.225 4.51 11.505C5.28 12.535 6.46 13.345 8 13.945C9.54 13.355 10.72 12.535 11.49 11.505C12.45 10.235 13 8.575 13 6.965V4.375C11.16 4.085 9.43 3.365 8 2.295C6.57 3.375 4.84 4.095 3 4.375Z" fill="#0F141A"/></svg>
);
const severityRank: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
type SortField = 'title' | 'type' | 'severity' | 'count' | 'impact';
export default function FindingsList({ onSelectFinding, filterType, statusFilter: externalStatusFilter, severityFilter: externalSeverityFilter, title }: FindingsListProps) {
  const [selectedTab, setSelectedTab] = useState('all');
  const [filterText, setFilterText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [severityFilter, setSeverityFilter] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<any>(null);
  const [sortField, setSortField] = useState<SortField | null>('impact');
  const [sortDesc, setSortDesc] = useState(true);
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  const toggleExpanded = (id: string) => {
    const next = new Set(expandedItems);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedItems(next);
  };
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(false);
    }
  };
  const filteredByTab = mockFindings.filter(f => {
    // Apply type filter
    if (filterType && f.type !== filterType) return false;
    if (!filterType) {
      if (selectedTab === 'exposures' && f.type !== 'Exposure') return false;
      if (selectedTab === 'threats' && f.type !== 'Threat') return false;
    }
    
    // Apply external status filter (from Threats page)
    if (externalStatusFilter && externalStatusFilter !== 'all' && f.status !== externalStatusFilter) return false;
    
    // Apply external severity filter (from Threats page)
    if (externalSeverityFilter && externalSeverityFilter !== 'all' && f.severity !== externalSeverityFilter) return false;
    
    return true;
  });
  const sortedFindings = [...filteredByTab].sort((a, b) => {
    // Always sort by severity first (Critical > High > Medium > Low)
    const sevCmp = severityRank[a.severity] - severityRank[b.severity];
    if (sevCmp !== 0) return sevCmp;
    // Tiebreak by impact descending
    if (a.impact !== b.impact) return b.impact - a.impact;
    // Further tiebreak by user-selected column
    if (!sortField) return 0;
    let cmp = 0;
    if (sortField === 'title') cmp = a.title.localeCompare(b.title);
    else if (sortField === 'type') cmp = a.type.localeCompare(b.type);
    else if (sortField === 'count') cmp = a.count - b.count;
    return sortDesc ? -cmp : cmp;
  });
  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <span
      style={{ cursor: 'pointer', userSelect: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
      onClick={(e) => { e.stopPropagation(); handleSort(field); }}
    >
      {label}
      {sortField === field && (
        <Icon name={sortDesc ? 'caret-down-filled' : 'caret-up-filled'} size="small" />
      )}
      {sortField !== field && <Icon name="caret-down-filled" size="small" variant="disabled" />}
    </span>
  );
  return (
    <Container header={<div style={{ fontSize: 16, fontWeight: 700 }}>{title || 'Priority hub'} <span style={{ fontWeight: 400, color: "#5f6b7a" }}>({sortedFindings.length})</span></div>}>
      <SpaceBetween size="m">
        {!filterType && (
          <>
            <SpaceBetween direction="horizontal" size="xs">
              <div onClick={() => setShowFilters(!showFilters)} role="button" tabIndex={0} aria-label="Toggle filters" style={{ width: 32, height: 32, minWidth: 32, maxWidth: 32, minHeight: 32, maxHeight: 32, borderRadius: "50%", border: "2px solid #0972d3", background: showFilters ? "#0972d3" : "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxSizing: "border-box" }}><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 2h14l-5 6v5l-4 2V8L1 2z" stroke={showFilters ? "#fff" : "#0972d3"} strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round" /></svg></div>
              <SegmentedControl
                selectedId={selectedTab}
                onChange={({ detail }) => setSelectedTab(detail.selectedId)}
                options={[
                  { text: 'All', id: 'all' },
                  { text: 'Exposures', id: 'exposures' },
                  { text: 'Threats', id: 'threats' },
                ]}
              />
              <div style={{ flex: 1, minWidth: 600 }}>
                <TextFilter filteringText={filterText} filteringPlaceholder="Search by keywords" onChange={({ detail }) => setFilterText(detail.filteringText)} />
              </div>
              <span className="saved-filters-btn"><ButtonDropdown variant="icon" expandToViewport items={[{ id: "saved", text: "Saved filters", items: [{ text: "Critical exposures - last 7 days", id: "f1" }, { text: "High severity threats - production", id: "f2" }, { text: "Unresolved findings - us-east-1", id: "f3" }, { text: "All open exposures by account", id: "f4" }, { text: "PII-related findings", id: "f5" }] }]} ariaLabel="Saved filters" /></span>
            </SpaceBetween>
            {showFilters && (
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                {["All externally exposed resources", "All public S3 buckets"].map(label => (<span key={label} onClick={() => setQuickFilter(quickFilter === label ? null : label)} style={{ padding: "4px 12px", borderRadius: 16, fontSize: 13, cursor: "pointer", border: quickFilter === label ? "2px solid #0972d3" : "1px solid #aab7b8", background: quickFilter === label ? "#f0f7ff" : "#fff", color: quickFilter === label ? "#0972d3" : "#16191f", fontWeight: quickFilter === label ? 600 : 400, userSelect: "none" }}>{label}</span>))}<span style={{ borderLeft: "1px solid #d5dbdb", height: 20, display: "inline-block", margin: "0 4px" }} /><Box fontWeight="bold" fontSize="body-s">Filter by:</Box>
                <Select selectedOption={severityFilter} onChange={({ detail }) => setSeverityFilter(detail.selectedOption)} placeholder="Select severity"
                  options={[{ label: 'Critical', value: 'critical' }, { label: 'High', value: 'high' }, { label: 'Medium', value: 'medium' }, { label: 'Low', value: 'low' }]} />
                <Select selectedOption={statusFilter} onChange={({ detail }) => setStatusFilter(detail.selectedOption)} placeholder="Select status"
                  options={[{ label: 'New', value: 'new' }, { label: 'In Progress', value: 'in-progress' }, { label: 'Resolved', value: 'resolved' }]} />
                <Button>+ Add filter</Button>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="clear-selections-btn"><Button variant="link">Clear selections</Button></span><span style={{ borderLeft: "1px solid #d5dbdb", height: 20, display: "inline-block" }} /><Button>Save filter</Button></div></div>
            )}
          </>
        )}
        {/* Column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 200px 1fr 100px 90px',
          gap: 8,
          padding: '8px 0',
          borderBottom: '2px solid #d5dbdb',
          fontSize: 14,
          fontWeight: 700,
          color: '#414d5c',
        }}>
          <div />
          <div><SortHeader field="severity" label="Severity" /></div>
          <div><SortHeader field="title" label="Finding" /></div>
          <div><SortHeader field="type" label="Type" /></div>
          <div><SortHeader field="count" label="Count" /></div>
        </div>
        {/* Rows */}
        {sortedFindings.map((finding) => {
          const isExpanded = expandedItems.has(finding.id);
          return (
            <div key={finding.id} style={{ borderBottom: '1px solid #e9ebed' }}>
              {/* Parent row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 200px 1fr 100px 90px',
                  gap: 8,
                  padding: '6px 0',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => toggleExpanded(finding.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Icon name={isExpanded ? 'caret-down-filled' : 'caret-right-filled'} />
                </div>
                <div onClick={(e) => e.stopPropagation()}><SeverityWithRisk severity={finding.severity} impact={finding.impact} /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: 'inline-flex', flexShrink: 0 }}>
                    {finding.type === 'Threat' ? <ThreatIcon /> : <ExposureIcon />}
                  </span>
                  <Box variant="span" color="text-status-info">{finding.title}</Box>
                </div>
                <div>{finding.type}</div>
                <div style={{ color: '#5f6b7a', fontSize: 13 }}>{finding.count} count</div>
              </div>
              {/* Expanded child content — inside the same row container */}
              {isExpanded && (
                <div style={{ padding: '4px 0 16px 60px', background: '#fafafa', borderRadius: 4, margin: '0 0 0 40px' }}>
                  <SpaceBetween size="m">
                    <Table
                      variant="embedded"
                      columnDefinitions={[
                        { id: 'severity', header: 'Severity', cell: () => <SeverityBadge severity={finding.severity} />, width: 100 },
                        { id: 'resource', header: 'Resource', cell: (item: any) => (<div><div style={{ fontSize: 11, color: '#5f6b7a' }}>{finding.resourceType}</div><div style={{ color: '#0972d3', fontSize: 13 }}>{item.resource}</div></div>), width: 180 },
                        { id: 'age', header: 'Age', cell: () => finding.age, width: 80 },
                        { id: 'status', header: 'Status', cell: () => <Badge color="blue">{finding.status}</Badge>, width: 100 },
                          { id: "traits", header: "Traits", cell: () => <TraitBadges activeTraits={finding.traits} />, width: 170 },
                        { id: 'account', header: 'Account', cell: (item: any) => item.account, width: 140 },
                        { id: 'region', header: 'Region', cell: (item: any) => item.region, width: 120 },
                        { id: 'actions', header: 'Actions', width: 200, cell: (item: any) => (
                          <SpaceBetween direction="horizontal" size="xs">
                            <Link onFollow={() => onSelectFinding(finding, item.resource)}>See remediation</Link>
                            <ButtonDropdown variant="icon" expandToViewport items={[
                              { text: 'Create ticket', id: 'ticket' },
                              { text: 'Add comment', id: 'comment' },
                              { text: 'Copy link', id: 'copy' },
                              { text: 'Update severity', id: 'severity' },
                              { text: 'Update status', id: 'status' },
                              { text: 'Export', id: 'export' },
                            ]} />
                          </SpaceBetween>
                        )},
                      ]}
                      items={finding.similarFindings}
                      header={<div style={{ fontSize: 13 }}><Header variant="h3" counter={`(${finding.similarFindings.length})`}>Correlated findings</Header></div>}
                    />
                  </SpaceBetween>
                </div>
              )}
            </div>
          );
        })}
      </SpaceBetween>
    </Container>
  );
}
