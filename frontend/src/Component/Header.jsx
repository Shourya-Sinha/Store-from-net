import React, { useEffect, useState } from 'react';
import { AppBar, Badge, Box, IconButton, Menu, MenuItem, Stack, Toolbar, Tooltip, Typography } from '@mui/material';
import { AccountCircle, Audiotrack, Bolt, Mail, More, Notifications, Videocam } from '@mui/icons-material';
import {Menu as MenuIcons} from '@mui/icons-material';
import '../App.css';
import { Link } from 'react-router-dom';
import { BaseUrl } from '../Data/AllData';
import { useSnackbar } from './SnackBar.jsx';

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const [totalvideo, setTotalVideo] = useState(0);
    const [totalaudio, setTotalAudio] = useState(0);
    const [totalshorts, setTotalshorts] = useState(0);
    const enqueueSnackbar = useSnackbar();

    useEffect(() =>{
       const fetchCounts = async () =>{
        try {
          const response = await fetch(`${BaseUrl}/getTotalCounts`);
          const data = await response.json();
          setTotalVideo(data.totalVideoCount);
          setTotalAudio(data.totalAudioCount);
          setTotalshorts(data.totalShortsVideoCount);
        } catch (error) {
          console.log('Error in Counting',error);
          enqueueSnackbar(`Error fetching counts: ${error.message}`, 'error');
        }
       }

       const intervalId = setInterval(fetchCounts,15000);
       fetchCounts();

       return() =>{
        clearInterval(intervalId);
       };
    },[]);
  
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  
    const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMobileMenuClose = () => {
      setMobileMoreAnchorEl(null);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
      handleMobileMenuClose();
    };
  
    const handleMobileMenuOpen = (event) => {
      setMobileMoreAnchorEl(event.currentTarget);
    };
  
    const menuId = 'primary-search-account-menu';
    const renderMenu = (
      <Menu
        sx={{'& .MuiPaper-root':{backgroundColor:' #616161',color:'#fff'}}}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        // Pass open prop here
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      </Menu>
    );
  
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
      <Menu
      sx={{'& .MuiPaper-root':{backgroundColor:' #616161',color:'#fff'}}}
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        // Pass open prop here
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        
      >
        <MenuItem>
          <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={totalvideo} color="error">
            <Videocam />
            </Badge>
          </IconButton>
          <p>Video Served</p>
        </MenuItem>
        <MenuItem>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent={totalaudio} color="error">
            <Audiotrack />
            </Badge>
          </IconButton>
          <p>Audio Served</p>
        </MenuItem>
        <MenuItem>
          <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={totalshorts} color="error">
            <Bolt />
            </Badge>
          </IconButton>
          <p>Shorts Video </p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );

  return (
   <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{boxShadow:'none !important', backgroundColor:'#424242  '}}>
        <Toolbar >
          
          <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' },fontStyle:'italic',fontFamily:'Poppins ',color:'#ff5722' }}
            >
              StoreFromNet
            </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <Link className='navLink' to={'/'}>Home</Link>
              <Link className='navLink' to={'/audio'}>Youtube to Mp3</Link>
              <Link className='navLink' to={'/video'}>Youtube to Mp4</Link>
              <Link className='navLink' to={'/shortsVideo'}> Youtube Shorts </Link>
            </Stack>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={totalvideo} color="error">
                <Tooltip title='Total Video Served'>
                <Videocam />
                </Tooltip>
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={totalaudio} color="error">
              <Tooltip title='Total Audio Served'>
                <Audiotrack />
                </Tooltip>
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={totalshorts} color="error">
              <Tooltip title='Total Shorts Video Served'>
                <Bolt />
                </Tooltip>
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <More />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
   </>
  )
}

export default Header;