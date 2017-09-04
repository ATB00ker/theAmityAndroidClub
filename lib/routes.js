var util = require('util'),
	dateTime = require('node-datetime'),
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
	app.get('/', function (req, res, next) {
		res.render('index');
	});
	app.get('/login', function (req, res, next) {
		res.render('login', { flash: req.flash() } );
	});
	app.get('/admin', function (req, res, next) {
		res.render('admin');
	});
	app.get('/storedPosts', function (req, res, next) {
		console.log("Perfect");
	});
	app.post('/login', function (req, res, next) {
		//Mysql Query
		database.query("select * from adminCredentials where username=" + mysql.escape(req.body.user.name) + " and password="+ mysql.escape(req.body.user.pass) , function (err, result, fields) {
	        if (err) throw err;
			if (result.length!=1){
				req.flash('error', 'Incorrect Credentials!');
				res.redirect('/login');
			}
	        else if ((req.body.user.name == result[0].username) && (req.body.user.pass == result[0].password)){
				var newAdminNumber = null;
				var adminLogNumber = database.query("SELECT COUNT(*) FROM adminCredentials");
				if(adminLogNumber == 0)
					newAdminNumber = 1;
				else {
					for (var counter = 1; counter <= adminLogNumber; counter++) {
						if(database.query("SELECT id FROM loginSecret WHERE id =" + counter) == null)
						newAdminNumber = counter;
					}
				if(newAdminNumber == null)
					newAdminNumber = adminLogNumber + 1;
				}
				database.query("insert into loginSecret values("+ newAdminNumber +","+ mysql.escape(req.connection.remoteAddress) +","+ result[0].username +"," + dateTime.create().now() +")");
				res.cookie('Torch',req.body.user.name , { maxAge: 900000, httpOnly: true });
				res.cookie('Holder',newAdminNumber , { maxAge: 900000, httpOnly: true });
				res.redirect('/admin');
	        }
	    });
	});
	app.post('/admin', function (req, res, next) {
		// Mysql Query
		database.query("insert into adminPosts values(" + mysql.escape(req.body.title) +","+ mysql.escape(req.body.content)+","+ mysql.escape(req.body.cta)+","+ mysql.escape(req.body.ctaName)+")" , function (err, result, fields) {
			if (err) throw err;
			if (result.length!=1){
			}
			else if ((req.body.user.name == result[0].username) && (req.body.user.pass == result[0].password)){
			}
		});
	});
	app.get('/logout', function (req, res, next) {
		delete req.session.authenticated;
		res.redirect('/');
	});
};
