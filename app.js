var express = require('express'),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	http = require('http'),
	bodyParser = require('body-parser'),
	session = require('express-session');

var app = express();
var server = http.createServer(app);

// Application Configure
app.use(session({
  secret: 'flash',
  resave: true,
  saveUninitialized: false,
  cookie: { secure: true }
}));
app.set('view engine', 'pug');
app.set('view options', { layout: false });
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Defining the public folder path.
app.use(express.static(path.join(__dirname, '/views')));

require('./lib/routes.js')(app);

app.listen(3000);
console.log('Server Running!\nPath: http://127.0.0.1:3000');
