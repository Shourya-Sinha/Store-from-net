const { downloadAudio, getCounting, convertUrl, downloadVideo } = require('../Controller/DownloadController');

const router = require('express').Router();

router.post('/fetchingLinks',convertUrl);
router.get('/getDownloadLinks',downloadVideo);
router.post('/getAudioLinks',downloadAudio);
router.get('/getTotalCounts',getCounting);

module.exports = router;