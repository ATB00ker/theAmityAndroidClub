var express = require('express'),
	path = require('path');
var app = express.createServer();

//Defining the public folder path.
app.use(express.static(path.join(__dirname, '/views')));

function checkAuth (req, res, next) { // don't serve following pages until user has logged in successfully.
	if (req.url === '/admin' && (!req.session || !req.session.authenticated)) {
		res.redirect('/login');
		return;
	}
	next();
}

app.configure(function () {
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'flash' }));
	app.use(express.bodyParser());
	app.use(checkAuth);
	app.use(app.router);
	app.set('view engine', 'jade');
	app.set('view options', { layout: false });
});

require('./lib/routes.js')(app);

app.listen(3000);
console.log('Server Running!\nPath: http://127.0.0.1:3000');
