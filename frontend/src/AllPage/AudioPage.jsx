import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Cancel, Search, Try } from "@mui/icons-material";
import "../App.css";
import youtubeImage from "../assets/quick-download-tip.png";
import { BaseUrl } from "../Data/AllData";
import { useSnackbar } from "../Component/SnackBar.jsx";

const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-z0-9_\-\.]/gi, "_").substring(0, 100); // Remove special characters and truncate
};

const AudioPage = () => {
  const [videoLink, setVideoLink] = useState('');
  const [thumbnail, setThumbnail] =useState('');
  const [title, setTitle] = useState('');
  const [fetching,setFetching] = useState(false);
  const [downloadLink,setDownloadLink] =useState(false);
  const [loading,setLoading] =useState('');
  const [FileSize,setFileSize] =useState('');
  const [converting,setConverting] =useState(false);
  const [downloading,setDownloading] =useState(false);
  const [downloaded,setDownloaded] =useState(false);
  const enqueueSnackbar = useSnackbar();

  const fetchVideo = async () =>{
    setLoading(true);
    try {
      const response = await fetch(`${BaseUrl}/fetchingLinks`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          VideoLink:videoLink
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get Video Download Link");
      }

      const data = await response.json();
      //console.log('data',data);

      setThumbnail(data.thumbnail);
      const sanitizedTitle = sanitizeFilename(data.setingtitle);
      setTitle(sanitizedTitle);
      setFileSize(data.fileSize); // Store the VideoLink from the response
      setLoading(false);
      enqueueSnackbar('Fetching Video successfully!', 'success');
    } catch (error) {
      console.error("Error fetching download link:", error);
      enqueueSnackbar(`Error: ${error.message}`, 'error');
    }finally {
      setLoading(false);
      setFetching(true);
  }
}

const handleClear =()=>{
  setVideoLink('');
};

const handlerefresh=()=>{
  setFetching(false);
  setDownloadLink(false);
  setConverting(false);
  setDownloading(false);
}

const handleConvertMp3= async ()=>{
  setConverting(true);
  try {
    const response = await fetch(`${BaseUrl}/getAudioLinks`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        VideoLink:videoLink
      })
    });

    if(!response.ok){
      throw new Error("Failed to get Audio Download Link");
    }

    const blob = await response.blob();
    const url=window.URL.createObjectURL(blob);
    enqueueSnackbar('Converting Video successfully!', 'success');
    return url;
    // setMp3Url(url);
    // console.log('audio data',blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download=`${title}.mp3`;
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
  } catch (error) {
    console.error('Error in converting to mp3',error);
    enqueueSnackbar(`Error: ${error.message}`, 'error');
  }finally{
    setDownloadLink(true);
    setConverting(false);
  }
}
const downloadMp3= async () =>{
  setDownloading(true);
  setDownloaded(true);
  try {
    const mp3Url = await handleConvertMp3();
    const a = document.createElement('a');
    a.href = mp3Url;
    a.download = `${title}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    enqueueSnackbar('Downloading Audio successfully!', 'success');
  } catch (error) {
    console.error('Error in manual download', error);
    enqueueSnackbar(`Error: ${error.message}`, 'error');
  } finally{
    setDownloading(false);
    setDownloaded(false);
    handlerefresh();
  }
}

  return (
    <Container
      maxWidth={"lg"}
      sx={{ padding: 2, backgroundColor: "#424242", mt: 3 }}
    >
      <Paper elevation={1} sx={{ backgroundColor: "#424242" }}>
        <Stack spacing={2}>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", py: 3, color: "#eeeeee" }}
          >
            YouTube To Audio Downloader
          </Typography>
          <Stack direction={"row"}>
            <TextField
              className="textfield"
              value={videoLink}
              disabled={downloading }
              onChange={(e) => setVideoLink(e.target.value)}
              sx={{
                flexGrow: 1,
                border: 3,
                borderColor: "#ff5722",
                "& .MuiInputBase-input::placeholder": {
                  color: "#9e9e9e", // Change this to your desired color
                  opacity: 1, // This is necessary to override the default opacity
                },
                "& .MuiInputBase-input": {
                  color: "#ffffff", // Change this to your desired text color
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
                onClick={fetchVideo}
                disabled={loading || downloaded}
              >
                {loading ? <CircularProgress size={24} sx={{color:"white"}} /> : "Search"}
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
        </Stack>

        {/*Searching File Place  */}

        <Box>
           
            <Grid container>
              <Grid item xs={12} sm={6}>
                {thumbnail && (
                  <Box>
                    <Stack sx={{ padding: 3 }}>
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        spacing={2}
                      >
                        <div
                          style={{
                            marginBottom: 0,
                            paddingBottom: 0,
                            borderRadius: "10px",
                          }}
                        >
                          <img
                            src={thumbnail}
                            style={{
                              width: "200px",
                              objectFit: "contain",
                              borderRadius: "10px",
                            }}
                          />
                        </div>
                        <Typography sx={{color:'white'}}variant="subtitle2">Video Link Size: {FileSize}</Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#b0bec5",
                          lineHeight: 1.5,
                          wordWrap: "break-word",
                        }}
                      >
                        {title}
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
              <Typography sx={{ color: "white",paddingTop:5 }}>
              {" "}
              <strong style={{ color: "red", display: "inline" }}>
                Note{" "}
              </strong>
              : Automatically Audio Selected on Best Quality
            </Typography>
           
             
            
                  <Button
                      onClick={handleConvertMp3}
                      variant="contained"
                      color="secondary"
                      sx={{ marginTop: "20px" }}
                      fullWidth
                      disabled={!fetching || downloading}
                      
                    >
                      {converting ? <CircularProgress size={24} sx={{color:"white"}} /> : "Convert Into Audio"}
                    </Button>

                
             

                 
<Button variant='contained' color='secondary' fullWidth style={{marginTop:'10px'}} onClick={downloadMp3} disabled={!downloadLink}>
  {downloading ? <CircularProgress size={24} sx={{color:"white"}} /> : "Download Audio"}

</Button>
                 
              
       
                 
              </Grid>
            </Grid>
          </Box>

      </Paper>
      <Stack
        justifyContent={"center"}
        alignItems={"center"}
        spacing={2}
        sx={{ marginTop: 4 }}
      >
        <p style={{ fontSize: "13px" }}>
          <strong>Tip: </strong>insert <strong> "current video url"</strong> in
          the URL bar to download mp4 and mp3 files from Youtube in a faster way{" "}
        </p>

        <img src={youtubeImage} alt="Youtube Link Image" />
      </Stack>
    </Container>
  );
};

export default AudioPage;
