import { Box } from '@mui/material'
import Chip from '@mui/material/Chip'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: '5px',
  borderRadius: '5px',
  paddingX: '5px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      borderBottom: '1px solid white'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<SpaceDashboardIcon />}
          label="Hao Tran 203"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FlashOnIcon />}
          label="Automations"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{ 
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={5}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: '16px',
              border: 'none'
            }
          }}
        >
          <Tooltip title="Hao Tran">
            <Avatar
              alt="Hao Tran"
              src='https://taoanhdep.com/wp-content/uploads/2023/11/avt-nen-mau-1.jpg'
            />
          </Tooltip>
          <Tooltip title="Hao Tran">
            <Avatar
              alt="Hao Tran"
              src='https://taoanhdep.com/wp-content/uploads/2023/11/avt-nen-mau-1.jpg'
            />
          </Tooltip>
          <Tooltip title="Hao Tran">
            <Avatar
              alt="Hao Tran"
              src='https://taoanhdep.com/wp-content/uploads/2023/11/avt-nen-mau-1.jpg'
            />
          </Tooltip>
          <Tooltip title="Hao Tran">
            <Avatar
              alt="Hao Tran"
              src='https://taoanhdep.com/wp-content/uploads/2023/11/avt-nen-mau-1.jpg'
            />
          </Tooltip>
          <Tooltip title="Hao Tran">
            <Avatar
              alt="Hao Tran"
              src='https://taoanhdep.com/wp-content/uploads/2023/11/avt-nen-mau-1.jpg'
            />
          </Tooltip>
          <Tooltip title="Hao Tran">
            <Avatar
              alt="Hao Tran"
              src='https://taoanhdep.com/wp-content/uploads/2023/11/avt-nen-mau-1.jpg'
            />
          </Tooltip>
          <Tooltip title="Hao Tran">
            <Avatar
              alt="Hao Tran"
              src='https://taoanhdep.com/wp-content/uploads/2023/11/avt-nen-mau-1.jpg'
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
