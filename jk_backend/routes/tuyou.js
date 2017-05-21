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
    var addSQL = mysql.format("insert into jk_tuyou(u_id,ty_destination,ty_stay_start,ty_stay_end,ty_description,ty_photo_1,ty_photo_2,ty_photo_3," +
        "ty_photo_4,ty_contact,ty_status,ty_create_time,ty_update_time) values (?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [ req.body.u_id,req.body.ty_destination, new Date(req.body.ty_stay_start),new Date(req.body.ty_stay_end),req.body.ty_description,null,null,null,null,null,1,date,date]);

    console.log(addSQL);
    connection.query(addSQL, function (err, result) {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});


router.get('/getTuyou', function(req, res, next) {

    var query = "select ty_id, (select count(tm_id) from jk_tuyou_messages as jktm where jktm.ty_id=jkt.ty_id) as comments, (select u_name from jk_users as jku where jku.u_id=jkt.u_id) as u_name, (select u_avatar from jk_users as jku where jku.u_id=jkt.u_id) as u_avatar,ty_destination,ty_stay_start,ty_stay_end,ty_description from jk_tuyou as jkt where 1=1 and jkt.u_id != ? ";

    if(req.param('des')){
        query += "and jkt.ty_destination='" + req.param('des') + "';";
    }

    if(req.param('u_id')) {
        query = mysql.format(query,[req.param('u_id')]);
    } else {
        query = mysql.format(query,[0]);
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
