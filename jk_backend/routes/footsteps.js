var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var auth = require('./auth.js');
var bodyParser = require('body-parser');
var requestIp = require('request-ip');
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

router.get('/getFootsteps', function(req, res, next) {

    var u_id = req.param('u_id');
    
    var criteriaSQL = "";
    if(u_id) {
         criteriaSQL = mysql.format("select fs_id,u_id,fs_pic,fs_des,fs_from," +
            "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id) as sticks," +
                 "(select u_avatar from jk_users as jku where jku.u_id=jkf.u_id) as u_tag," +
            "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id and jks.u_id=?) as stick_status," +
            "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id) as likes," +
            "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id and jkl.u_id=?) as like_status," +
            "(select (select u_avatar from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_avatar," +
            "(select (select u_name from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_name," +
            "(select cm_content from jk_comments as jkc where jkc.fs_id = jkf.fs_id limit 1) as cm_content," +
            "fs_smallImg, fs_bigImg, fs_create_time " +
            " from jk_footsteps as jkf where jkf.fs_status=1 ",[req.param('u_id'),req.param('u_id')]);
    } else {
        criteriaSQL = "select fs_id,u_id,fs_pic,fs_des,fs_from," +
            "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id) as sticks," +
                "(select u_avatar from jk_users as jku where jku.u_id=jkf.u_id) as u_tag," +
            "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id) as likes," +
            "(select (select u_avatar from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_avatar," +
            "(select (select u_name from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_name," +
            "(select cm_content from jk_comments as jkc where jkc.fs_id = jkf.fs_id limit 1) as cm_content," +
            "fs_smallImg, fs_bigImg, fs_create_time " +
            " from jk_footsteps as jkf where jkf.fs_status=1 ";
    }
    
    console.log(req.param('fs_from'));

    if(req.param('fs_from')){
        criteriaSQL += " and jkf.fs_from='" + req.param('fs_from') + "'";
    }
    criteriaSQL += " order by fs_create_time desc";
    
    if(req.param('index_start') && req.param('count')) {
        criteriaSQL += " limit " + req.param('index_start') + "," + req.param('count');
    }

    console.log(criteriaSQL);

    connection.query(criteriaSQL, function(err, result) {
        if(err) {
            res.send(err);
        } else {
            var log = u_id?"用户: " + u_id + " 访问了主页":'游客 访问了主页.';
            var ipAddress = requestIp.getClientIp(req);
            var insertLog = mysql.format("insert into jk_logs(lg_content,lg_ip,lg_create_time) values(?,?,?)",[log,ipAddress,date]);
            connection.query(insertLog, function(err, result){
                console.log(insertLog);
                if(err)
                    console.log(err);
                else 
                    console.log(result);
            });



            res.send(result);
        }
    })
});

router.get('/getFootstepsByTag', function(req, res, next) {

    var u_id = req.param('u_id');

    var criteriaSQL = "";
    if(req.param('tag')) {
        criteriaSQL = "select fs_id,u_id,fs_pic,fs_des,fs_from," +
            "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id) as sticks," +
            "(select u_avatar from jk_users as jku where jku.u_id=jkf.u_id) as u_tag," +
            "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id) as likes," +
            "(select (select u_avatar from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_avatar," +
            "(select (select u_name from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_name," +
            "(select cm_content from jk_comments as jkc where jkc.fs_id = jkf.fs_id limit 1) as cm_content," +
            "fs_smallImg, fs_bigImg, fs_create_time " +
            " from jk_footsteps as jkf where jkf.fs_status=1 and jkf.fs_id in (select fs_id from jk_tag_footsteps as jktf where jktf.tg_id = (select tg_id from jk_tags as jkt where jkt.tg_name like '%" + req.param('tag') + "%')) ";

    } else {
        criteriaSQL = "select fs_id,u_id,fs_pic,fs_des,fs_from," +
            "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id) as sticks," +
            "(select u_avatar from jk_users as jku where jku.u_id=jkf.u_id) as u_tag," +
            "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id) as likes," +
            "(select (select u_avatar from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_avatar," +
            "(select (select u_name from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc where jkc.fs_id=jkf.fs_id limit 1) as u_name," +
            "(select cm_content from jk_comments as jkc where jkc.fs_id = jkf.fs_id limit 1) as cm_content," +
            "fs_smallImg, fs_bigImg, fs_create_time " +
            " from jk_footsteps as jkf where jkf.fs_status=1 ";
    }

    criteriaSQL += " order by fs_create_time desc";
    if(req.param('index_start') && req.param('count')) {
        criteriaSQL += " limit " + req.param('index_start') + "," + req.param('count');
    }

    console.log(criteriaSQL);

    connection.query(criteriaSQL, function(err, result) {
        if(err) {
            res.send(err);
        } else {
            var log = u_id?"用户: " + u_id + " 访问了主页":'游客 访问了主页.';
            var ipAddress = requestIp.getClientIp(req);
            var insertLog = mysql.format("insert into jk_logs(lg_content,lg_ip,lg_create_time) values(?,?,?)",[log,ipAddress,date]);
            connection.query(insertLog, function(err, result){
                console.log(insertLog);
                if(err)
                    console.log(err);
                else
                    console.log(result);
            });

            res.send(result);
        }
    })
});

router.get('/getFootstepsByUID', function(req, res, next) {
    var criteriaSQL = mysql.format("select fs_id,u_id,fs_pic,fs_des," +
        "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id) as sticks," +
        "(select u_avatar from jk_users as jku where jku.u_id=jkf.u_id) as u_tag," +
        "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id) as likes," +
        "(select (select u_avatar from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc limit 1) as u_avatar," +
        "(select (select u_name from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc limit 1) as u_name," +
        "(select cm_content from jk_comments as jkc where jkc.fs_id = jkf.fs_id limit 1) as cm_content, fs_smallImg, fs_bigImg, fs_create_time" +
        " from jk_footsteps as jkf where jkf.u_id = ?",[req.param('u_id')]);

    criteriaSQL += " order by fs_create_time desc";
    if(req.param('index_start') && req.param('count')) {
        criteriaSQL += " limit " + req.param('index_start') + "," + req.param('count');
    }
    
    connection.query(criteriaSQL, function(err, result) {
        if(err) {
            res.send("Error: " + err);
        } else {
            res.send(result);
        }
    })
});

router.get('/getFootstepsNumber', function(req, res, next) {
    var criteriaSQL = "select count(*) as number from jk_footsteps;";

    connection.query(criteriaSQL, function(err, result) {
        if(err) {
            res.send("Error: " + err);
        } else {
            res.send(result);
        }
    })
});

router.get('/getStickFootstepsByUID', function(req, res, next) {
    var criteriaSQL = mysql.format("select fs_id,u_id,fs_pic,fs_des," +
        "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id) as sticks," +
        "(select u_avatar from jk_users as jku where jku.u_id=jkf.u_id) as u_tag," +
        "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id) as likes," +
        "(select (select u_avatar from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc limit 1) as u_avatar," +
        "(select (select u_name from jk_users as jku where jku.u_id = jkc.u_id) from jk_comments as jkc limit 1) as u_name," +
        "(select cm_content from jk_comments as jkc where jkc.fs_id = jkf.fs_id limit 1) as cm_content, fs_smallImg, fs_bigImg, fs_create_time" +
        " from jk_footsteps as jkf where jkf.fs_id IN (select fs_id from jk_sticks as jks where jks.u_id = ?)",[req.param('u_id')]);
    criteriaSQL += " order by fs_create_time desc";
    if(req.param('index_start') && req.param('count')) {
        criteriaSQL += " limit " + req.param('index_start') + "," + req.param('count');
    }
    
    connection.query(criteriaSQL, function(err, result) {
        if(err) {
            res.send("Error: " + err);
        } else {
            res.send(result);
        }
    })
});

router.post('/create', function(req, res, next) {

    
    if(req.body.secret == auth.encrypt(req.body.u_id)) {

        var createSQL = mysql.format("insert into jk_footsteps(fs_pic,fs_des,fs_from,u_id,fs_bigImg,fs_smallImg,fs_create_time,fs_update_time, fs_status, fs_pic2, fs_pic3) values(?,?,?,?,?,?,?,?,?,?,?)", [req.body.fs_pic, req.body.fs_desc, '中国', req.body.u_id, req.body.fs_bigImg, req.body.fs_smallImg, date, date,0, req.body.fs_pic2, req.body.fs_pic3]);

        connection.query(createSQL, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        })
    } else {
        res.send({errno: 1001, code: 'access denied'});
    }
});

router.post('/delete', function(req, res, next) {
    var createSQL = mysql.format("delete from jk_footsteps where fs_id=?", [req.body.fs_id]);

    connection.query(createSQL, function (err, result) {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});

router.get('/getFootstepsDetail', function (req, res, next) {
   var criteriaSQL = mysql.format("select fs_id,u_id,fs_des,fs_pic," +
       "(select count(*) from jk_comments as jkc where jkc.fs_id = jkf.fs_id) as comments," +
       "(select count(*) from jk_sticks as jks where jks.fs_id = jkf.fs_id) as sticks," +
       "(select count(*) from jk_likes as jkl where jkl.fs_id = jkf.fs_id) as likes," +
       "(select u_name from jk_users as jku where jku.u_id = jkf.u_id) as u_name," +
           "(select u_avatar from jk_users as jku where jku.u_id = jkf.u_id) as u_avatar," +
       "(select u_slogan from jk_users as jku where jku.u_id = jkf.u_id) as u_slogan, fs_smallImg, fs_bigImg, fs_pic2, fs_pic3 from jk_footsteps as jkf where jkf.fs_id = ?", [req.param('fs_id')]);

    connection.query(criteriaSQL, function (err, result) {
        if(err) {
            res.send("Error: " + err);
        } else {
            res.send(result);
        }
    })


});

router.get('/getNext', function (req, res, next) {
    var criteriaSQL = "select fs_id from jk_footsteps as jkf where jkf.fs_status = 1 order by fs_create_time desc ";

    connection.query(criteriaSQL, function (err, result) {
        if(err) {
            res.send(err);
        } else {
            console.log(JSON.stringify(result));
            for(var index = 0; index < result.length; index ++ ){

                console.log("result= " + result[index].fs_id + " == " + req.param('fs_id'));
                if(result[index].fs_id == req.param('fs_id')) {
                    
                    if(index+1 < result.length) {
                        return res.send(result[index+1]);
                    } else {
                        return res.send({errno: 1005, code: "no next picture can be found."});
                    }        
                }
            }
            res.send({errno: 1005, code: "no next picture can be found."});
        }
    })
});

router.get('/getPrev', function (req, res, next) {
    var criteriaSQL = "select fs_id from jk_footsteps as jkf where jkf.fs_status = 1 order by fs_create_time desc";

    connection.query(criteriaSQL, function (err, result) {
        if(err) {
            res.send(err);
        } else {
            console.log(JSON.stringify(result));
            for(var index = 0; index < result.length; index ++ ){

                console.log("result= " + result[index].fs_id + " == " + req.param('fs_id'));
                if(result[index].fs_id == req.param('fs_id')) {

                    if(index-1 >= 0) {
                        return res.send(result[index-1]);
                    } else {
                        return res.send({errno: 1005, code: "no next picture can be found."});
                    }
                }
            }
            res.send({errno: 1005, code: "no next picture can be found."});
        }
    })
});


router.get('/getFootstepsByNewest', function (req, res, next) {

});




module.exports = router;
