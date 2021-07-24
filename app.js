//Requires
const express = require('express');
// const upload = require('express-fileupload');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {checkUser,checkAccount,requireAuth} = require('./middleware/authMiddleware');

const utils = require('./util/utils');

const user = require('./routes/user');
const book = require('./routes/book');

//start express
const app = express();


//sets
app.set('view engine','ejs');

//uses
app.use(bodyParser.urlencoded());
// app.use(upload());

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

mongoose.Promise=global.Promise;
//establish connection
mongoose.connect(utils.service.DB,{ useFindAndModify: false,useUnifiedTopology:true,useNewUrlParser:true });

//open connection and start server from here
mongoose.connection.once('open',()=>{
    app.emit('ready');
}).on('error',()=>{
    console.log("Couldn't connect to DB");
    app.emit('error');
})


//start local server
app.on('ready',()=>{
    app.listen(utils.service.port,()=>{
        console.log(`Connection established on port ${utils.service.port} `);
    })
}).on('error',()=>{
    console.log("Error whiles connecting to DB");
});


//routes
app.get('*',checkUser);
app.post('/book',checkAccount);
app.post('/user',checkUser)
// app.get('/',requireAuth,(req,res)=>{res.render('index');});
app.use('/user',user);
app.use('/book',book);

app.get('/',(req,res)=>{
    res.render('index');
})

// app.post('/',(req,res)=>{
//     console.log(req.files);
//     if(req.files){
//         console.log(req.files.cover);
//         res.send(req.files.cover);
//     }
// })

app.use('',(req,res)=>{
res.send("Page not found");
});









