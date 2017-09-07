var util = require('util'),
	dateTime = require('node-datetime'),
	keyGenerator = require("random-key"),
	mysql = require('mysql');


//Connect to mysql
var database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Tiger",
  database: "amityAndroidClub"
});

//Redirection of the site.
module.exports = function (app) {
	//Used Check Authentication Status
	 var authenticationStatus = null;

	app.get('/', function (req, res, next) {
		database.query("select * from adminPosts ORDER BY postTime DESC", function (err, result, fields) {
			var adminPostsContainer = result;
			res.render('index', {adminPostsContainer});
		});
	});
	app.get('/login', function (req, res, next) {
		if(authenticationStatus == null)
			res.render('login');
		else
			res.redirect('/admin');
	});
	app.get('/admin', function (req, res, next) {
		if(req.headers.cookie){
			var cookies = {};
			req.headers && req.headers.cookie.split(';').forEach(function(cookie) {
				var parts = cookie.match(/(.*?)=(.*)$/);
				cookies[ parts[1].trim() ] = (parts[2] || '').trim();
			});
			database.query("SELECT COUNT(*) AS count FROM loginSecret WHERE id = " + mysql.escape(cookies['Holder']) + "and username = " + mysql.escape(cookies['Torch']) , function (err, result, fields){
				if(result[0].count == 1) {
					authenticationStatus = cookies['Torch'];
					database.query("select * from adminPosts ORDER BY postTime DESC", function (err, result, fields) {
						var adminPostsContainer = result;
						res.render('admin', {adminPostsContainer});
					});
				} else {res.redirect('/login');}
			});
		} else {
			res.redirect('/login');
		}
	});
	app.post('/login', function (req, res, next) {
		//Mysql Query
		database.query("select * from adminCredentials where username=" + mysql.escape(req.body.user.name) + " and password=" + mysql.escape(req.body.user.pass) , function (err, result, fields) {
	        if (err) throw err;
			if (result.length != 1){
				res.redirect('/login');
			}
	        else if ((req.body.user.name == result[0].username) && (req.body.user.pass == result[0].password)){
				var newAdminNumber = keyGenerator.generate() + dateTime.create().now();
				//Saving loginSecret on Server
				database.query("INSERT INTO loginSecret values(" + mysql.escape(newAdminNumber) + "," + mysql.escape(req.connection.remoteAddress) + "," + mysql.escape(result[0].username) + ")");
				//Storing a copy of cookies on client end.
				res.cookie('Torch',req.body.user.name , { maxAge: 900000, httpOnly: true });
				res.cookie('Holder',newAdminNumber , { maxAge: 900000, httpOnly: true });
				res.redirect('/admin');
	        }
	    });
	});
	app.post('/admin', function (req, res, next) {
		var postId = keyGenerator.generate() + dateTime.create().now();
		database.query("INSERT INTO adminPosts (id, postTitle, postContent, postLink, postLinkName, adminUsername) VALUES("+mysql.escape(postId)+","+mysql.escape(req.body.title)+","+mysql.escape(req.body.content)+","+mysql.escape(req.body.cta)+","+mysql.escape(req.body.ctaName)+","+mysql.escape(authenticationStatus)+")");
		res.redirect('/admin');
	});
	app.get('/logout', function (req, res, next) {
		var cookies = {};
		req.headers && req.headers.cookie.split(';').forEach(function(cookie) {
			var parts = cookie.match(/(.*?)=(.*)$/);
				cookies[ parts[1].trim() ] = (parts[2] || '').trim();
		});
		database.query("delete from loginSecret where id=" + mysql.escape(cookies['Holder']));
		res.clearCookie('Holder');
		res.clearCookie('Torch');
		authenticationStatus = null;
		res.redirect('/');
	});
};
