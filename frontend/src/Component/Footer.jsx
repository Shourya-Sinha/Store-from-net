import { Container, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";

const Footer = () => {
  var currentYear = new Date().getFullYear();
  return (
    <Container maxWidth={"lg"} sx={{ my: 3, color: "white" }}>
      <Grid container>
        <Grid item xs={5} sm={4} md={4}>
          <Typography sx={{ fontWeight: 700 }} variant="caption">
            &copy; {currentYear} StoreFromNet -{" "}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {" "}
            Your Favourite Video Converter
          </Typography>
        </Grid>
        <Grid item xs={6} sm={2} md={4}>
          <Typography variant="caption">Made By Shourya</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MuiLink
            sx={{ pr: 2 }}
            href="https://quicksolve.tech"
            target="_blank"
            rel="noopener noreferrer"
          >
            Quicksolve.tech
          </MuiLink>
          <Link className="navLinkFooter" to={"/terms"}>
            Terms
          </Link>
          <Link className="navLinkFooter" to={"/privacy"}>
            Privacy
          </Link>
          <Link className="navLinkFooter" to={"/Contact"}>
            Contact
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Footer;
