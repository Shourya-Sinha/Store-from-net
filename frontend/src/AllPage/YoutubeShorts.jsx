import React, { useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../Data/AllData';
import { Box, Button, CircularProgress, Container, Grid, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import { Cancel, Search } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const YoutubeShorts = () => {
    const [url, setUrl] = useState('');
    const [videoDetails, setVideoDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFetchDetails= async () =>{
      setIsLoading(true);
        try {

            //const response = await axios.post('http://localhost:8000/fetchShortsVideo', { url });
            const response = await axios.post(`${BaseUrl}/fetchShortsVideo`, { url });
            setVideoDetails(response.data);
        } catch (error) {
            console.error('Error fetching video details:', error);
        }finally {
            setIsLoading(false);
        }
    }
    const handleClear=()=>{
        setUrl('');
    }
  
  return (
    <>
    <Container maxWidth={"lg"} sx={{ padding: 2, backgroundColor: "#424242", mt: 3 }}>
      <Paper elevation={1} sx={{ backgroundColor: "#424242" }}>
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ textAlign: "center", py: 3, color: "#eeeeee" }}>
            YouTube Shorts Video Downloader
          </Typography>
          <Stack direction={"row"}>
            <TextField
              className="textfield"
              value={url}
              disabled={isLoading}
              onChange={(e) => setUrl(e.target.value)}
              sx={{
                flexGrow: 1,
                border: 3,
                borderColor: "#ff5722",
                "& .MuiInputBase-input::placeholder": {
                  color: "#9e9e9e",
                  opacity: 1,
                },
                "& .MuiInputBase-input": {
                  color: "#ffffff",
                },
              }}
              placeholder="Paste Youtube Link"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#ff5722" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClear}>
                      <Cancel sx={{ color: "#ff5722" }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: "#ff5722" }}
              onClick={handleFetchDetails}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
            </Button>
           
          </Stack>
          <Typography
              variant="caption"
              sx={{ textAlign: "center", color: "#bdbdbd", paddingBottom: 2 }}
            >
              {" "}
              By using our service you are accepting our{" "}
              <Link>Terms of service </Link>
            </Typography>
            <Typography
              variant="caption"
              sx={{ textAlign: "center", color: "#bdbdbd", paddingBottom: 2 }}
            >
              {" "}
              <strong style={{color:'#FF5722'}}>Note: </strong>
              We Automatically Get Best Video Quality from your link and also permissible format! (And Video Link size is different of Audio Converted Size).
              
            </Typography>
          {videoDetails && (
            <Paper
              elevation={1}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#424242",
                padding: 3,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box >
                    <img
                      src={videoDetails.thumbnail}
                      alt={videoDetails.title}
                      style={{ maxWidth: "100%", borderRadius: 8 }}
                    />
                     <Typography variant="subtitle1" sx={{ color: "white" }}>
                      Video Link Size: Size: {videoDetails.size ? `${(videoDetails.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box >
                    <Typography variant="h6" sx={{ color: "#b0bec5",wordWrap:'break-word',textAlign:'justify' }}>
                      {videoDetails.title}
                    </Typography>
                    <a href={videoDetails.downloadLink}>
                    <Button
                    fullWidth
                      variant="contained"
                      sx={{ mt: 3, backgroundColor: "#ff5722" }}
                      disabled={isLoading }
                    >
                      Download Shorts Video
                    </Button>
                    </a>
                   
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Stack>
      </Paper>
    </Container>
    </>
  )
}

export default YoutubeShorts;