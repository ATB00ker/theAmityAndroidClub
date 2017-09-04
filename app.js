var express = require('express'),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	http = require('http'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	mysql = require('mysql'),
	flash=require("connect-flash");

var app = express();
var server = http.createServer(app);

// Application Configure
app.use(session({
  secret: 'flash',
  resave: true,
  saveUninitialized: false,
  cookie: { secure: true }
}));
app.use(checkAuth);
app.set('view engine', 'pug');
app.set('view options', { layout: false });
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(flash());

//Defining the public folder path.
app.use(express.static(path.join(__dirname, '/views')));

function checkAuth (req, res, next) { // don't serve following pages until user has logged in successfully.
	if (req.url === '/admin') {
		var cookies = {};
		req.headers && req.headers.cookie.split(';').forEach(function(cookie) {
			var parts = cookie.match(/(.*?)=(.*)$/);
			cookies[ parts[1].trim() ] = (parts[2] || '').trim();
		});
		if(database.query("SELECT COUNT(*) FROM loginSecret WHERE id = " + cookies['Holder'] + "and username = "+ cookies['Torch']) == 1)
			res.redirect('/admin');
		return;
	}
	next();
}

require('./lib/routes.js')(app);

app.listen(3000);
console.log('Server Running!\nPath: http://127.0.0.1:3000');
