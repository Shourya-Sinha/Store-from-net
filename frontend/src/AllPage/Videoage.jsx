import React, { useState } from "react";
import "../App.css";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import youtubeImage from "../assets/quick-download-tip.png";
import { Cancel, Search } from "@mui/icons-material";
import { BaseUrl } from "../Data/AllData";
import { useSnackbar } from "../Component/SnackBar.jsx";

const sanitizeFilename = (filename) => {
  return filename.replace(/[<>:"/\\|?*]+/g, '').replace(/\s+/g, '_').trim().substring(0, 300);
};

const VideoPage = () => {
  const [videoLink, setVideoLink] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(0);
  const [formats, setFormats] = useState([]);
  const [FileSize, setFileSize] = useState("");
  const enqueueSnackbar = useSnackbar();

  // const handleDownload = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${BaseUrl}/fetchingLinks`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  //         'Accept-Language': 'en-US,en;q=0.9',
  //       },
  //       body: JSON.stringify({ VideoLink: videoLink }), // Ensure videoLink is sent in the request
  //     });

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(`Failed to get Video Download Link: ${errorText}`);
  //     }

  //     const data = await response.json();
  //     setThumbnail(data.thumbnail);
  //     const sanitizedTitle = sanitizeFilename(data.setingtitle);
  //     setTitle(sanitizedTitle);
  //     setSelectedFormat(data.selectedFormat);
  //     setFormats(data.formats);
  //     setFileSize(data.fileSize); // Store the VideoLink from the response
  //     setLoading(false);

  //     if (data.formats.length === 1) {
  //       setSelectedFormat(data.formats[0].itag);
  //     }
  //     enqueueSnackbar('Getting Video successfully!', 'success');
  //   } catch (error) {
  //     console.error("Error fetching download link:", error);
  //     enqueueSnackbar(`Error: ${error.message}`, 'error');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BaseUrl}/fetchingLinks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ VideoLink: videoLink }),
      });
  
      console.log('Response Status:', response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get Video Download Link: ${errorText}`);
      }
  
      const data = await response.json();
      setThumbnail(data.thumbnail);
      const sanitizedTitle = sanitizeFilename(data.setingtitle);
      setTitle(sanitizedTitle);
      setSelectedFormat(data.selectedFormat);
      setFormats(data.formats);
      setFileSize(data.fileSize);
      setLoading(false);
  
      if (data.formats.length === 1) {
        setSelectedFormat(data.formats[0].itag);
      }
      enqueueSnackbar('Getting Video successfully!', 'success');
    } catch (error) {
      console.error('Error fetching download link:', error);
      enqueueSnackbar(`Error: ${error.message}`, 'error');
  
      // Fallback mechanism
      if (error.message.includes('410 Gone')) {
        console.log('Fallback: Trying alternative method to fetch video link...');
        // Implement an alternative method to fetch the video link
      }
    } finally {
      setLoading(false);
    }
  };
  

  const handleManualDownload = () => {
    if (!selectedFormat) return;
    const sanitizedTitle = sanitizeFilename(title);
    if (videoLink) {
      window.location.href = `${BaseUrl}/getDownloadLinks?VideoLink=${encodeURIComponent(
        videoLink
      )}&itag=${selectedFormat}&title=${encodeURIComponent(sanitizedTitle)}`;
      enqueueSnackbar('Video Extracted & Sent to your default downloader successfully!', 'success');
    } else {
      console.error("VideoLink is missing");
      enqueueSnackbar(`Error: ${error.message}`, 'error');
    }
  };

  const handleClear = () => {
    setVideoLink("");
  };

  return (
    <Container maxWidth={"lg"} sx={{ padding: 2, backgroundColor: "#424242", mt: 3 }}>
      <Paper elevation={1} sx={{ backgroundColor: "#424242" }}>
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ textAlign: "center", py: 3, color: "#eeeeee" }}>
            YouTube To Video Downloader
          </Typography>
          <Stack direction={"row"}>
            <TextField
              className="textfield"
              value={videoLink}
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
              {loading ? <CircularProgress size={24} /> : "Search"}
            </Button>
          </Stack>
          <Typography
            variant="caption"
            sx={{ textAlign: "center", color: "#bdbdbd", paddingBottom: 2 }}
          >
            By using our service you are accepting our <Link>Terms of service </Link>
          </Typography>
        </Stack>

        {/* Searching File Place */}
        <Box>
          <Typography sx={{ color: "white", textAlign: "center" }}>
            <strong style={{ color: "red", display: "inline" }}>Warnings</strong>: Avoid any errors please select 360p in quality to smooth work
          </Typography>
          <Grid container>
            <Grid item xs={12} sm={6}>
              {thumbnail && (
                <Box>
                  <Stack sx={{ padding: 3 }}>
                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
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

                      <Stack spacing={1}>
                        {selectedFormat && (
                          <Typography variant="body2" color="white" component="p">
                            Quality Size: {formats.find((f) => f.itag === selectedFormat)?.fileSize}
                          </Typography>
                        )}

                        <Typography sx={{ color: "white" }}>
                          Pasted Link Size: {FileSize}
                        </Typography>
                      </Stack>
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
              {formats.length > 0 && (
                <Box sx={{ padding: 3, paddingTop: 7 }}>
                  <FormControl fullWidth>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        color: "white",
                        "&.Mui-focused": {
                          color: "white",
                        },
                      }}
                    >
                      Select Quality
                    </InputLabel>
                    <Select
                      variant="outlined"
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                      displayEmpty
                      sx={{
                        minWidth: "150px",
                        height: "50px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ff5722",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ff5722",
                        },
                        "& .MuiSelect-select": {
                          color: "white",
                        },
                        "& .MuiInputLabel-root": {
                          color: "white",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "white",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "white",
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Video Quality
                      </MenuItem>
                      {formats.map((format) => (
                        <MenuItem key={`${format.quality}-${format.itag}`} value={format.itag}>
                          {format.quality} ({format.fileSize})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    onClick={handleManualDownload}
                    variant="contained"
                    color="secondary"
                    sx={{ marginTop: "40px" }}
                    disabled={!selectedFormat}
                    fullWidth
                  >
                    Download Video
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Stack justifyContent={"center"} alignItems={"center"} spacing={2} sx={{ marginTop: 4 }}>
        <p style={{ fontSize: "13px" }}>
          <strong>Tip: </strong>insert <strong> "current video url"</strong> in the URL bar to download mp4 and mp3 files from Youtube in a faster way
        </p>

        <img src={youtubeImage} alt="Youtube Link Image" />
      </Stack>
    </Container>
  );
};

export default VideoPage;
