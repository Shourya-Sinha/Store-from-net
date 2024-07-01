const DataModel = require('../DataModel/UrlSaving');

//Mp4
const ytdl = require('ytdl-core');

//Mp3
const ffmpeg = require('fluent-ffmpeg');
const {PassThrough} = require('stream');
const { format } = require('path');

const getFileSize = async (url) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return parseInt(response.headers.get('content-length'), 10);
    } catch (error) {
        console.error('Error fetching file size:', error);
        return 0;
    }
};

const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`;
};

exports.convertUrl = async (req, res) => {
    try {
        const { VideoLink } = req.body;

        if (!VideoLink) {
            return res.status(400).json({
                status: 'error',
                message: "Video Link is required"
            });
        }

        if (!ytdl.validateURL(VideoLink)) {
            return res.status(400).json({
                status: 'error',
                message: "Invalid YouTube Video Link"
            });
        }

        const info = await ytdl.getInfo(VideoLink);
        const formats = await Promise.all(info.formats
            .filter(format => format.container === 'mp4' && format.hasVideo && format.hasAudio)
            .map(async (format) => {
                let fileSize = 'Unknown size';
                if (format.contentLength) {
                    fileSize = formatFileSize(format.contentLength);
                } else {
                    // Fetch the file size if contentLength is not available
                    const fileSizeBytes = await getFileSize(format.url);
                    if (fileSizeBytes) {
                        fileSize = formatFileSize(fileSizeBytes);
                    }
                }
                return {
                    quality: format.qualityLabel,
                    itag: format.itag,
                    fileSize: fileSize
                };
            }));

        const sanitizeFileName = (name) => name.replace(/[<>:"/\\|?*]+/g, '');
        const encodeFileName = (name) => encodeURIComponent(name).replace(/['()]/g, escape).replace(/\*/g, '%2A');

        const title = sanitizeFileName(info.videoDetails.title);
        const encodedTitle = encodeFileName(title);
        const thumbnail = info.videoDetails.thumbnails[0].url;
        const setingtitle = info.videoDetails.title.replace(/[<>:"/\\|?*]+/g, '');

        const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
        const downloadUrl = audioFormat.url;

        const fileSizeBytes = audioFormat.contentLength || await getFileSize(downloadUrl);
        const fileSize = formatFileSize(fileSizeBytes);

        return res.status(200).json({
            status: 'success',
            formats,
            thumbnail,
            setingtitle,
            encodedTitle,
            fileSize,
            downloadUrl,
            VideoLink,
        });
    } catch (error) {
        console.error('Error fetching download links:', error);
        if (error.statusCode === 410) {
            return res.status(410).json({
                status: 'error',
                message: 'The video is no longer available (410 Gone).'
            });
        }
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

exports.downloadVideo = async (req, res) => {
    const { VideoLink, itag, title } = req.query;

    if (!VideoLink || !itag || !title) {
        console.error('Missing video URL, itag, or title');
        return res.status(400).json({
            status: 'error',
            message: 'Missing video URL, itag, or title',
        });
    }

    try {
        const info = await ytdl.getInfo(VideoLink);
        const format = info.formats.find(f => f.itag == itag);

        if (!format) {
            console.error('Requested format not found');
            return res.status(400).json({
                status: 'error',
                message: 'Requested format not found',
            });
        }

        const sanitizeTitle = (name) => {
            return name.replace(/[<>:"/\\|?*]+/g, '').replace(/[\s]+/g, '_').trim().substring(0, 200);
        };

        const safeTitle = sanitizeTitle(title);
        const encodedTitle = encodeURIComponent(safeTitle);
        console.log(`Sanitized Title: ${safeTitle}`); // Log sanitized title

        const stream = ytdl(VideoLink, { quality: itag });
        res.setHeader('Content-Disposition', `attachment; filename="${encodedTitle}.mp4"`);

        stream.pipe(res);

        stream.on('end', async () => {
            try {
                await DataModel.findOneAndUpdate(
                    { VideoLink },
                    { $inc: { TotalNoOfVideo: 1 } },
                    { new: true, upsert: true }
                );
            } catch (error) {
                console.error('Error updating video count:', error);
            }
        });

        stream.on('error', (error) => {
            console.error('Error during streaming:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error during video streaming',
            });
        });
    } catch (error) {
        console.error('Error downloading video:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

const sanitizeFilename = (filename) => {
    return filename
      .replace(/[^a-z0-9_\-\.]/gi, "_") // Replace invalid characters with underscores
      .replace(/_+/g, "_") // Replace multiple underscores with a single underscore
      .replace(/^_+|_+$/g, ""); // Trim leading and trailing underscores
  };

exports.fetchAndConvert = async (req, res) => {
    const { VideoLink } = req.body;
  
    try {
      // Fetch video info from YouTube
      const info = await ytdl.getInfo(VideoLink);
      const videoDetails = {
        thumbnail: info.videoDetails.thumbnails[0].url,
        title: sanitizeFilename(info.videoDetails.title),
        duration: info.videoDetails.lengthSeconds,
        averageBitrate: info.formats.find(format => format.audioBitrate).audioBitrate || 128,
      };
  
      // Calculate file size in bytes (bitrate * duration)
      const fileSizeBytes = (videoDetails.averageBitrate * 1000 / 8) * videoDetails.duration;
      const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);
  
      // Construct download URL
      const downloadUrl = `${req.protocol}://${req.get('host')}/downloadAudio?VideoLink=${encodeURIComponent(VideoLink)}&title=${encodeURIComponent(videoDetails.title)}`;
  
      // Respond with fetched details and download URL
      res.json({
        thumbnail: videoDetails.thumbnail,
        title: videoDetails.title,
        fileSize: `${fileSizeMB} MB`,
        downloadUrl,
      });
    } catch (error) {
      console.error('Error fetching and converting:', error);
      res.status(500).json({ error: 'Failed to fetch or convert video' });
    }
  };

  exports.downloadAudio =async (req,res) =>{
    try {
        const { VideoLink, itag, title } = req.query;

        if (!VideoLink || !itag || !title) {
            return res.status(400).json({
                status: 'error',
                message: "Missing required parameters"
            });
        }

        if (!ytdl.validateURL(VideoLink)) {
            return res.status(400).json({
                status: 'error',
                message: "Invalid YouTube Video Link"
            });
        }

        const info = await ytdl.getInfo(VideoLink);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

        if (!format) {
            return res.status(400).json({
                status: 'error',
                message: "Format not found"
            });
        }

        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
        ytdl(VideoLink, { format: format }).pipe(res);
    } catch (error) {
        console.error('Error generating download link:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
}

exports.downloadMp3 = async (req, res) => {
    const { VideoLink, title } = req.query;
  
    try {
      // Set headers for the response to prompt download
      res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
  
      // Specify audio quality
      const audioStream = ytdl(VideoLink, {
        filter: 'audioonly',
        quality: 'highestaudio', // Choose the highest quality audio
      });
      audioStream.on('error', (error) => {
        console.error('Error downloading MP3:', error);
        res.status(500).json({ error: 'Failed to download MP3' });
      });
      audioStream.on('end', async () => {
        try {
            await DataModel.findOneAndUpdate(
                { VideoLink },
                { $inc: { TotalNoOfAudio: 1 } },
                { new: true, upsert: true }
            )
        } catch (error) { 
            console.log('Error in Updating or Downloading Audio',error);
        }
      });
  
      audioStream.pipe(res);
    } catch (error) {
      console.error('Error downloading MP3:', error);
      res.status(500).json({ error: 'Failed to download MP3' });
    }
  };


exports.getCounting = async (req,res) =>{
    try {
        var pipeline=[{
            $group:{
                _id:null,
                totalVideo:{$sum: "$TotalNoOfVideo"},
                totalAudio:{$sum: "$TotalNoOfAudio"},
                totalShortsVideo:{$sum: "$TotalNoOfShortsVideo"},
            }
        }];

        var counts = await DataModel.aggregate(pipeline);
        var totalCounts = counts[0] || {totalVideo: 0, totalAudio:0, totalShortsVideo:0};

        return res.status(200).json({
            status:'success',
            totalVideoCount: totalCounts.totalVideo,
            totalAudioCount: totalCounts.totalAudio,
            totalShortsVideoCount: totalCounts.totalShortsVideo,
        });
    } catch (error) {
        console.log('Error in counting',error);
        res.status(500).json({
            status:'error',
            message:error.message
        });
    }
}

//Shorts
// const sanitizeFilenameShorts=(filename) =>{
//     return filename.replace(/[<>:"/\\|?*]+/g, '').replace(/[\s]+/g, '_').trim().substring(0, 200);
//   }
const sanitizeFilenameShorts = (filename) => {
    return filename.replace(/[<>:"/\\|?*]+/g, '').replace(/\s+/g, '_').trim().substring(0, 200);
};



  exports.smallVideoFetch = async (req,res) =>{
    const {url} = req.body;
    try {

        if (!url){
            return res.status(400).json({
                status: 'error',
                message: "Missing Url paste any valid Shorts Url"
            });
        }

        if(!ytdl.validateURL(url)){
            return res.status(400).json({
                status: 'error',
                message: "Invalid YouTube Shorts URL"
            });
        }

        // const info = await ytdl.getInfo(url);
        // const title = info.videoDetails.title;
        // const thumbnails = info.videoDetails.thumbnails;
        // const thumbnail = thumbnails && thumbnails.length > 0 ? thumbnails[0].url : 'No thumbnail available';
        // //const thumbnail = info.videoDetails.thumbnails[0].url;
        // const formats = ytdl.filterFormats(info.formats,'videoandaudio');
        // const size = formats[0] ? formats[0].contentLength : 'Unkown size';

        // const sanitizeTitle = sanitizeFilenameShorts(title) || "Video"; 
        // res.json({
        //     title:sanitizeTitle,
        //     thumbnail: thumbnail,
        //     size:size,
        //     //downloadLink:`http://localhost:${port}/downShorts?url=${encodeURIComponent(url)}`
        //     downloadLink:`${req.protocol}://${req.get('host')}/downShorts?url=${encodeURIComponent(url)}`
        // })
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title;
        const thumbnails = info.videoDetails.thumbnails;
        const thumbnail = thumbnails && thumbnails.length > 0 ? thumbnails[0].url : 'No thumbnail available';
        const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
        const size = formats[0] ? formats[0].contentLength : 'Unknown size';

        const sanitizeTitle = sanitizeFilenameShorts(title) || "Video";
        res.json({
            title: sanitizeTitle,
            thumbnail: thumbnail,
            size: size,
            downloadLink: `${req.protocol}://${req.get('host')}/downShorts?url=${encodeURIComponent(url)}`
        });
    } catch (error) {
        console.error('Error fetching in shorts link',error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}
exports.downloadShorts = async (req,res) =>{
    const {url} = req.query;
    try {
        if(!url){
            return res.status(400).json({
                status: 'error',
                message: "Missing Url, Paste any valid Shorts Url"
            });
        }

        if(!ytdl.validateURL(url)){
            return res.status(400).json({
                status: 'error',
                message: "Invalid YouTube Shorts URL"
            });
        }

    //     const info = await ytdl.getInfo(url);
    //     const title = info.videoDetails.title;

    //         // Sanitize the filename
    //         const sanitizeTitle = (name) => {
    //             return name.replace(/[<>:"/\\|?*]+/g, '').replace(/[\s]+/g, '_').trim().substring(0, 200);
    //         };
    // const safeTitle = sanitizeTitle(title);
    // const encodedTitle = encodeURIComponent(safeTitle);
    // const sanitizedTitle = sanitizeTitle(encodedTitle) || 'video';

    // const stream = ytdl(url,{quality: 'highest'});

    // res.setHeader('Content-Disposition', `attachment; filename="${sanitizedTitle}.mp4"`);
    // res.setHeader('Content-Type','video/mp4');

    // stream.pipe(res);
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    const sanitizeTitle = (name) => {
        return name.replace(/[<>:"/\\|?*]+/g, '').replace(/\s+/g, '_').trim().substring(0, 200);
    };
    const safeTitle = sanitizeTitle(title) || 'video';

    const stream = ytdl(url, { quality: 'highest' });

    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(safeTitle)}.mp4`);
    res.setHeader('Content-Type', 'video/mp4');

    stream.pipe(res);


    stream.on('end',async () => {
        try {
            await DataModel.findOneAndUpdate(
                {url},
                {$inc: {TotalNoOfShortsVideo:1}},
                {new:true, upsert:true}
            )
        } catch (error) {
            console.error('Error in updating in database',error);
        }
    });

    stream.on('error', (error) => {
        console.error('Error during streaming:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error during video streaming',
        });
    });

    //ytdl(url, { quality: 'highest' }).pipe(res);


    } catch (error) {
        console.error('Error in streming Video',error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

