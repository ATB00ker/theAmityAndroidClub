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
	function checkAuth(req, res){
		if(req.headers.cookie){
			var cookies = {};
			req.headers && req.headers.cookie.split(';').forEach(function(cookie) {
				var parts = cookie.match(/(.*?)=(.*)$/);
				cookies[ parts[1].trim() ] = (parts[2] || '').trim();
			});
			database.query("SELECT COUNT(*) AS count FROM loginSecret WHERE id = " + mysql.escape(cookies['Holder']) + "and username = " + mysql.escape(cookies['Torch']) , function (err, result, fields){
				if(result[0].count == 1){
					database.query("SELECT adminLevel FROM adminCredentials WHERE username =" + mysql.escape(cookies['Torch']) , function (err, result, fields){
						authenticationStatus = result[0].adminLevel;
						authenticatedAdmin = cookies['Torch'];
					});
				}
			 	else
					authenticationStatus = null;
			});
		} else {
			authenticationStatus = null;
		}
	}

	app.get('/', function (req, res, next) {
		database.query("select * from adminPosts ORDER BY postTime DESC", function (err, result, fields) {
			var adminPostsContainer = result;
			res.render('index', {adminPostsContainer});
		});
	});
	app.get('/login', function (req, res, next) {
		checkAuth(req, res);
		if(authenticationStatus == null)
			res.render('login');
		else
			res.redirect('/admin');
	});
	app.get('/register', function (req, res, next) {
		res.render('register');
	});
	app.get('/manage', function (req, res, next) {
		checkAuth(req, res);
		if(authenticationStatus == 2)
			res.render('manage');
		else
		    res.redirect('/login');
	});
	app.get('/admin', function (req, res, next) {
		checkAuth(req, res);
		if(authenticationStatus > 0) {
			database.query("select * from adminPosts ORDER BY postTime DESC", function (err, result, fields) {
				var adminPostsContainer = result;
				res.render('admin', {adminPostsContainer ,authenticationStatus});
			});
		} else {res.redirect('/login');}
	});
	app.post('/login', function (req, res, next) {
		//Mysql Query
		database.query("select * from adminCredentials where username=" + mysql.escape(req.body.user.name) + " and password=" + mysql.escape(req.body.user.pass) , function (err, result, fields) {
	        if (err) throw err;
			if (result.length != 1){
				req.flash('Error_101', 'Incorrect Credentials!');
				res.render('login');
			}
	        else if ((req.body.user.name == result[0].username) && (req.body.user.pass == result[0].password) && (result[0].adminLevel !=0)){
				var newAdminNumber = keyGenerator.generate() + dateTime.create().now();
				//Storing a copy of cookies on client end.
				res.cookie('Torch',req.body.user.name , { maxAge: 900000, httpOnly: true });
				res.cookie('Holder',newAdminNumber , { maxAge: 900000, httpOnly: true });
				//Saving loginSecret on Server
				database.query("INSERT INTO loginSecret values(" + mysql.escape(newAdminNumber) + "," + mysql.escape(req.connection.remoteAddress) + "," + mysql.escape(result[0].username) + ")");
				res.render('authenticate');
	        } else {
				req.flash('Error_101', "Incorrect Credentials!");
				res.render('login');
			}
	    });
	});
	app.post('/register', function (req, res, next) {
		database.query("INSERT INTO adminCredentials (name, username, password) VALUES("+mysql.escape(req.body.name)+","+mysql.escape(req.body.handle)+","+mysql.escape(req.body.password)+")", function(err, result, fields){
			if (err) {
				if (err.code == 'ER_DUP_ENTRY'){
					req.flash('Error_102', 'The username is taken, try another!');
					res.render('register');
				} else {
				req.flash('Error_103', 'Unknown Error! Report to management team.');
				res.render('register');
				}
			} else {
				req.flash('Success_101', 'All set! Account Created, Wait for an Administrator to approve your account!');
				res.render('register');
			}
		});
	});
	app.post('/admin', function (req, res, next) {
		checkAuth(req, res);
		if(authenticationStatus > 0){
		var postId = keyGenerator.generate() + dateTime.create().now();
		database.query("INSERT INTO adminPosts (id, postTitle, postContent, postLink, postLinkName, adminUsername) VALUES("+mysql.escape(postId)+","+mysql.escape(req.body.title)+","+mysql.escape(req.body.content)+","+mysql.escape(req.body.cta)+","+mysql.escape(req.body.ctaName)+","+mysql.escape(authenticatedAdmin)+")");
		res.redirect('/admin');
		}
		else res.redirect('/login');
	});
	app.post('/deletePosts', function (req, res, next) {
		checkAuth(req, res);
		if(authenticationStatus > 0){
			database.query("delete from adminPosts where id = " + mysql.escape(req.body.id));
			database.query("select * from adminPosts ORDER BY postTime DESC", function (err, result, fields) {
				res.json(result);
			});
		}
		else res.redirect('/login');
	});
	app.post('/getPosts', function (req, res, next) {
	    database.query("select * from adminPosts where id = " + mysql.escape(req.body.id), function (err, result, fields) {
	        res.json(result);
	    });
	});
	app.post('/newAdminDetailsTable', function (req, res, next) {
		checkAuth(req, res);
		if(authenticationStatus > 1){
			database.query("select * from adminCredentials where adminLevel = '0'", function (err, result, fields) {
				res.json(result);
			});
		}
		else res.redirect('/login');
	});
	app.post('/knownAdminDetailsTable', function (req, res, next) {
		checkAuth(req, res);
		if(authenticationStatus > 1){
			database.query("select id,name,username,adminLevel from adminCredentials where adminLevel > '0' AND username <> " +mysql.escape(authenticatedAdmin)+ " ORDER BY adminLevel ASC", function (err, result, fields) {
				res.json(result);
			});
		}
		else res.redirect('/login');
	});
	app.post('/allowNewAdmin', function (req, res, next) {
		checkAuth(req, res);
		if(authenticationStatus > 1){
			database.query("UPDATE adminCredentials SET adminLevel = '1' where id = " + mysql.escape(req.body.id), function (err, result, fields) {
				if (err) throw err;
				res.end();
		    });
		}
		else res.redirect('/login');
	});
	app.post('/deleteAdminAccount', function (req, res, next) {
		checkAuth(req, res);
		if(authenticationStatus > 1){
			database.query("DELETE FROM adminCredentials where id = " + mysql.escape(req.body.id), function (err, result, fields) {
				if (err) throw err;
				res.end();
			});
		}
		else res.redirect('/login');
	});
	app.post('/changeAdminPrivilege', function (req, res, next) {
		checkAuth(req, res);
		if(authenticationStatus > 1){
			database.query("UPDATE adminCredentials SET adminLevel = "+mysql.escape(req.body.adminLevel) + "where id = " + mysql.escape(req.body.id), function (err, result, fields) {
				if (err) throw err
			});
			database.query("select id,name,username,adminLevel from adminCredentials where id = " + mysql.escape(req.body.id), function (err, result, fields) {
				res.json(result);
			});
		}
		else res.redirect('/login');
	});
	app.get('/logout', function (req, res, next) {
		checkAuth(req, res);
		if (authenticationStatus != null){
			var cookies = {};
			req.headers && req.headers.cookie.split(';').forEach(function(cookie) {
				var parts = cookie.match(/(.*?)=(.*)$/);
					cookies[ parts[1].trim() ] = (parts[2] || '').trim();
			});
			database.query("delete from loginSecret where id=" + mysql.escape(cookies['Holder']));
			res.clearCookie('Holder');
			res.clearCookie('Torch');
			authenticationStatus = null;
		}
			res.redirect('/');
	});
};
