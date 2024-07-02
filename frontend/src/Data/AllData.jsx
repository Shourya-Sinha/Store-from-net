import { SpeedDial, styled } from "@mui/material";
import { Audiotrack, Cached, Done, Download, ElectricBolt, Home, MobileFriendly, PersonAdd, Videocam } from "@mui/icons-material";
import { Link } from "react-router-dom";

var BaseUrl = "https://storefromnet.onrender.com";
var BaseUrl2 = "https://store-from-net.vercel.app";
var BaseUrl2 = "http://localhost:7000";

const listItems1=[
    {index:1, title:'Open Youtube and copy the video URL you want to download.'},
    {index:2, title:'Paste the video URL in the Search box, Tool will fetch video info.'},
    {index:3, title:'Select the Video or Audio quality you need and click the "Download" button.'},
    {index:4, title:'If Link open new tab with video then click three dots and again click download.'},
    {index:5, title:'After that your video downloaded start in your default browser.'},
    {index:6, title:'Note: if you have IDM extension installed then after search it auto download start.'},
]

const listItems2=[
       {index:1, title:'Unlimited Conversions, so you can convert all your videos.'},
       {index:2, title:'High-Speed encoding to convert your videos faster.'},
       {index:3, title:'Unlimited Downloads, convert as much as you can.'},
       {index:4, title:'No Signup required, our service is totally free..'},
       {index:5, title:'Support Downloading multiple formats, e.g. MP4 and MP3.'},
       {index:6, title:'If you want then donate for Buy me a Coffee.'},
]

const actions = [
        {
          icon: (
            <Link className="sppedLink" to={"/"}>
              <Home  />
            </Link>
          ),
          name: "Home",
        },
        {
          icon: (
            <Link className="sppedLink" to={"/audio"}>
              <Audiotrack />
            </Link>
          ),
          name: "YouTube to Mp3",
        },
        {
          icon: (
            <Link className="sppedLink" to={"/video"}>
              <Videocam />{" "}
            </Link>
          ),
          name: "Youtube to Mp4",
        },
];

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
        position: "absolute",
        "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
          bottom: theme.spacing(2),
          right: theme.spacing(2),
        },
        "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
          top: theme.spacing(1),
          left: theme.spacing(2),
        },
}));

const deatlsList=[
    {index:1, title:'Unlimited Conversions',desc:'We offers unlimited conversions of youtube videos to mp3 and mp4.',icon:<Cached color="inherit" sx={{fontSize:'45px'}} />},
    {index:1, title:'Auto Fetch from Youtube',desc:'We automatically fetch data from Youtube, you just have to copy and paste the youtube URL.',icon:<Download color="inherit"  sx={{fontSize:'45px'}} />},
    {index:1, title:'No Registration Required',desc:'You do not need to register to convert and download youtube videos to mp4 and mp3 format.',icon:<PersonAdd color="inherit"  sx={{fontSize:'45px'}} />},
    {index:1, title:'Faster Video Conversion',desc:'We use the latest technologies for encoding system, so you do not have to wait much for the conversion.',icon:<ElectricBolt color="inherit"  sx={{fontSize:'45px'}} />},
    {index:1, title:'Browser Compatibility',desc:'Our web app is fully compatible with the latest browsers like Chrome, Firefox, Safari, Microsoft Edge, etc.',icon:<Done color="inherit"  sx={{fontSize:'45px'}} />},
    {index:1, title:'Completely Mobile friendly',desc:'Our site can be used on any device to download your favorite youtube videos to mp4 and mp3.',icon:<MobileFriendly color="inherit"  sx={{fontSize:'45px'}} />}
]

export {listItems1, listItems2,actions,StyledSpeedDial,deatlsList,BaseUrl};