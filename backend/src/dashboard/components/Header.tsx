import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from './CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import Search from './Search';

interface HeaderProps {
  onToggleDashboard?: () => void;
  showToggleButton?: boolean;
}

export default function Header({ onToggleDashboard, showToggleButton }: HeaderProps) {
  return (
    <Stack spacing={2}>
      {/* Toggle Button */}
      {showToggleButton && onToggleDashboard && (
        <Box sx={{ textAlign: 'left', mb: 2 }}>
          <button
            onClick={onToggleDashboard}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            🔄 Switch to Normal Dashboard
          </button>
        </Box>
      )}

      {/* Main Header Content */}
      <Stack
        direction="row"
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '100%',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          maxWidth: { sm: '100%', md: '1700px' },
          pt: 1.5,
        }}
        spacing={2}
      >
        <NavbarBreadcrumbs />
        <Stack direction="row" sx={{ gap: 1 }}>
          <Search />
          <CustomDatePicker />
          <MenuButton showBadge aria-label="Open notifications">
            <NotificationsRoundedIcon />
          </MenuButton>
          <ColorModeIconDropdown />
        </Stack>
      </Stack>
    </Stack>
  );
}
