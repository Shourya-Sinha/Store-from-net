import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar";
import HomPage from "./AllPage/HomPage";
import VideoPage from "./AllPage/Videoage";
import AudioPage from "./AllPage/AudioPage";
import BuymeCoffee from "./AllPage/BuymeCoffee";
import YoutubeShorts from "./AllPage/YoutubeShorts.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route path="/" element={<HomPage />} >
            <Route path="/" element={<BuymeCoffee />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/audio" element={<AudioPage />} />
            <Route path="/shortsVideo" element={<YoutubeShorts />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
