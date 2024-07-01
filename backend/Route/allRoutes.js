const { downloadAudio, getCounting, convertUrl, downloadVideo, fetchAndConvert, downloadMp3, downloadShorts, smallVideoFetch } = require('../Controller/DownloadController');
const express = require('express');
const router = express.Router();

router.post('/fetchingLinks',convertUrl);
//router.post('/fetchShortsVideo',smallVideoFetch);
router.get('/getDownloadLinks',downloadVideo);
router.post('/fetchShortsVideo',smallVideoFetch);
router.get('/getTotalCounts',getCounting);
router.get('/downloadAudio',downloadMp3);
router.post('/fetchAudio',fetchAndConvert);

router.get('/downShorts',downloadShorts);
module.exports = router;