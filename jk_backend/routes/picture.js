var express = require('express');
var router = express.Router();

var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});
var watermark = require('image-watermark');
var qiniu = require("qiniu");
var busboy = require('connect-busboy');
var multipart = require('connect-multiparty');
var easyimg = require('easyimage');
var md5 = require("blueimp-md5");
var http = require('http');
router.use(busboy());

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'WhCKNGaKMNqjMVvnOeq2lidyIlKMvFCqrTAambLK';
qiniu.conf.SECRET_KEY = 'UD6-wbVzrrtmg9hbzd6qQyltumTAqAG75kogznxw';

//要上传的空间
bucket = 'foot';

//上传到七牛后保存的文件名
key = 'my-nodejs-logo.png';


var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'fm@youtumi',
    database: 'jk'
});
connection.connect();
var date = new Date();


var widthPixel = 0;
var heightPixel = 0;
var rotateDegree =0;
var waterMark = 'Made with fmyoutu';
var folder = 0;
var color = '';
// Upload file and response back.
router.post('/uploadPhotos', function(req, res) {

    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('field', function(fieldname, val){
        if(fieldname == 'u_id')
            folder = val;
        if(fieldname == 'widthPixel')
            widthPixel = val;
        if(fieldname == 'heightPixel')
            heightPixel = val;
        if(fieldname == 'rotateDegree')
            rotateDegree = val;
        if(fieldname == 'waterMark' && val)
            waterMark = val;
        if(fieldname == 'color')
            color = val;

        console.log(fieldname + ": " + val);
    });
    
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Upload data: " + JSON.stringify(file) + ",folder = " + folder);
        
        // if(fieldname == 'u_id') {

            filename = new Date().getTime() + filename.substr(filename.lastIndexOf("."));

            var originalFolderPath = __dirname.substr(0, __dirname.length - 7) + "/public/images/original/" + folder;
            var customFolderPath = __dirname.substr(0, __dirname.length - 7) + "/public/images/custom/" + folder;

            fs.exists(originalFolderPath, function (result) {
                if (result) {
                    fstream = fs.createWriteStream(originalFolderPath + "/" + filename);
                    file.pipe(fstream);
                    fstream.on('close', function () {
                        fs.exists(customFolderPath, function (result) {
                            if (result) {
                                resize(filename, folder, customFolderPath, originalFolderPath, res, widthPixel, heightPixel);
                            } else {
                                fs.mkdir(customFolderPath, 0777, function (result) {
                                    if (result) {
                                        resize(filename, folder, customFolderPath, originalFolderPath, res, widthPixel, heightPixel);
                                    } else {
                                        console.log(result);
                                    }
                                });
                            }
                        });

                    });
                } else {
                    fs.mkdir(originalFolderPath, 0777, function (result) {
                        if (result) {
                            fstream = fs.createWriteStream(originalFolderPath + "/" + filename);
                            file.pipe(fstream);
                            fstream.on('close', function () {
                                fs.exists(customFolderPath, function (result) {
                                    if (result) {
                                        resize(filename, folder, customFolderPath, originalFolderPath, res, widthPixel, heightPixel);
                                    } else {
                                        fs.mkdir(customFolderPath, 0777, function (result) {
                                            if (result) {
                                                resize(filename, folder, customFolderPath, originalFolderPath, res, widthPixel, heightPixel);
                                            } else {
                                                console.log(result);
                                            }
                                        });
                                    }
                                });
                            });
                        } else {
                            console.log(result);
                        }
                    });
                }
            });
        // }

    });
});

function resize(filename, folder, customFolderPath, originalFolderPath, res, widthPixel, heightPixel) {

    console.log('resize');

    // if(customFolderPath != null && originalFolderPath != null) {

        easyimg.resize({
            src: originalFolderPath + "/" + filename, dst: customFolderPath + "/" + filename, width: widthPixel, height: heightPixel, ignoreAspectRatio: true
        }).then(
            function (image) {
                console.log('resize custom image width: ' + image.width + " , height: " + image.height);

                if(rotateDegree > 0) {
                    easyimg.rotate({
                        src: customFolderPath + "/" + filename,
                        dst: customFolderPath + "/" + filename,
                        width: widthPixel,
                        height: heightPixel,
                        degree: rotateDegree,
                        background: "#"+color
                    }).then(
                        function (image) {
                            console.log('resize small image: ' + image.width + " , customFolderPath: " + customFolderPath + "/" + filename);
                            
                            if(waterMark != ''){
                                gm(customFolderPath + "/" + filename)
                                    .stroke("#F08080")
                                    .font('Arial')
                                    .fill('#9E9E9E')
                                    .drawText(0, 0, waterMark, 'SouthEast')
                                    .write(customFolderPath + "/" + filename, function (err) {
                                        // if (!err) {
                                        console.log(err);
                                        console.log('watermark done');
                                        uploadFileToQiniu(folder, "images/custom/" + folder + "/" + filename, customFolderPath + "/" + filename, "images/original/" + folder + "/" + filename, originalFolderPath + "/" + filename, res);
                                        // }
                                    });
                            } else {
                                uploadFileToQiniu(folder, "images/custom/" + folder + "/" + filename, customFolderPath + "/" + filename, "images/original/" + folder + "/" + filename, originalFolderPath + "/" + filename, res);
                            }


                            // watermark.embedWatermarkWithCb(customFolderPath + "/" + filename, {'resize': '100%', 'align': 'ltr', 'font': 'Arial.ttf', 'color': 'grey', 'text' : '2017-11-3 / YAO', 'override-image' : 'true'}, function(err){
                            //     console.log(err);
                            //     // if(!err) {
                            //         uploadFileToQiniu(folder, "images/custom/" + folder + "/" + filename, customFolderPath + "/" + filename, "images/original/" + folder + "/" + filename, originalFolderPath + "/" + filename, res);
                            //     // }
                            // });
                        }
                    );
                } else {
                    easyimg.resize({
                        src: originalFolderPath + "/" + filename, dst: customFolderPath + "/" + filename, width: widthPixel, 
                        height: heightPixel,
                        ignoreAspectRatio: true,
                        background: "#" + color
                    }).then(
                        function (image) {
                            console.log('resize small image: ' + image.width);

                            if(waterMark != ''){
                                gm(customFolderPath + "/" + filename)
                                    .stroke("#F08080")
                                    .font('Arial')
                                    .fill('#9E9E9E')
                                    .drawText(10, 0, waterMark, 'SouthEast')
                                    .write(customFolderPath + "/" + filename, function (err) {
                                        // if (!err) {
                                        console.log(err);
                                        console.log('watermark done');
                                        uploadFileToQiniu(folder, "images/custom/" + folder + "/" + filename, customFolderPath + "/" + filename, "images/original/" + folder + "/" + filename, originalFolderPath + "/" + filename, res);
                                        // }
                                    });
                            } else {
                                uploadFileToQiniu(folder, "images/custom/" + folder + "/" + filename, customFolderPath + "/" + filename, "images/original/" + folder + "/" + filename, originalFolderPath + "/" + filename, res);
                            }
                            
                            // uploadFileToQiniu(folder, "images/custom/" + folder + "/" + filename, customFolderPath + "/" + filename, "images/original/" + folder + "/" + filename, originalFolderPath + "/" + filename, res);
                    
                        }
                    );
                }


            }

        );
    // }
    
    // else if(customFolderPath != null && originalFolderPath == null) {
    //     easyimg.resize({
    //         src: originalFolderPath + "/" + filename, dst: smallFolderPath + "/" + filename, width: size
    //     }).then(
    //         function (image) {
    //             console.log('resize mini image: ' + image.width);
    //
    //             updateSmallFileQiniu(folder, "images/mini/" + folder + "/" + filename, smallFolderPath + "/" + filename, null, null, res);
    //
    //         }
    //     );
    // }

}



function uploadFileToQiniu (folder, custom, customPath, original, originalPath, res) {
    //构建上传策略函数
    function uptoken(bucket, small) {
        var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+custom);
        return putPolicy.token();
    }

    //生成上传 Token
    token = uptoken(bucket, custom);

    //要上传文件的本地路径
    filePath = customPath;

    //构造上传函数
    function uploadFile(folder, uptoken, key, localFile) {
        var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
            if(!err) {
                // 上传成功， 处理返回值
                console.log(ret.hash, ret.key, ret.persistentId);


                if(custom == null || original == null){
                    res.send("http://o99spo2ev.bkt.clouddn.com/" + key);
                } else {
                    updateBigFileQiniu(folder, original, originalPath, res, "http://o99spo2ev.bkt.clouddn.com/" + key);
                }

            } else {
                // 上传失败， 处理返回代码
                console.log(err);
            }
        });
    }

//调用uploadFile上传
    uploadFile(folder, token, custom, filePath);

}



function updateBigFileQiniu (folder, key, path, res, customImg) {
    //构建上传策略函数
    function uptoken(bucket, key) {
        var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
        return putPolicy.token();
    }

    //生成上传 Token
    token = uptoken(bucket, key);

    //要上传文件的本地路径
    filePath = path;

    //构造上传函数
    function uploadFile(folder, uptoken, key, localFile) {
        var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
            if(!err) {
                // 上传成功， 处理返回值
                console.log(ret.hash, ret.key, ret.persistentId);

                var data = {
                    "originalImg": "http://o99spo2ev.bkt.clouddn.com/" + key,
                    "customImg": customImg
                };

                console.log('uploaded = ' + JSON.stringify(data));

                //insert uploaded image url to database.
                var sql = mysql.format("insert into jk_pictures(u_id,pc_smallImg,pc_bigImg,pc_original,pc_update_time) values(?,?,?,?,?)",[folder,data.customImg,null, data.originalImg,date]);
                console.log(sql);
                connection.query(sql, function (err, result) {
                    console.log(result);
                });

                res.send(data);
            } else {
                // 上传失败， 处理返回代码
                console.log(err);
            }
        });
    }

//调用uploadFile上传
    uploadFile(folder, token, key, filePath);

}












module.exports = router;