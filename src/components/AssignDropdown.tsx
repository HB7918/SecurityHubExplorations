import { useState, useRef, useEffect } from 'react';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';
import Input from '@cloudscape-design/components/input';
import Icon from '@cloudscape-design/components/icon';

interface User {
  initials: string;
  name: string;
  email: string;
  color: string;
}

const USERS: User[] = [
  { initials: 'AJ', name: 'Anderson, James', email: 'janderson@example.com', color: '#f5d0a9' },
  { initials: 'BL', name: 'Brooks, Lisa', email: 'lbrooks@example.com', color: '#d4c5a9' },
  { initials: 'CR', name: 'Chen, Robert', email: 'rchen@example.com', color: '#f5b0b0' },
  { initials: 'DM', name: 'Davis, Maria', email: 'mdavis@example.com', color: '#d4d0a9' },
  { initials: 'EK', name: 'Evans, Kevin', email: 'kevans@example.com', color: '#a9c5f5' },
];

interface Props {
  assignee: User | null;
  onAssign: (user: User | null) => void;
}

export default function AssignDropdown({ assignee, onAssign }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const filtered = USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <Button onClick={() => setOpen(!open)}>Assign</Button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 1200,
          background: '#fff', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          width: 300, maxHeight: 350, display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid #e9ebed' }}>
            <Input value={search} onChange={({ detail }) => setSearch(detail.value)} placeholder="Search..." type="search" />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <div
              onClick={() => { onAssign(null); setOpen(false); setSearch(''); }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', background: !assignee ? '#f0f7ff' : 'transparent' }}
            >
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#e9ebed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="user-profile" size="small" />
              </span>
              <Box fontSize="body-m">Unassigned</Box>
              {!assignee && <span style={{ marginLeft: 'auto', color: '#0972d3' }}><Icon name="check" /></span>}
            </div>
            {filtered.map(u => (
              <div
                key={u.email}
                onClick={() => { onAssign(u); setOpen(false); setSearch(''); }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', background: assignee?.email === u.email ? '#f0f7ff' : 'transparent' }}
              >
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#16191f', flexShrink: 0 }}>{u.initials}</span>
                <div style={{ minWidth: 0 }}>
                  <Box fontSize="body-m" fontWeight="bold">{u.name}</Box>
                  <Box fontSize="body-s" color="text-body-secondary">{u.email}</Box>
                </div>
                {assignee?.email === u.email && <span style={{ marginLeft: 'auto', color: '#0972d3' }}><Icon name="check" /></span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export type { User };
