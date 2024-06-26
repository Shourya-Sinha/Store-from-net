const DataModel = require('../DataModel/UrlSaving');

//Mp4
const ytdl = require('ytdl-core');

//Mp3
const ffmpeg = require('fluent-ffmpeg');
const {PassThrough} = require('stream');
const { format } = require('path');

// const formatFileSize =(bytes)=>{
//     if(bytes === 0) return '0 Bytes';
//     const k= 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +'' + sizes[i];
// };

// const getFileSize = async (url) =>{
//     const response = await fetch(url, {method:'HEAD'});
//     return response.headers.get('content-length');
// }

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
            console.error("Video Link is required");
            return res.status(400).json({
                status: 'error',
                message: "Video Link is required"
            });
        }

        if (!ytdl.validateURL(VideoLink)) {
            console.error("Invalid YouTube Video Link");
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

        console.log('Formats:', formats);
        console.log('Thumbnail:', thumbnail);
        console.log('Title:', title);
        console.log('Encoded Title:', encodedTitle);
        console.log('File Size:', fileSize);
        console.log('Download URL:', downloadUrl);

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


// exports.convertUrl = async (req,res) =>{
//      try {
//         const { VideoLink } = req.body;

//         if(!VideoLink){
//             return res.status(400).json({
//                 status:'error',
//                 message : "Video Link is required"
//             });
//         }

//         if(!ytdl.validateURL(VideoLink)){
//             return res.status(400).json({
//                 status:'error',
//                 message : "Invalid YouTube Video Link"
//             });
//         }

//         const info = await ytdl.getInfo(VideoLink);
//         const formats = info.formats
//             .filter(format => format.container === 'mp4' && format.hasVideo && format.hasAudio)
//             .map(async (format) => {
//                 const fileSize = format.contentLength || await getFileSize(format.url);
//                 return {
//                     quality: format.qualityLabel,
//                     itag: format.itag,
//                     fileSize: fileSize ? formatFileSize(fileSize) : 'Unknown size'
//                 };
//             });

//               const formatResults = await Promise.all(formats);

//         const sanitizeFileName = (name) => name.replace(/[<>:"/\\|?*]+/g, '');
//         const encodeFileName = (name) => encodeURIComponent(name).replace(/['()]/g, escape).replace(/\*/g, '%2A');

//         const title = sanitizeFileName(info.videoDetails.title);
//         const encodedTitle = encodeFileName(title);
//         const thumbnail = info.videoDetails.thumbnails[0].url;
//         const setingtitle = info.videoDetails.title.replace(/[<>:"/\\|?*]+/g, ''); // sanitize filename

//               const format2 = ytdl.chooseFormat(info.formats, { quality: '18' });
//               const downloadUrl = format2.url;

//               const fileSizeBytes = formats.contentLength || (await getFileSize(downloadUrl));
//               const fileSize = formatFileSize(fileSizeBytes);

//               return res.status(200).json({
//                 status: 'success',
//                 formats: formatResults,
//                 thumbnail,
//                 setingtitle,
//                 encodedTitle,
//                 VideoLink,
//                 fileSize,
  
//             });

//      } catch (error) {
//         console.error('Error generating download link:', error);
//         return res.status(500).json({
//             status: 'error',
//             message: error.message,
//         });
//      }
// }

// exports.downloadVideo = async (req, res) => {
//     const { VideoLink, itag, title } = req.query;

//     if (!VideoLink || !itag || !title) {
//         return res.status(400).json({
//             status: 'error',
//             message: 'Missing video URL, itag, or title',
//         });
//     }

//     try {
//         const info = await ytdl.getInfo(VideoLink);
//         const format = info.formats.find(f => f.itag == itag);

//         if (!format) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Requested format not found',
//             });
//         }

//         const stream = ytdl(VideoLink, { quality: itag });
//         res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);

        
//         stream.pipe(res);

//         stream.on('end', async () => {
//             try {
//                 await DataModel.findOneAndUpdate(
//                     { VideoLink },
//                     { $inc: { TotalNoOfVideo: 1 } },
//                     { new: true, upsert: true }
//                 );
//             } catch (error) {
//                 console.error('Error updating video count:', error);
//             }
//         });

//         stream.on('error', (error) => {
//             console.error('Error during streaming:', error);
//             res.status(500).json({
//                 status: 'error',
//                 message: 'Error during video streaming',
//             });
//         });
//     } catch (error) {
//         console.error('Error downloading video:', error);
//         return res.status(500).json({
//             status: 'error',
//             message: error.message,
//         });
//     }
// };

exports.downloadAudio = async (req,res) =>{
    try {
        const {VideoLink} = req.body;

        if(!VideoLink){
            return res.status(400).json({
                status:'error',
                message : "Video Link is required"
            });
        }
        if(!ytdl.validateURL(VideoLink)){
            return res.status(400).json({
                status:'error',
                message : "Invalid YouTube Video Link"
            });
        }

        const sanitizeFileName = (name) => name.replace(/[<>:"/\\|?*]+/g, '');
        const encodeFileName = (name) => encodeURIComponent(name).replace(/['()]/g, escape).replace(/\*/g, '%2A');

        const info = await ytdl.getInfo(VideoLink);
        const title = sanitizeFileName(info.videoDetails.title);
        const encodedTitle = encodeFileName(title);
       
        res.setHeader('Content-Disposition', `attachment; filename="${encodedTitle}.mp3"`);
        res.setHeader('Content-Type', 'audio/mpeg');

        const stream = ytdl(VideoLink, { filter: 'audioonly' });
        const passThrough = new PassThrough();

        ffmpeg(stream)
            .audioBitrate(128)
            .format('mp3')
            .pipe(passThrough)
            .on('error', (error) => {
                console.error('Error converting video to MP3:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'Error converting video to MP3',
                    thumbnail,
                    encodedTitle,
                });
            });

            passThrough.pipe(res);
            passThrough.on('finish', async () => {
                try {
                  await DataModel.findOneAndUpdate(
                    { VideoLink },
                    { $inc: { TotalNoOfAudio: 1 } },
                    { upsert: true, new: true }
                  );
                } catch (updateError) {
                  console.error('Error updating audio count:', updateError);
                }
              });
    } catch (error) {
        console.error('Error generating MP3 link:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
}

exports.getCounting = async (req,res) =>{
    try {
        var pipeline=[{
            $group:{
                _id:null,
                totalVideo:{$sum: "$TotalNoOfVideo"},
                totalAudio:{$sum: "$TotalNoOfAudio"},
            }
        }];

        var counts = await DataModel.aggregate(pipeline);
        var totalCounts = counts[0] || {totalVideo: 0, totalAudio:0};

        return res.status(200).json({
            status:'success',
            totalVideoCount: totalCounts.totalVideo,
            totalAudioCount: totalCounts.totalAudio,
        });
    } catch (error) {
        console.log('Error in counting',error);
        res.status(500).json({
            status:'error',
            message:error.message
        });
    }
}

