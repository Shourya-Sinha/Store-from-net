const { downloadAudio, getCounting, convertUrl, downloadVideo, fetchAndConvert, downloadMp3 } = require('../Controller/DownloadController');

const router = require('express').Router();

router.post('/fetchingLinks',convertUrl);
router.get('/getDownloadLinks',downloadVideo);
//router.post('/getAudioLinks',downloadAudio);
router.get('/getTotalCounts',getCounting);
router.get('/downloadAudio',downloadMp3);
router.post('/fetchAudio',fetchAndConvert);
router.post('/proxyRequest', (req, res) => {
    res.send('This is a proxy request');
});
module.exports = router;