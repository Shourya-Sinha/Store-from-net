const mongoose = require('mongoose');

const UrlDataSchema = new mongoose.Schema({
    VideoLink:{
        type:String,
        required:true,
    },
    TotalNoOfVideo:{
        type:Number,
        default:0,
    },
    TotalNoOfAudio:{
        type:Number,
        default:0,
    },
    url:{
        type:String,
        required:true,
    },
    TotalNoOfShortsVideo:{
        type:Number,
        default:0,
    }
});

const UrlData = mongoose.model('UrlData',UrlDataSchema);

module.exports = UrlData;