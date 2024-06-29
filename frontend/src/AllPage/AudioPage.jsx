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
  const [thumbnail, setThumbnail] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileSize, setFileSize] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [converting, setConverting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const enqueueSnackbar = useSnackbar();

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BaseUrl}/fetchAudio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ VideoLink: videoLink }), // Ensure videoLink is sent in the request
      });

      if (!response.ok) {
        throw new Error("Failed to get Video Download Link");
      }

      const data = await response.json();
      setThumbnail(data.thumbnail);
      setTitle(data.title);
      setFileSize(data.fileSize);
      setDownloadUrl(data.downloadUrl);
      setLoading(false);
      enqueueSnackbar('Getting Video successfully!', 'success');
    } catch (error) {
      console.error("Error fetching download link:", error);
      enqueueSnackbar(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadMp3 = async () => {
    setDownloading(true);
    try {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${title}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      enqueueSnackbar('Audio extract and send your browser to download successfully!', 'success');
    } catch (error) {
      console.error('Error in manual download', error);
      enqueueSnackbar(`Error: ${error.message}`, 'error');
    } finally {
      setDownloading(false);
      handlerefresh();
    }
  };

  const handleClear = () => {
    setVideoLink('');
  };

  const handlerefresh = () => {
    setTimeout(() => {
      setVideoLink('');
      setThumbnail('');
      setTitle('');
      setFileSize('');
      setDownloadUrl('');
      setConverting(false);
      setDownloading(false);
    },3000);

  };


  return (
    <>
<Container maxWidth={"lg"} sx={{ padding: 2, backgroundColor: "#424242", mt: 3 }}>
      <Paper elevation={1} sx={{ backgroundColor: "#424242" }}>
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ textAlign: "center", py: 3, color: "#eeeeee" }}>
            YouTube To Audio Downloader
          </Typography>
          <Stack direction={"row"}>
            <TextField
              className="textfield"
              value={videoLink}
              disabled={downloading}
              onChange={(e) => setVideoLink(e.target.value)}
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
              onClick={handleDownload}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
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
              We Automatically Get Best Audio Quality from your link and also permissible format! (And Video Link size is different of Audio Converted Size).
              
            </Typography>
          {thumbnail && (
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
                      src={thumbnail}
                      alt={title}
                      style={{ maxWidth: "100%", borderRadius: 8 }}
                    />
                     <Typography variant="subtitle1" sx={{ color: "white" }}>
                      Video Link Size: {fileSize}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box >
                    <Typography variant="h6" sx={{ color: "#b0bec5",wordWrap:'break-word',textAlign:'justify' }}>
                      {title}
                    </Typography>
                    <Button
                    fullWidth
                      variant="contained"
                      sx={{ mt: 3, backgroundColor: "#ff5722" }}
                      onClick={downloadMp3}
                      disabled={downloading || converting}
                    >
                      Download Audio File
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Stack>
      </Paper>
    </Container>
    </>
  );
};

export default AudioPage;
