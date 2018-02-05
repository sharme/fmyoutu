'use strict';

var community = angular.module('buybsControllers');



// Controllers for community.
community.controller('TripCtrl', ['$scope', '$cookies', '$window', '$http', '$css', '$sce', function($scope, $cookies, $window, $http, $css, $sce){

    $http({method: 'GET', url: ipAddress + '/footsteps/getFootsteps', params:{index_start: 0, count: 12, u_id: $cookies.get('u_id')}})
        .success(function(data){
            $scope.tripList = data;
        },function(error){
            $scope.error = error;
        });

    $http({method: 'GET', url: ipAddress + '/footsteps/getFootstepsNumber'})
        .success(function(data){
            $scope.number = data[0].number;
        },function(error){
            $scope.error = error;
        });

    $scope.isbusy = false;
    $scope.loadMore = function() {

        if($scope.tripList && $scope.number > $scope.tripList.length) {
            $scope.isbusy = true;
            $http({
                method: 'GET',
                url: ipAddress + '/footsteps/getFootstepsByTag',
                params: {index_start: $scope.tripList.length, count: 3,tag: $scope.tag}
            }).success(function (data) {
                // console.log("data length: " + data.length);
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $scope.tripList.push(data[i]);
                    }
                    $scope.isbusy = false;
                }
            }, function (error) {
                $scope.error = error;
            });
        }
    };

    $scope.loginCheck = function(fs_id) {
        $window.location.href = "#/foot/" + fs_id;
    };

    $scope.bgColorChange = function (divkey) {
        $(".bgColorChange"+divkey).css("background-color",'rgba(239,239,239,0.96)');
    };

    $scope.bgColorRemove = function (divkey) {
        $(".bgColorChange" + divkey).css("background-color",'white');
    };

    
    $scope.tpFilter = function(){
    $scope.tag = $('.search_bar').val();
    $http({method: 'GET', url: ipAddress + '/footsteps/getFootstepsByTag',
        params:{tag: $scope.tag, u_id: $cookies.get('u_id'), index_start: 0, count: 15}
    })
        .success(function(data){
            // console.log(JSON.stringify(data));
            if(!data.errno){
                $scope.tripList = data;
                $scope.isbusy = false;
            }
        }, function(error){
            $scope.error = error;
        });
    };



    $scope.stickBtn = function(id, u_id){
        if($cookies.get('u_id') == undefined){
            $window.location.href = '#/login';
            return;
        }


        $http({method: 'GET', url: ipAddress + '/sticks/search', params: {fs_id: id, u_id: $cookies.get('u_id')}})
            .success(function(data){
                if(data.length > 0 ) {
                    var req = {
                        method: 'POST',
                        url: ipAddress + '/sticks/delete',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            'fs_id': id,
                            'u_id': $cookies.get('u_id')
                        }
                    };

                    $('.like_img' + id).attr('src',"img/thumbs-up.png");

                    $http(req).success(function(result){
                        // addEvent($http, $window, $cookies.get('u_id'),eCollect,u_id,eFootstep,id);
                        $(".btnStick" + id).css("background-color","");

                        //GET AND REFRESH STICK NUMBER
                        $http({method: 'GET', url: ipAddress + '/sticks/search', params: {fs_id: id}})
                            .success(function(data){
                                $('.btnStickNum' + id).html(data.length);
                            });

                    }, function(error){
                        console.log(error);
                    });


                } else {
                    var req = {
                        method: 'POST',
                        url: ipAddress + '/sticks/add',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            'fs_id': id,
                            'u_id': $cookies.get('u_id')
                        }
                    };

                    $('.like_img' + id).attr('src',"img/like25.png");

                    $http(req).success(function(result){
                        addEvent($http, $window, $cookies.get('u_id'),eCollect,u_id,eFootstep,id, false);
                        $(".btnStick" + id).css("background-color","#43c17e");

                        //GET AND REFRESH STICK NUMBER
                        $http({method: 'GET', url: ipAddress + '/sticks/search', params: {fs_id: id}})
                            .success(function(data){
                                $('.btnStickNum' + id).html(data.length);
                            });
                    }, function(error){
                        console.log(error);
                    });
                }
            }, function(error){
                console.log(error);
            });

    };



    $scope.followUpBtn = function(id) {

        if($cookies.get('u_id') == undefined){
            $window.location.href = '#/login';
            return;
        }

        if($(".foot_wrapper-main_follow").text() == "已关注") {
            return;
        }

        $http({method: 'GET', url: ipAddress + '/followers/getFollowCheck', params:{u_id:id, fl_fl_id:$cookies.get('u_id')}})
            .success(function(data){
                if(data.length == 0){
                    var reqData = {
                        u_id: id,
                        fl_fl_id: $cookies.get('u_id')
                    };
                    var req = {
                        method: 'POST',
                        url: ipAddress + '/followers/add',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: reqData
                    };

                    $http(req).success(function(result){
                        addEvent($http, $window, $cookies.get('u_id'),eFollow,id,ePeople,id, true);
                    }, function(error){
                        console.log(error);
                    });
                } else {
                    $(".trip_info_follow").text('已关注');
                }

            }, function(error){
                $scope.error = error;
            });
    };



}]);

community.controller('TopicCtrl', ['$scope', '$cookies', '$window', '$http','$routeParams','$css','$sce', function($scope, $cookies, $window, $http, $routeParams, $css,$sce){

    $http({method: 'GET', url: ipAddress + '/topics/getTopicsByTPID', params:{tp_id: $routeParams.tp_id}})
        .success(function(data){
            $scope.topic = data[0];
            $scope.checkUser = $scope.topic.u_id == $cookies.get('u_id')? true: false;
        },function(error){
            $scope.error = error;
        });

    $http({method: 'GET', url: ipAddress + '/topicComments/getCommentsByTPID', params:{tp_id: $routeParams.tp_id}})
        .success(function(data){
            console.log(data);
            $scope.comments = data;
            $scope.commentNum = data.length;
        },function(error){
            $scope.error = error;
        });

    $http({method: 'GET', url: ipAddress + '/topicClicks/search', params:{tp_id: $routeParams.tp_id}})
        .success(function(data){
            $scope.clicks = data;
        },function(error){
            $scope.error = error;
        });

    $scope.renderHtml = function(value) {
        return $sce.trustAsHtml(value);
    };

    $scope.replay = {m_content: '从这里开始输入内容...'};

    $scope.likeBtn = function(tp_id,u_id){

        if($cookies.get('u_id') == undefined){
            $window.location.href = '#/login';
            return;
        }

        var like = {
            tp_id: tp_id,
            u_id: $cookies.get('u_id')
        };
        var req = {
            method: 'POST',
            url: ipAddress + '/topicLikes/add',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(like)
        };

        $http(req).success(function(result){
            addEvent($http, $window, $cookies.get('u_id'),eLike,u_id,eTopic,tp_id, true);
        }, function(error){
            console.log(error);
        });
    };


    $scope.editBtn = function(tp_id) {

        $window.location.href = '#/community/topics/editTopic?tp_id=' + tp_id;
        $window.location.reload();
    };



    $scope.submit = function(){

        if($cookies.get('u_id') == undefined){
            $window.location.href = '#/login';
            return;
        }

        var replayData = {
            tp_id: $scope.topic.tp_id,
            u_id: $cookies.get('u_id'),
            tp_cm_to: 0,
            tp_cm_content: CKEDITOR.instances.editor1.getData()
        };

        var req = {
            method: 'POST',
            url: ipAddress + '/topicComments/add',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(replayData)
        };

        console.log("topic comments replied : " + JSON.stringify(replayData));

        $http(req).success(function(result){
            addEvent($http,$window,$cookies.get('u_id'),eComment,$scope.topic.u_id,eTopic,$scope.topic.tp_id, true);
        }, function(error){
            console.log(error);
        });
    };

    $scope.closeTopic = function() {
        $window.location.href = '#/community/index';
    };

    $scope.loginCheck = function(){
        if($cookies.get('u_id') == undefined){
            return true;
        }
    };


}]);





