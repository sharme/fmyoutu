'use strict';

/* App Module */

var buybs = angular.module('jk_backend', [
  'ngRoute',
  'buybsControllers',
    'ngCookies',
    'ngSanitize',
    'infinite-scroll',
    'angularCSS'
]).value("THROTTLE_MILLISECONDS", 3000);

// you might call this after your module initalization
// angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 500);

buybs.controller('defaultCtrl', function($scope) {

    $scope.sizeM = true;
    
});


buybs.config(function($routeProvider, $cssProvider){

    angular.extend($cssProvider.defaults, {



        breakpoints: {
            mobile: '(max-width: 550px)',
            desktop: '(min-width: 600px)'
        }
    });
    
    

    $routeProvider.
    when('/', {
        templateUrl: 'views/tp/tp.html',
        controller: 'TripCtrl',
        css: [
            {
                href: '../views/tp/css/tp-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../views/tp/css/tp.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/foot', {
        templateUrl: 'views/homepage.html',
        controller: 'FootstepsListCtrl',
        css: [
            {
                href: '../css/home/footstep-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/home/footstep.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/foot/:footId',{
        templateUrl: 'views/footDetail.html',
        controller: 'FootDetailCtrl',
        css: [
            {
                href: '../css/home/footdetail-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/home/footdetail.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/signUpCompleted', {
        templateUrl: 'views/account/complete.html'
    }).
    when('/login', {
        templateUrl: 'views/account/login.html',
        controller: 'LoginController',
        css: [
            {
                href: '../css/account/login-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/account/login.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/register', {
        templateUrl: 'views/account/register.html',
        controller: 'RegisterCtrl',
        css: [
            {
                href: '../css/account/register-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/account/register.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/recovery_pwd', {
        templateUrl: 'views/account/recovery_pwd.html',
        controller: 'RecoveryPwdCtrl',
        css: [
            {
                href: '../css/account/register-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/account/register.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/reset_pwd', {
        templateUrl: 'views/account/reset_pwd.html',
        controller: 'ResetPwdCtrl',
        css: [
            {
                href: '../css/account/reset-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/account/reset.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/reset_result', {
        templateUrl: 'views/account/reset_result.html',
        controller: 'ResetResultCtrl',
        css: [
            {
                href: '../css/account/reset-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/account/reset.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/email_registration', {
        templateUrl: 'views/account/email_registration.html',
        controller: 'EmailRegistrationCtrl',
        css: [
            {
                href: '../css/account/email_registration-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/account/email_registration.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/email_login', {
        templateUrl: 'views/account/email_login.html',
        controller: 'EmailLoginCtrl',
        css: [
            {
                href: '../css/account/login-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/account/login.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/email_recovery_pwd', {
        templateUrl: 'views/account/email_recovery_pwd.html',
        controller: 'EmailRecoveryPwdCtrl',
        css: [
            {
                href: '../css/account/email_registration-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/account/email_registration.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/email_reset', {
        templateUrl: 'views/account/email_reset.html',
        controller: 'EmailResetCtrl',
        css: [
            {
                href: '../css/account/email_registration-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/account/email_registration.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/profile',{
        templateUrl: 'views/profile/profile.html',
        controller: 'ProfileController',
        css: [
            {
                href: '../css/profile/profile-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/profile/profile.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/profile/edit',{
        templateUrl: 'views/profile/edit.html',
        controller: 'ProfileEditController',
        css: [
            {
                href: '../css/profile/edit-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/profile/edit.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/footsteps/add',{
        templateUrl: 'views/footstep/add.html',
        controller: 'FootstepAddController',
        css: [
            {
                href: '../css/footstep/add-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/footstep/add.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/account/services',{
        templateUrl: 'views/account/services.html',
        // controller: 'FootstepAddController',
        css: [
            {
                // href: '../css/footstep/add-m.css',
                breakpoint: 'mobile'
            }, {
                // href: '../css/footstep/add.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/tool/pixel',{
        templateUrl: 'views/ptool/tool.html',
        controller: 'pixelController',
        css: [
            {
                href: '../css/tool/pixel-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/tool/pixel.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/message',{
        templateUrl: 'views/message/message.html',
        controller: 'MessageController',
        css: [
            {
                href: '../css/default-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/default.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/about',{
        templateUrl: 'views/about/about.html',
        controller: 'AboutController',
        css: [
            {
                href: '../css/about/about-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/about/about.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/community/index', {
        controller: 'CommunityCtrl',
        templateUrl: 'views/community/index.html',
        css: [
            {
                href: '../css/community/community-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/community/community.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/community/topics/addTopic',{
        templateUrl: 'views/community/addTopic.html',
        controller: 'AddTopicCtrl',
        css: [
            {
                href: '../css/community/community-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/community/community.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/community/topics/editTopic',{
        templateUrl: 'views/community/editTopic.html',
        controller: 'editTopicCtrl',
        css: [
            {
                href: '../css/community/community-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/community/community.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/community/topics/:tp_id',{
        templateUrl: 'views/community/topic.html',
        controller: 'TopicCtrl',
        css: [
            {
                href: '../css/community/community-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/community/community.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/tuyou/index',{
        templateUrl: 'views/tuyou/index.html',
        controller: 'tuyouCtrl',
        css: [
            {
                href: '../css/tuyou/tuyou-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/tuyou/tuyou.css',
                breakpoint: 'desktop'
            }
        ]
    }).
    when('/adv/index',{
        templateUrl: 'views/adv/index.html'
        // ,
        // css: [
        //     {
        //         href: '../css/tuyou/tuyou-m.css',
        //         breakpoint: 'mobile'
        //     }, {
        //         href: '../css/tuyou/tuyou.css',
        //         breakpoint: 'desktop'
        //     }
        // ]
    }).
    when('/tuyou/match',{
        templateUrl: 'views/tuyou/match.html',
        controller: 'matchCtrl',
        css: [
            {
                href: '../css/tuyou/tuyou-m.css',
                breakpoint: 'mobile'
            }, {
                href: '../css/tuyou/tuyou.css',
                breakpoint: 'desktop'
            }
        ]
    });

});


