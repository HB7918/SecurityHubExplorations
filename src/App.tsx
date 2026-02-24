import { useState } from 'react';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import AppLayout from '@cloudscape-design/components/app-layout';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import Dashboard from './components/Dashboard';
import Threats from './components/Threats';
import FindingDetails from './components/FindingDetails';
import { Finding } from './types';
import '@cloudscape-design/global-styles/index.css';

type View = 'dashboard' | 'findings' | 'threats' | 'current-design';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [primaryResource, setPrimaryResource] = useState<string | undefined>(undefined);
  const [threatsSeverityFilter, setThreatsSeverityFilter] = useState<string>('all');

  const handleNavigateToThreats = (severityFilter: string = 'all') => {
    setThreatsSeverityFilter(severityFilter);
    setCurrentView('threats');
  };

  return (
    <>
      {currentView === 'current-design' ? (
        // Full screen image view with only back link
        <div style={{ width: '100vw', height: '100vh', background: '#f5f5f5', overflow: 'auto' }}>
          <div style={{ padding: '16px', background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setCurrentView('dashboard'); }}
              style={{ 
                color: '#0972d3', 
                textDecoration: 'none', 
                fontSize: '16px',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ← Back to Security Hub
            </a>
          </div>
          <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/images/Summary-Security-Hub-us-east-1-02-24-2026_09_41_AM.png" 
              alt="Current Security Hub Design"
              style={{ maxWidth: '100%', height: 'auto', display: 'block', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>
        </div>
      ) : (
        // Normal app layout with navigation
        <>
          <TopNavigation
            identity={{
              href: '#',
              title: 'Security Hub',
              logo: {
                src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiMyMzJGM0UiLz48cGF0aCBkPSJNMjAgMTBMMzAgMjBMMjAgMzBMMTAgMjBMMjAgMTBaIiBmaWxsPSIjRkY5OTAwIi8+PC9zdmc+',
                alt: 'AWS'
              }
            }}
            utilities={[
              { 
                type: 'button', 
                text: 'Security Hub - Current design',
                onClick: () => setCurrentView('current-design')
              },
              { type: 'button', iconName: 'notification', ariaLabel: 'Notifications' },
              { type: 'button', iconName: 'settings', ariaLabel: 'Settings' },
              {
                type: 'menu-dropdown',
                text: 'User',
                iconName: 'user-profile',
                items: [
                  { id: 'profile', text: 'Profile' },
                  { id: 'signout', text: 'Sign out' }
                ]
              }
            ]}
            i18nStrings={{ overflowMenuTriggerText: 'More', overflowMenuTitleText: 'All' }}
          />
          <AppLayout
            navigationWidth={240}
            toolsHide
            navigation={
              <SideNavigation
                header={{ text: 'Security Hub', href: '#/' }}
                activeHref={
                  currentView === 'dashboard' ? '#/summary' : 
                  currentView === 'threats' ? '#/threats' : 
                  '#/findings'
                }
                onFollow={(e) => {
                  e.preventDefault();
                  const href = e.detail.href;
                  if (href === '#/summary') setCurrentView('dashboard');
                  else if (href === '#/threats') setCurrentView('threats');
                  else if (href === '#/findings') setCurrentView('findings');
                }}
                items={[
                  {
                    type: 'section', text: 'Dashboard', items: [
                      { type: 'link', text: 'Security Hub', href: '#/summary' },
                      { type: 'link', text: 'Threats', href: '#/threats' },
                      { type: 'link', text: 'Exposure', href: '#/exposure' },
                      { type: 'link', text: 'Vulnerabilities', href: '#/vulnerabilities' },
                      { type: 'link', text: 'Posture management', href: '#/posture' },
                      { type: 'link', text: 'Sensitive data', href: '#/sensitive-data' },
                    ]
                  },
                  {
                    type: 'section', text: 'Inventory', items: [
                      { type: 'link', text: 'All findings', href: '#/findings' },
                      { type: 'link', text: 'Resources', href: '#/resources' },
                    ]
                  },
                  { type: 'divider' },
                  {
                    type: 'section', text: 'Settings', defaultExpanded: true, items: [
                      { type: 'link', text: 'General', href: '#/settings-general' },
                      { type: 'link', text: 'Account coverage', href: '#/account-coverage' },
                    ]
                  },
                  { type: 'divider' },
                  {
                    type: 'section', text: 'Detection engines', defaultExpanded: true, items: [
                      { type: 'link', text: 'GuardDuty', href: '#/guardduty', external: true },
                      { type: 'link', text: 'Inspector', href: '#/inspector', external: true },
                      { type: 'link', text: 'Security Hub CSPM', href: '#/cspm', external: true },
                      { type: 'link', text: 'Macie', href: '#/macie', external: true },
                    ]
                  },
                ]}
              />
            }
            content={
              <>
                {currentView === 'dashboard' && (
                  <Dashboard 
                    onSelectFinding={(f, childRes) => { setSelectedFinding(f); setPrimaryResource(childRes); }} 
                    onNavigateToThreats={handleNavigateToThreats}
                  />
                )}
                {currentView === 'threats' && (
                  <Threats 
                    onSelectFinding={(f, childRes) => { setSelectedFinding(f); setPrimaryResource(childRes); }}
                    initialSeverityFilter={threatsSeverityFilter}
                  />
                )}
                {selectedFinding && (
                  <FindingDetails finding={selectedFinding} primaryResource={primaryResource} onClose={() => setSelectedFinding(null)} />
                )}
              </>
            }
          />
        </>
      )}
    </>
  );
}

export default App;
