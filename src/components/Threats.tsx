import { useState } from 'react';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Container from '@cloudscape-design/components/container';
import Button from '@cloudscape-design/components/button';
import Select from '@cloudscape-design/components/select';
import { Finding, Severity } from '../types';
import FindingsList from './FindingsList';
import SeverityBadge from './SeverityBadge';
import CommentsPanel from './CommentsPanel';

interface Props {
  onSelectFinding: (f: Finding, childRes?: string) => void;
  initialSeverityFilter?: string;
}

export default function Threats({ onSelectFinding, initialSeverityFilter = 'all' }: Props) {
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | 'all'>(initialSeverityFilter as Severity | 'all');
  const [activeFilters, setActiveFilters] = useState<Array<{ id: string; label: string; value: string }>>([]);
  const [filterSearchText, setFilterSearchText] = useState('');
  const [selectedFilterSet, setSelectedFilterSet] = useState<any>(null);

  const totalThreats = 10;
  const severityCounts = {
    'Critical': 2,
    'High': 2,
    'Medium': 3,
    'Low': 3
  };

  const filterSetOptions = [
    { label: 'Critical threats - last 7 days', value: 'filter1' },
    { label: 'High severity - production', value: 'filter2' },
    { label: 'Critical threats only', value: 'filter3' }
  ];

  const handleFilterSetSelect = (option: any) => {
    setSelectedFilterSet(option);
    if (!option) {
      setActiveFilters([]);
      return;
    }
    
    // Simulate loading filters based on the selected filter set
    if (option.value === 'filter1') {
      setActiveFilters([
        { id: '1', label: 'Status', value: 'New' },
        { id: '2', label: 'Severity', value: 'Critical' }
      ]);
    } else if (option.value === 'filter2') {
      setActiveFilters([
        { id: '1', label: 'Status', value: 'In Progress' },
        { id: '2', label: 'Region', value: 'us-east-1' }
      ]);
    } else if (option.value === 'filter3') {
      setActiveFilters([
        { id: '1', label: 'Severity', value: 'Critical' }
      ]);
    }
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter(f => f.id !== filterId));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedFilterSet(null);
  };

  return (
    <SpaceBetween size="l">
      <Header variant="h1">Threats</Header>

      {/* Combined Stats and Filters Container */}
      <Container>
        <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
          {/* Severity Filter Card - 40% */}
          <div style={{ width: '40%', paddingRight: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div 
                onClick={() => setSelectedSeverity('all')}
                style={{ 
                  padding: '10px 16px',
                  cursor: 'pointer',
                  borderBottom: selectedSeverity === 'all' ? '3px solid #0972d3' : '3px solid transparent',
                  transition: 'border-color 0.2s'
                }}
              >
                <div style={{ fontSize: 11, color: '#5f6b7a', marginBottom: 3 }}>All Threats</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#16191f' }}>
                  {totalThreats}
                </div>
              </div>

              {(Object.keys(severityCounts) as Severity[]).map((severity) => (
                <div 
                  key={severity}
                  onClick={() => setSelectedSeverity(severity)}
                  style={{ 
                    padding: '10px 16px',
                    cursor: 'pointer',
                    borderBottom: selectedSeverity === severity ? '3px solid #0972d3' : '3px solid transparent',
                    transition: 'border-color 0.2s'
                  }}
                >
                  <div style={{ fontSize: 11, color: '#5f6b7a', marginBottom: 3 }}>
                    <SeverityBadge severity={severity} />
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#16191f' }}>
                    {severityCounts[severity]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Divider */}
          <div style={{ 
            width: 1, 
            backgroundColor: '#e9ebed',
            alignSelf: 'stretch'
          }} />

          {/* Filter Bar - 60% */}
          <div style={{ width: '60%', paddingLeft: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* Top row: Saved filter sets and Add filter search */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{ minWidth: 240 }}>
                  <div style={{ 
                    position: 'relative',
                    padding: '0',
                    backgroundColor: 'transparent'
                  }}>
                    <div style={{ 
                      fontSize: 11, 
                      fontWeight: 600, 
                      color: '#16191f',
                      marginBottom: 4
                    }}>
                      Saved filter sets
                    </div>
                    <Select
                      selectedOption={selectedFilterSet}
                      onChange={({ detail }) => handleFilterSetSelect(detail.selectedOption)}
                      options={filterSetOptions}
                      placeholder="Choose a filter set"
                      expandToViewport
                      triggerVariant="option"
                    />
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
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
                    placeholder="Add filter"
                    value={filterSearchText}
                    onChange={(e) => setFilterSearchText(e.target.value)}
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
              </div>

              {/* Filter tiles row - only show if filters are active */}
              {activeFilters.length > 0 && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  {activeFilters.map((filter) => (
                    <div
                      key={filter.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '4px 8px 4px 12px',
                        backgroundColor: '#e1f2ff',
                        border: '1px solid #0972d3',
                        borderRadius: 4,
                        fontSize: 13,
                        color: '#0972d3'
                      }}
                    >
                      <span>
                        <span style={{ fontWeight: 600 }}>{filter.label}</span> = {filter.value}
                      </span>
                      <button
                        onClick={() => removeFilter(filter.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 2,
                          display: 'flex',
                          alignItems: 'center',
                          color: '#0972d3'
                        }}
                        aria-label="Remove filter"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <Button variant="link" onClick={clearAllFilters}>
                    Clear filter
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>

      <FindingsList onSelectFinding={onSelectFinding} filterType="Threat" severityFilter={selectedSeverity} title="Threats" />
      <CommentsPanel screenName="Threats" />
    </SpaceBetween>
  );
}
