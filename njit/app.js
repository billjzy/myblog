var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');

//var logger = require('morgan');
var session = require('express-session');
var RedisStore =  require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
var routes = require('./routes/index');
var auth = require('./middlewares/auth');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(config.session_secret));
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
   secret: config.session_secret,
   store: new RedisStore({
    port: config.redis_port,
    host: config.redis_host
   }),
   resave: true, //save the session, even if it's the same
   saveUninitialized: true
}));

app.use(auth.authUser);

app.use('/', routes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(3000, function(){
    console.log('listening to port 3000!');
});

module.exports = app;
