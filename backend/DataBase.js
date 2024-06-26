const mongoose = require('mongoose');

const DB = process.env.MONGODB_URI.replace("<PASSWORD>",process.env.MONGODB_PASS);

const Database = () =>{
    mongoose.connect(DB).then((con)=>{
        console.log('Databse connected successfully');
    }).catch((error) =>{
        console.log('Error connecting in Database', error);
    });
}
module.exports = Database;