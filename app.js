var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');


var app = express();

// view engine setupexpress.router
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(session({
    resave: true, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'love'
}));

global.config = JSON.parse(fs.readFileSync(__dirname+'/config.json'));
//,,auth: { "authSource": "feng" }
mongoose.connect(global.config.mongodb_ip,{ useNewUrlParser: true ,user: "fengAdmin",pass: "123465"});
//mongoose.connect("mongodb://192.168.56.101/user");

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("open success");
});


app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    if (!req.session.user) {
        req.session.user = {account:"admin"};
        next();
        return;
        if(req.url.indexOf("/free/")>-1){
            next();//如果请求的地址是登录则通过，进行下一个请求
        }
        else
        {
            res.redirect('/admin/login.html');
        }
    } else if (req.session.user) {
        next();
    }
    //next(createError(404));
});




// catch 404 and forward to error handler





// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



/**
 * 自个添加的
 */
if('development' === app.get('env')){
    app.set('showStackError', true);          // 输出报错信息
    app.locals.pretty = true;                 // 源代码格式化
    mongoose.set('debug', true);              // 数据库报错信息
}

require('./router')(app);


module.exports = app;
