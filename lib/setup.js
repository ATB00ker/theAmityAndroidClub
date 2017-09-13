mysql = require('mysql');

//Application Configuration


//Connect to mysql
var database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Tiger"
});

//Create database
database.query("create database amityAndroidClub");
database.query("use amityAndroidClub");
database.query("create table adminCredentials(id int(3) NOT NULL AUTO_INCREMENT, name VARCHAR(40) NOT NULL, username VARCHAR(40) NOT NULL UNIQUE , password VARCHAR(40) NOT NULL, adminLevel int(1) NOT NULL DEFAULT 0, PRIMARY KEY (id))");
database.query("create table adminPosts(id VARCHAR(30) NOT NULL PRIMARY KEY, postTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, postTitle VARCHAR(50) NOT NULL , postContent VARCHAR(800) NOT NULL, postLink VARCHAR(120), postLinkName VARCHAR(40), adminUsername VARCHAR(40))");
database.query("create table loginSecret(id VARCHAR(30) NOT NULL primary key, ipAddress VARCHAR(20), username VARCHAR(40) NOT NULL)");
