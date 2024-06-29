const mongoose = require('mongoose');
const DB = process.env.MONGODB_URI.replace("<PASSWORD>", process.env.MONGODB_PASS);

const Database = () => {
    mongoose.connect(DB, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // Remove useFindAndModify option
    }).then(() => {
        console.log('Database connected successfully');
    }).catch((error) => {
        console.error('Error connecting to database:', error);
    });
};

module.exports = Database;
