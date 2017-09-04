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
database.query("create table adminCredentials(id int(3) not null primary key, username varchar(40) not null , password varchar(40) not null)");
database.query("create table adminPosts(id int(3) not null primary key, postTitle varchar(50) not null , postContent varchar(800) not null, postLink varchar(120), postLinkName varchar(40))");
database.query("create table loginSecret(id int(3) not null primary key, ipAddress varchar(20), username varchar(40) not null, loginTime varchar(14))");
