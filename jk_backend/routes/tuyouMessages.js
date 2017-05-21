
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
// Create application/x-www-form-urlencoded parser
var urlencodeParser = bodyParser.urlencoded( { extended: false });

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'fm@youtumi',
    database: 'jk'
});

connection.connect();

var date = new Date();

router.post('/add', function(req, res, next) {
    var addSQL = mysql.format("insert into jk_tuyou_messages(ty_id,u_id,tm_message,tm_create_time) values (?,?,?,?)",
        [req.body.ty_id, req.body.u_id,req.body.tm_message,date]);

    console.log(addSQL);
    connection.query(addSQL, function (err, result) {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});


router.get('/getMessages', function(req, res, next) {

    var query = "select tm_id, (select u_name from jk_users as jku where jku.u_id=jktm.u_id) as u_name, (select u_avatar from jk_users as jku where jku.u_id=jktm.u_id) as u_avatar,tm_message, tm_create_time from jk_tuyou_messages as jktm where 1=1 ";

    if(req.param('ty_id')){
        query += "and jktm.ty_id=" + req.param('ty_id');
    }

    console.log(query);
    connection.query(query, function (err, result) {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});




module.exports = router;
