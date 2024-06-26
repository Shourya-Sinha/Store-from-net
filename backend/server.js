const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({path:'../.env'});


const DatabaseCon = require('./DataBase');

dotenv.config();
const port = process.env.PORT || 8000;

DatabaseCon();

process.on("uncaughtException",(error)=>{
    console.log(error);
    console.log("UNCAUGHT Exception! Shutting down ...");
    process.exit(1);
})






const server = app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON ${port}`);
  });

process.on('unhandledRejection',(err)=>{
    console.log(err);
    console.log("UNHANDLED REJECTION! Shutting down...");
    server.close(()=>{
        process.exit(1);
    });
});
