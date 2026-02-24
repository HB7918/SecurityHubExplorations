import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

export default function CurrentSecurityHub() {
  return (
    <SpaceBetween size="l">
      <Header variant="h1">Current Security Hub Design</Header>
      <Container>
        <div style={{ width: '100%', overflow: 'auto' }}>
          <img 
            src="/Images/Summary-Security-Hub-us-east-1-02-24-2026_09_41_AM.svg" 
            alt="Current Security Hub Design"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </Container>
    </SpaceBetween>
  );
}
