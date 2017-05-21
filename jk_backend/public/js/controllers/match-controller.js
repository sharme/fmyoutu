'use strict';

var match = angular.module('buybsControllers');

// var ipAddress = 'http://180.76.152.112';

buybsControllers.controller('tuyouCtrl', ['$scope', '$cookies', '$window', '$http','$routeParams','$css', function($scope, $cookies, $window, $http, $routeParams,$css){

    $http({method: 'GET', url: ipAddress + '/countries/getCountries'})
        .success(function(data){
            $scope.destinations = data;
        }, function(error){
            $scope.error = error;
        });

    $scope.des = {
        u_id: $cookies.get('u_id'),
        ty_destination: '',
        ty_stay_start: '',
        ty_stay_end: '',
        ty_description: ''
    };

    $scope.browserTuyou = function () {
        $window.location.href = '#/tuyou/match';
    };


    $scope.nextStep = function () {
        $('#step_one').css("display","none");
        $('#step_two').css("display","block");
    };

    $scope.PrevStep = function () {
        $('#step_one').css("display","block");
        $('#step_two').css("display","none");
    };

    $scope.matchTuyou = function() {

        if($cookies.get('u_id') == undefined){
            $window.location.href = "#/login";
        }


        if($scope.des.ty_destination != '' && $scope.des.ty_stay_start != '' && $scope.des.ty_stay_end != '' && $scope.des.ty_description != '') {

            var req = {
                method: 'POST',
                url: ipAddress + '/tuyou/add',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify($scope.des)
            };
            $http(req).success(function (result) {
                if (!result.errno) {
                    $window.location.href = '#/tuyou/match?des=' + $scope.des.ty_destination;
                } else {
                    $('.matchMsg').html('没有找到合适的图友.');
                }
            }, function (error) {
                console.log(error);
            });
        } else {
            $('.matchMsg').html('没有找到合适的图友.');
        }
    };

    $scope.selDestination = function(val) {
        $scope.des.ty_destination = val;
        $('.tuyou_destination_list').css('display','none')
    };



}]);

buybsControllers.controller('matchCtrl', ['$scope', '$cookies', '$window', '$http','$routeParams','$css', function($scope, $cookies, $window, $http, $routeParams,$css){

    $http({method: 'GET', url: ipAddress + '/tuyou/getTuyou', params: {des: $routeParams.des, u_id: $cookies.get('u_id')}})
        .success(function(data){
            if(data && data.length < 1) {
                $('.match_result_msg').html("抱歉, 暂时还没有图友在这附近活动");
            } else {
                $scope.results = data;
            }
        }, function(error){
            $scope.error = error;
        });

    var hidden = true;
    $scope.replyList = function(ty_id) {
        if(hidden) {
            $http({method: 'GET', url: ipAddress + '/tuyouMessages/getMessages', params: {ty_id: ty_id}})
                .success(function (data) {
                    $scope.messages = data;
                    $('.comments').css('display', 'none');
                    $('.hide'+ty_id).css('display', 'block');
                }, function (error) {
                    $scope.error = error;
                });
        }
    };

    $scope.hiddenReply = function(ty_id) {
        $('.hide'+ty_id).css('display', 'none'); hidden = true;
    };

    $scope.tm = {
        ty_id: '',
        u_id: '',
        tm_message: ''
    };

    $scope.submit = function(ty_id){

        if($cookies.get('u_id') == undefined){
            $window.location.href = '#/login';
            return;
        }

        var data = {
            ty_id: ty_id,
            u_id: $cookies.get('u_id'),
            tm_message: $scope.tm.tm_message
        };

        var req = {
            method: 'POST',
            url: ipAddress + '/tuyouMessages/add',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        };

        $http(req).success(function(result){

            if(!result.errno){
                $http({method: 'GET', url: ipAddress + '/tuyouMessages/getMessages', params: {ty_id: ty_id}})
                    .success(function (data) {
                        $scope.messages = data;
                        $('.comment_reply_input_val').val('');
                    }, function (error) {
                        $scope.error = error;
                    });
            }

        }, function(error){
            console.log(error);
        });
    };




}]);

