import React, {useState} from 'react';
import {LogOutPrompt} from "../../prompts/prompt-confirm-log-out";
import { useNavigate } from 'react-router';
import { fetchAuthorisedUserID } from '../../../myspaces-api/myspaces-api-cookie';
import {Menu, Typography, MenuItem, Box, Tooltip, Button, IconButton} from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import './profile-icon.css';

/**
 * @name UserProfileIconMenuItems
 * @descriptions A Specific Component to design the Menu Items on the User Profile Icon Component
 * @returns A UserProfileIconMenuItems Component
 */
const UserProfileIconMenuItems = () => {

  const [userLogOutDisplay, setUserLogOutDisplay] = useState(false);

  let navigate = useNavigate();

    return (
        <div className='profile-icon-items'>
            <MenuItem onClick={() => {navigate('/My%20Account')}}>
                <Typography textAlign="center">{'My Account'}</Typography>
            </MenuItem>
            
            <MenuItem onClick={() => {setUserLogOutDisplay(true)}}>
                <Typography textAlign="center">{'Log Out'}</Typography>
            </MenuItem>
            
            <LogOutPrompt displayed={userLogOutDisplay} setDisplayed={setUserLogOutDisplay}/>
        </div>
    );
}

/**
 * @name UserProfileIcon
 * @description Designs the UI for the profile icon if the current user is logged in
 * @returns A UserProfileIcon Component
 */
const UserProfileIcon = () => {

    const [anchorElProfileIcon, setAnchorElProfileIcon] = useState(null);
    
    return (
        <Box sx={{ flexGrow: 0, backgroundColor: '#ffffff', borderRadius: 1}}>
            <Tooltip title="Open settings">
              <IconButton onClick={(event) => {setAnchorElProfileIcon(event.currentTarget)}} sx={{ p: 0 }}>
                <ManageAccountsIcon sx={{color: '#2196f3'}}/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElProfileIcon}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElProfileIcon)}
              onClose={() => {setAnchorElProfileIcon(null)}}
            >
              <UserProfileIconMenuItems />
            </Menu>
        </Box>
    );
}

/**
 * @name GuestProfileIcon
 * @description Designs the UI for the profile icon if the current user is a guest.
 * @returns A GuestProfileIcon Component
 */
const GuestProfileIcon = () => {

  let navigate = useNavigate();

  return (
      <div>
          <Button variant="contained" sx={{backgroundColor: '#ffffff', color: '#2196f3'}} onClick={() => {navigate("/Log%20In");}}>
              Have an account? Log in here!
          </Button>
      </div>
  );
}

/**
 * @name ProfileIcon
 * @description Renders the profile icon depending on whether or not the user is authorised.
 * @returns A ProfileIcon Component
 */
export const ProfileIcon = () => {
  return fetchAuthorisedUserID() ? <UserProfileIcon /> : <GuestProfileIcon />
}
