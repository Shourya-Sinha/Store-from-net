import React, { useState } from "react";
import {
  Box,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  SpeedDialAction,
  Stack,
  Typography,
} from "@mui/material";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { Outlet } from "react-router-dom";
import "../App.css";
import { StyledSpeedDial, actions, deatlsList, listItems1, listItems2 } from "../Data/AllData";
import { Cached } from "@mui/icons-material";


const HomPage = () => {
  const [direction, setDirection] = useState("right");
  const lastIndex =listItems1.length-1;
  return (
    <>
      <Box
        sx={{
          transform: "translateZ(0px)",
          flexGrow: 1,
          display: { xs: "flex", md: "none" },
        }}
      >
        <Box sx={{ position: "relative", mt: 3, }}>
          <StyledSpeedDial
            sx={{ marginBottom: "1" }}
            ariaLabel="SpeedDial playground"
            icon={<SpeedDialIcon />}
            direction={direction}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
              />
            ))}
          </StyledSpeedDial>
        </Box>
      </Box>

      {/* VideoPage Call */}
      <Container maxWidth={"lg"}sx={{color:'white'}}>
        <Outlet />
      </Container>

      <Container maxWidth={"lg"} sx={{marginTop:5,color:'white'}}>
        <Stack spacing={2} sx={{marginBottom:4}}>
        <Typography variant="h4">
          StoreFromNet: Best Youtube Audio, Video Downloader
        </Typography>
        <Typography variant="subtitle2" sx={{ textAlign: "justify",color:'#bdbdbd' }} >
          StoreFromNet is the fastest Youtube Downloader tool that allows you to
          easily convert and download videos and audios from youtube for free
          and in the best available quality. StoreFromNet is the ultimate tool to
          download unlimited youtube videos without any need for registration.
          You can quickly convert and download hundreds of videos and music
          files directly from youtube and other social media websites. We
          support all audio and video formats like MP3, MP4, M4V, FLV, WEBM,
          3GP, WMV, AVI, etc., and the most amazing thing, it's completely free.
        </Typography>
        </Stack>
       

        <Divider  orientation="horizontal" color={'#616161'} sx={{paddingBottom:4, marginBottom:4}} />

        <Grid container>
          <Grid item xs={12} sm={6} md={6}>
            <Typography variant="h5">How to Download youtube videos with StoreFromNet?</Typography>
             <List sx={{ listStyleType: 'decimal', paddingLeft: '20px', '& .MuiListItem-root': { display: 'list-item' }, }}>
                {listItems1.map((item,index)=>(
                    <ListItem key={index} sx={{ display: 'list-item' ,fontSize:"13px"}}>
                    <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '14px', fontFamily:'Poppins sans-serif',fontStyle:'italic',color:index === lastIndex ? '#03a9f4' :'#bdbdbd' }}  />
                    </ListItem>
                ))}
               
             </List>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Typography variant="h5">Why use our online video downloader?</Typography>
            <List sx={{ listStyleType: 'decimal', paddingLeft: '20px', '& .MuiListItem-root': { display: 'list-item' } }}>
                {listItems2.map((item)=>(
                    <ListItem key={item.index} sx={{ display: 'list-item' ,fontSize:"13px"}}>
                    <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '14px', fontFamily:'Poppins sans-serif',fontStyle:'italic',color:'#bdbdbd' }}  />
                    </ListItem>
                ))}
               
             </List>
          </Grid>
        </Grid>

        <Divider  orientation="horizontal" color={'#616161'} sx={{paddingBottom:4, my:4}} />

       <Grid container sx={{py:2}}>
        {deatlsList.map((item)=> (
            <Grid item xs={12} sm={6} md={4} key={item.index} sx={{marginBottom:3}}>
            <Stack justifyContent={'center'}alignItems={'center'} sx={{px:2}}>
                {item.icon}
                <Typography variant="subtitle2" sx={{fontWeight:800,fontSize:'15px'}}>{item.title}</Typography>
                <Typography variant="caption" sx={{color:'#bdbdbd'}}>{item.desc}</Typography>
            </Stack>
        </Grid>
        ))}
        
       </Grid>
      </Container>

      <Divider orientation="horizontal" color={'#616161'} />

      {/* AudioPage Call */}
    </>
  );
};

export default HomPage;
