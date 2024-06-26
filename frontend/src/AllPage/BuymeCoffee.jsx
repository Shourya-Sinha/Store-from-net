import {
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import rightImage from "../assets/donate.png";
import leftImage from "../assets/buy.png";
import youtubeImage from "../assets/rightarrow.png";
import qrCode from "../assets/qrcode.jpg";

const BuymeCoffee = () => {
  const [showQRcode, setShowQRCode] = useState(false);

  const handleButtonClick = () => {
    setShowQRCode(!showQRcode);
  };
  return (
    <>
      <Container
        maxWidth={"lg"}
        sx={{ padding: 2, backgroundColor: "#424242", mt: 3 }}
      >
        <Paper elevation={1} sx={{ backgroundColor: "#424242" }}>
          <Grid container>
            <Grid item xs={12} sm={6} md={6}>
              <Stack sx={{ borderRadius: "20px", overflow: "hidden" }}>
                <img
                  src={rightImage}
                  alt="Right Side Image"
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "contain",
                    borderRadius: "20px",
                  }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6} md={6} sx={{ color: "white" }}>
              <img
                src={leftImage}
                alt="Left side Image"
                style={{ width: "100%", height: "100px", objectFit: "contain" }}
              />
              <Stack sx={{ marginLeft: "100px", paddingTop: 2 }} spacing={1}>
                <Typography variant="body2">Directly from UPI Id</Typography>
                <Typography variant="body2" sx={{ color: "#bdbdbd" }}>
                  phonepay(7488348576@ybl){" "}
                </Typography>

                <Typography variant="caption">
                  Click Button to open QR Code(gpay)
                </Typography>

                <Button
                  sx={{ backgroundColor: "#ff5722" }}
                  variant="contained"
                  onClick={handleButtonClick}
                >
                  Click me
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          spacing={2}
          sx={{ marginTop: 4 }}
        >
          <p style={{ fontSize: "13px" }}>
            <strong>Note: </strong>Download <strong> "Audio & Video "</strong>
            click on navigation url and in mobile video click plus icon then
            navigate to download page{" "}
          </p>
        </Stack>
        {showQRcode && (
          <div style={{ marginTop: "20px" }}>
            <img
              src={qrCode}
              alt="QR Code"
              style={{ maxWidth: "100%", height: 300, objectFit: "contain" }}
            />
          </div>
        )}
      </Container>
      <Stack sx={{ position: "absolute", top: "50%", left: "79%" }}>
        <img
          src={youtubeImage}
          alt="Youtube Link Image"
          style={{ width: "100px", height: "100px", objectFit: "contain" }}
        />
      </Stack>
    </>
  );
};

export default BuymeCoffee;
